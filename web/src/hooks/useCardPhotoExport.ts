import { useCallback, useEffect, useRef, useState } from 'react';
import CardGifWorker from '../lib/cardGif.worker.ts?worker';
import { EXPORT_WIDTH, EXPORT_HEIGHT, EXPORT_BACKGROUND, PHOTO_WIDTH, PHOTO_HEIGHT } from '../lib/cardPhotoExport';
import { drawGifFrame, exportStage, GIF_FRAMES, releaseCanvas } from '../lib/cardGifExport';

type EncoderReply = { type: 'ready' } | { type: 'progress'; completed: number; total: number }
  | { type: 'complete'; blob: Blob } | { type: 'error'; error: string };

function requestEncoder(worker: Worker, message: object, signal: AbortSignal, transfer: Transferable[] = []) {
  const response = new Promise<EncoderReply>((resolve, reject) => {
    worker.onmessage = ({ data }: MessageEvent<EncoderReply>) => {
      if (data.type === 'error') reject(new Error(`GIF encoding failed: ${data.error}`));
      else resolve(data);
    };
    worker.onerror = () => reject(new Error('The GIF encoder stopped. Close unused tabs and try again.'));
    worker.onmessageerror = () => reject(new Error('Your browser could not read the GIF encoder response. Try another browser.'));
    worker.postMessage(message, transfer);
  });
  return exportStage(response, signal, 'GIF encoding stopped responding. Keep this tab open and try again.');
}

