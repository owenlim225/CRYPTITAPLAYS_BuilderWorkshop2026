import { siFacebook, siInstagram, siLinkedin, siX } from '../lib/brandIcons';
import BrandIcon from './BrandIcon';

function CameraIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
      <circle cx="12" cy="13" r="4" />
    </svg>
  );
}

function GifIcon() {
  return (
    <svg width={18} height={18} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
      <rect x="2" y="4" width="20" height="16" rx="3" />
      <path d="m10 8 6 4-6 4z" />
    </svg>
  );
}

function SpinIcon() {
  return (
    <svg
      width={18}
      height={18}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle cx="12" cy="12" r="9" />
      <path d="M12 3a9 9 0 0 1 9 9" />
      <path d="M21 12h-3.2" />
    </svg>
  );
}

type SocialActionsProps = {
  onGifClick?: () => void;
  onCameraClick?: () => void;
  isGenerating?: boolean;
  isCapturingPhoto?: boolean;
  canExport?: boolean;
  exportProgress?: string;
  onCancelExport?: () => void;
  isOrbiting?: boolean;
  onOrbitClick?: () => void;
};

export default function SocialActions({
  onGifClick,
  onCameraClick,
  isGenerating = false,
  isCapturingPhoto = false,
  canExport = false,
  exportProgress = 'Creating GIF…',
  onCancelExport,
  isOrbiting = false,
  onOrbitClick,
}: SocialActionsProps) {
  const exportBusy = isGenerating || isCapturingPhoto;
  const gifDisabled = exportBusy || !onGifClick || !canExport;
  const cameraDisabled = exportBusy || !onCameraClick || !canExport;
  const gifLabel = isGenerating
    ? exportProgress
    : canExport
      ? 'Download builder card GIF'
      : 'Download builder card GIF (available after the card loads)';
  const cameraLabel = isCapturingPhoto
    ? 'Generating builder card picture'
    : canExport
      ? 'Download builder card picture'
      : 'Download builder card picture (available after the card loads)';
  const orbitLabel = isOrbiting
    ? 'Stop card rotation and return to the front'
    : 'Spin the card in a continuous loop';

  return (
    <div className="social-actions">
      <div className="social-actions__tools">
        <div className="social-actions__downloads">
          <button
            type="button"
            className={`social-actions__link social-actions__export${isGenerating ? ' is-generating' : ''}`}
            aria-label={gifLabel}
            aria-busy={isGenerating}
            title={isGenerating ? exportProgress : undefined}
            disabled={gifDisabled}
            onClick={onGifClick}
          >
            <GifIcon />
            <span className="social-actions__label">{isGenerating ? (exportProgress.startsWith('Creating GIF') ? exportProgress.replace('Creating GIF ', 'GIF ') : 'Preparing GIF…') : 'GIF'}</span>
          </button>
          <button
            type="button"
            className={`social-actions__link social-actions__export${isCapturingPhoto ? ' is-generating' : ''}`}
            aria-label={cameraLabel}
            aria-busy={isCapturingPhoto}
            disabled={cameraDisabled}
            onClick={onCameraClick}
          >
            <CameraIcon />
            <span className="social-actions__label">Camera</span>
          </button>
          {isGenerating ? <span role="status" className="social-actions__export-progress">{exportProgress}</span> : null}
          {isCapturingPhoto ? <span role="status" className="social-actions__export-progress">Saving picture…</span> : null}
          {exportBusy ? <button type="button" className="social-actions__link" onClick={onCancelExport}>Cancel</button> : null}
        </div>
        <button
          type="button"
          className={`social-actions__link social-actions__spin${isOrbiting ? ' is-active' : ''}`}
          aria-label={orbitLabel}
          aria-pressed={isOrbiting}
          onClick={onOrbitClick}
        >
          <SpinIcon />
          <span className="social-actions__label">{isOrbiting ? 'Stop' : 'Spin'}</span>
        </button>
      </div>
      <section className="social-actions__share" aria-labelledby="share-your-build-heading">
        <h2 id="share-your-build-heading" className="social-actions__share-title">
          Share Your Build
        </h2>
        <div className="social-actions__share-links">
          {/* <a
            className="social-actions__link"
            href="https://www.facebook.com/cryptitaplays"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Cryptita Plays on Facebook"
          >
            <BrandIcon icon={siFacebook} size={18} decorative />
            <span className="social-actions__label">Facebook</span>
          </a>
          <a
            className="social-actions__link"
            href="https://x.com/cryptitaplays"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Cryptita Plays on X"
          >
            <BrandIcon icon={siX} size={18} decorative />
            <span className="social-actions__label">X</span>
          </a> */}
          <a
            className="social-actions__link"
            href="https://www.linkedin.com/company/cryptitaplays/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Cryptita Plays on LinkedIn"
          >
            <BrandIcon icon={siLinkedin} size={18} decorative />
            <span className="social-actions__label">LinkedIn</span>
          </a>
          {/* <a
            className="social-actions__link"
            href="https://www.instagram.com/cryptitaplays/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Cryptita Plays on Instagram"
          >
            <BrandIcon icon={siInstagram} size={18} decorative />
            <span className="social-actions__label">Instagram</span>
          </a> */}
        </div>
      </section>
    </div>
  );
}
