import { useEffect, useState, type ReactNode } from 'react';
import { createPortal } from 'react-dom';
import { useCardPhotoExport } from '../hooks/useCardPhotoExport';
import type { UsePortfolioResult } from '../types';
import BuilderCardExport from './BuilderCardExport';
import '../styles/card-photo-export.css';

type CardPhotoExportRenderProps = {
  onGifClick: () => void;
  onCameraClick: () => void;
  isGenerating: boolean;
  isCapturingPhoto: boolean;
  canExport: boolean;
  exportProgress: string;
  onCancelExport: () => void;
};

type CardPhotoExportProps = {
  portfolio: UsePortfolioResult;
  children: (props: CardPhotoExportRenderProps) => ReactNode;
};

export default function CardPhotoExport({ portfolio, children }: CardPhotoExportProps) {
  const builderName = portfolio.data?.fields.builder_name ?? 'builder';
  const canExport = portfolio.status === 'success';
  const [cameraFlashKey, setCameraFlashKey] = useState(0);
  const { captureRef, exportPhoto: exportGif, exportStill, isGenerating, isCapturingPhoto, exportProgress, cancelExport, exportError, clearExportError } =
    useCardPhotoExport(builderName, canExport);

  useEffect(() => {
    if (!exportError) return;

    const timer = window.setTimeout(() => {
      clearExportError();
    }, 8000);

    return () => window.clearTimeout(timer);
  }, [clearExportError, exportError]);

  return (
    <>
      <BuilderCardExport ref={captureRef} portfolio={portfolio} />
      {children({
        onGifClick: () => {
          void exportGif();
        },
        onCameraClick: () => {
          setCameraFlashKey((key) => key + 1);
          void exportStill();
        },
        isGenerating,
        isCapturingPhoto,
        canExport,
        exportProgress,
        onCancelExport: cancelExport,
      })}
      {cameraFlashKey > 0 ? <div key={cameraFlashKey} className="camera-flash" aria-hidden="true" /> : null}
      {exportError ? createPortal(
        <div className="export-toast" role="alert" aria-live="assertive">
          <div className="export-toast__content">
            <p className="export-toast__title">Export failed</p>
            <p className="export-toast__message">{exportError}</p>
          </div>
          <button
            type="button"
            className="export-toast__close"
            aria-label="Dismiss export error"
            onClick={clearExportError}
          >
            ×
          </button>
        </div>,
        document.body,
      ) : null}
    </>
  );
}