export function useCardPhotoExport(builderName: string, canExport: boolean) {
  const captureRef = useRef<HTMLDivElement>(null);
  const activeRef = useRef<AbortController | null>(null);
  const mountedRef = useRef(true);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isCapturingPhoto, setIsCapturingPhoto] = useState(false);
  const [exportProgress, setExportProgress] = useState('');
  const [exportError, setExportError] = useState<string | null>(null);
  useEffect(() => {
    mountedRef.current = true;
    return () => { mountedRef.current = false; activeRef.current?.abort(); };
  }, []);
  useEffect(() => { if (!canExport) activeRef.current?.abort(); }, [canExport]);
  const cancelExport = useCallback(() => activeRef.current?.abort(), []);

  const exportPhoto = useCallback(async () => {
    const node = captureRef.current;
    if (!node || !canExport || activeRef.current) return;
    const controller = new AbortController();
    activeRef.current = controller;
    const { signal } = controller;
    setIsGenerating(true);
    setExportError(null);
    setExportProgress('Preparing images…');
    let worker: Worker | undefined;
    const canvases: HTMLCanvasElement[] = [];
    let backgroundUrl: string | undefined;
    let background: HTMLImageElement | undefined;
    const originalStyle = node.style.cssText;
    let stage = 'Preparing images';
    try {
      if (typeof Worker === 'undefined') throw new Error('This browser cannot export GIFs. Use a current browser with Web Workers enabled.');
      const canvas = document.createElement('canvas');
      canvases.push(canvas);
      canvas.width = EXPORT_WIDTH;
      canvas.height = EXPORT_HEIGHT;
      const ctx = canvas.getContext('2d', { willReadFrequently: true });
      if (!ctx) throw new Error('Your browser could not create the export canvas. Close unused tabs or try another browser.');
      const { toCanvas } = await exportStage(import('html-to-image'), signal, 'The image capture module could not load. Refresh and try again.');
      await exportStage(document.fonts.ready, signal, 'Fonts took too long to load. Check your connection and try again.');
      await exportStage(Promise.all(Array.from(node.querySelectorAll('img')).map(image => image.decode().catch(() => { throw new Error('A card image could not load. Refresh the page and check your connection.'); }))), signal,
        'Card images took too long to load. Check your connection and try again.');
      const faces = Array.from(node.querySelectorAll<HTMLElement>('.builder-card-export__card-wrap'));
      if (faces.length !== 2) throw new Error('Both card faces must be loaded before exporting.');
      node.style.visibility = 'visible';
      node.style.left = '-10000px';
      const captured: HTMLCanvasElement[] = [];
      for (const [index, face] of faces.entries()) {
        stage = `Capturing card ${index + 1}/2`;
        setExportProgress(`${stage}…`);
        const capturedFace = await exportStage(toCanvas(face, {
          width: 780, height: 500, pixelRatio: 1.5,
          fetchRequestInit: { signal },
          style: { visibility: 'visible', transform: 'none', boxShadow: 'none' },
        }), signal, 'Card capture took too long. Close unused tabs and try again.', 120000, releaseCanvas);
        canvases.push(capturedFace);
        captured.push(capturedFace);
      }
      node.style.cssText = originalStyle;
      stage = 'Loading workshop background';
      setExportProgress(`${stage}…`);
      const response = await exportStage(fetch('/assets/workshop-export.png', { signal }), signal,
        'The workshop background took too long to load. Check your connection and try again.');
      if (!response.ok) throw new Error('The workshop background could not load. Refresh and try again.');
      const imageBlob = await exportStage(response.blob(), signal, 'The workshop background download stalled. Check your connection and try again.');
      backgroundUrl = URL.createObjectURL(imageBlob);
      background = new Image();
      background.src = backgroundUrl;
      await exportStage(background.decode().catch(() => { throw new Error('The workshop background could not be decoded. Try another browser.'); }), signal, 'The workshop background could not be decoded. Try another browser.');
      const samples = document.createElement('canvas');
      canvases.push(samples);
      samples.width = 256;
      samples.height = 768;
      const sampleCtx = samples.getContext('2d', { willReadFrequently: true });
      if (!sampleCtx) throw new Error('Your browser ran out of canvas resources. Close unused tabs and try again.');
      sampleCtx.fillStyle = '#b245ef';
      sampleCtx.fillRect(0, 0, 256, 768);
      [background, ...captured].forEach((source, index) => sampleCtx.drawImage(source, 0, index * 256, 256, 256));
      const samplePixels = sampleCtx.getImageData(0, 0, 256, 768).data.buffer;
      stage = 'Preparing GIF colors';
      setExportProgress(`${stage}…`);
      worker = new CardGifWorker();
      const ready = await requestEncoder(worker, { type: 'init', samples: samplePixels }, signal, [samplePixels]);
      if (ready.type !== 'ready') throw new Error('Unexpected GIF encoder initialization response.');
      releaseCanvas(samples);
      for (let index = 0; index < GIF_FRAMES; index++) {
        signal.throwIfAborted();
        stage = `Creating GIF ${index + 1}/${GIF_FRAMES}`;
        setExportProgress(stage);
        // Yield between frames so cancellation and progress remain responsive.
        await exportStage(new Promise<void>(resolve => setTimeout(resolve, 0)), signal, 'GIF rendering stopped responding.');
        drawGifFrame(ctx, captured[0], captured[1], background, index);
        const pixels = ctx.getImageData(0, 0, EXPORT_WIDTH, EXPORT_HEIGHT).data.buffer;
        const progress = await requestEncoder(worker, { type: 'frame', pixels, index }, signal, [pixels]);
        if (progress.type !== 'progress' || progress.completed !== index + 1 || progress.total !== GIF_FRAMES)
          throw new Error('Unexpected GIF encoder progress response.');
      }
      stage = 'Finishing GIF';
      setExportProgress(`${stage}…`);
      const result = await requestEncoder(worker, { type: 'finish' }, signal);
      if (result.type !== 'complete' || !(result.blob instanceof Blob)) throw new Error('The GIF encoder returned an invalid file.');
      signal.throwIfAborted();
      const slug = builderName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'builder';
      const url = URL.createObjectURL(result.blob);
      const link = document.createElement('a');
      link.download = `cryptita-builder-${slug}.gif`;
      link.href = url;
      document.body.appendChild(link);
      try { link.click(); } finally {
        link.remove();
        window.setTimeout(() => URL.revokeObjectURL(url), 60000);
      }
    } catch (error) {
      if (!signal.aborted && mountedRef.current) {
        console.error('Could not generate BuilderCard GIF:', { stage, error });
        setExportError(`${stage}: ${error instanceof Error ? error.message : 'Export failed. Close unused tabs and try again.'}`);
      }
    } finally {
      controller.abort();
      worker?.terminate();
      node.style.cssText = originalStyle;
      canvases.forEach(releaseCanvas);
      if (background) background.src = '';
      if (backgroundUrl) URL.revokeObjectURL(backgroundUrl);
      activeRef.current = null;
      if (mountedRef.current) { setIsGenerating(false); setExportProgress(''); }
    }
  }, [builderName, canExport]);

  const exportStill = useCallback(async () => {
    const node = captureRef.current;
    if (!node || !canExport || activeRef.current) return;
    const controller = new AbortController();
    activeRef.current = controller;
    const { signal } = controller;
    const originalStyle = node.style.cssText;
    let stage = 'Preparing card photo';
    setIsCapturingPhoto(true);
    setExportError(null);
    try {
      const { toPng } = await exportStage(import('html-to-image'), signal,
        'The image capture module could not load. Refresh and try again.');
      await exportStage(document.fonts.ready, signal, 'Fonts took too long to load. Check your connection and try again.');
      await exportStage(Promise.all(Array.from(node.querySelectorAll('img')).map(image =>
        image.decode().catch(() => { throw new Error('A card image could not load. Refresh and try again.'); })
      )), signal, 'Card images took too long to load. Check your connection and try again.');
      node.style.visibility = 'visible';
      node.style.left = '-10000px';
      stage = 'Capturing card photo';
      const png = await exportStage(toPng(node, {
        width: PHOTO_WIDTH,
        height: PHOTO_HEIGHT,
        pixelRatio: 1,
        cacheBust: true,
        backgroundColor: EXPORT_BACKGROUND,
      }), signal, 'Card photo capture took too long. Close unused tabs and try again.');
      signal.throwIfAborted();
      const slug = builderName.trim().toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'builder';
      const link = document.createElement('a');
      link.download = `cryptita-builder-${slug}.png`;
      link.href = png;
      document.body.appendChild(link);
      try { link.click(); } finally { link.remove(); }
    } catch (error) {
      if (!signal.aborted && mountedRef.current) {
        console.error('Could not generate BuilderCard photo:', { stage, error });
        setExportError(`${stage}: ${error instanceof Error ? error.message : 'Export failed. Close unused tabs and try again.'}`);
      }
    } finally {
      controller.abort();
      node.style.cssText = originalStyle;
      activeRef.current = null;
      if (mountedRef.current) setIsCapturingPhoto(false);
    }
  }, [builderName, canExport]);

  const clearExportError = useCallback(() => setExportError(null), []);
  return { captureRef, exportPhoto, exportStill, isGenerating, isCapturingPhoto, exportProgress, cancelExport, exportError, clearExportError };
}
