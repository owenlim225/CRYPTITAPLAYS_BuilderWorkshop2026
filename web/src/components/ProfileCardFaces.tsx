import { siSui } from '../lib/brandIcons';
import { objectId as configuredObjectId, suiscanObjectUrl } from '../config';
import { PROFILE_PHOTO_PATH } from '../lib/profilePhoto';
import type { UsePortfolioResult } from '../types';
import BrandIcon from './BrandIcon';

const UNIVERSITY_SEAL_SRC = 'data:image/jpeg;base64,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';

export function truncateValue(value: string): string {
  if (!value) return '—';
  if (value.length <= 14) return value;
  return `${value.slice(0, 6)}…${value.slice(-4)}`;
}

export function displayOrPlaceholder(value: string | undefined, placeholder: string): string {
  return value?.trim() ? value : placeholder;
}

type CardFaceProps = {
  portfolio: UsePortfolioResult;
  photoSrc?: string;
  showPhoto: boolean;
  onPhotoError?: () => void;
  forcePhotoFallback?: boolean;
  photoCrossOrigin?: boolean;
  copiedField?: 'objectId' | 'owner' | null;
  onCopy?: (field: 'objectId' | 'owner', value: string) => void;
  backFaceTabIndex?: number;
  backFaceAriaHidden?: boolean;
};

export function CardFrontFace({
  portfolio,
  photoSrc = PROFILE_PHOTO_PATH,
  showPhoto,
  onPhotoError,
  forcePhotoFallback = false,
  photoCrossOrigin = false,
  copiedField = null,
  onCopy,
}: CardFaceProps) {
  const { status, data, error } = portfolio;
  const fields = data?.fields;
  const builderName = fields?.builder_name ?? '';
  const builderNo = fields?.builder_no ?? '';
  const objectId = data?.objectId ?? '';
  const owner = data?.owner ?? '';
  const network = data?.networkLabel ?? '—';
  const issued = fields?.issued ?? '—';
  const isActive = Boolean(configuredObjectId);

  const placeholderName =
    status === 'loading' ? 'Loading on-chain profile…' : 'Builder name';
  const placeholderField = status === 'loading' ? '…' : '—';
  const credentialUnavailable =
    status === 'empty' ? 'Not configured' : status === 'error' ? 'Unavailable' : '—';

  const renderPhoto = showPhoto && !forcePhotoFallback;

  return (
    <div className="card-side card-front">
      <div className="material-noise" />
      <div className="material-light" />

      <div className="cryptita-deboss" aria-hidden="true">
        <div className="deboss-shadow" />
        <div className="deboss-highlight" />
        <div className="deboss-face" />
      </div>

      <div className="card-top">
        <div className="brand">
          <h2>University of Perpetual Help System Laguna</h2>
          <p>CRYPTITA PLAYS BUILDER WORKSHOP 2026</p>
        </div>
        <div className="builder-number">
          <span className="builder-number-label">BUILDER NO.</span>
          <div className="builder-number-value">
            <strong>{displayOrPlaceholder(builderNo, placeholderField)}</strong>
            <span
              className={`builder-status-dot${isActive ? ' builder-status-dot--active' : ''}`}
              aria-label={isActive ? 'On-chain profile active' : 'On-chain profile not configured'}
              title={isActive ? 'On-chain profile active' : 'Set VITE_PORTFOLIO_OBJECT_ID to activate'}
            />
          </div>
        </div>
        <div className="university-seal" aria-label="University of Perpetual Help System Laguna seal">
          <img src={UNIVERSITY_SEAL_SRC} alt="University of Perpetual Help System Laguna seal" />
        </div>
      </div>

      <span className="card-bee card-bee--one" aria-hidden="true">🐝</span>
      <span className="card-bee card-bee--two" aria-hidden="true">🐝</span>
      <span className="card-bee card-bee--three" aria-hidden="true">🐝</span>

      <div className="card-main">
        <div className="profile-photo-wrap">
          {renderPhoto ? (
            <img
              src={photoSrc}
              alt={builderName || 'Builder profile photo'}
              className="profile-photo"
              {...(photoCrossOrigin ? { crossOrigin: 'anonymous' as const } : {})}
              onError={onPhotoError}
            />
          ) : (
            <div className="profile-photo profile-photo--placeholder" aria-hidden="true" />
          )}
        </div>

        <div className="profile-details">
          {status === 'error' && (
            <p className="card-status card-status--error" role="alert">
              {error}
            </p>
          )}

          <div className="identity-header">
            <span className="field-label">BUILDER</span>
            <h1>{displayOrPlaceholder(builderName, placeholderName)}</h1>
          </div>

          <div className="info-grid">
            <div className="info-field">
              <span className="field-label">PROFESSION</span>
              <span className="field-value">
                {displayOrPlaceholder(fields?.profession, placeholderField)}
              </span>
            </div>
            <div className="info-field">
              <span className="field-label">PROGRAM</span>
              <span className="field-value">
                {displayOrPlaceholder(fields?.program, placeholderField)}
              </span>
            </div>
            <div className="info-field">
              <span className="field-label">COUNTRY</span>
              <span className="field-value">
                {displayOrPlaceholder(fields?.country, placeholderField)}
              </span>
            </div>
          </div>

          <div className="info-grid">
            <div className="info-field">
              <span className="field-label">SPECIALIZATION</span>
              <span className="field-value">
                {displayOrPlaceholder(fields?.specialization, placeholderField)}
              </span>
            </div>
            <div className="info-field">
              <span className="field-label">BUILDING SINCE</span>
              <span className="field-value">
                {displayOrPlaceholder(fields?.building_since, placeholderField)}
              </span>
            </div>
            <div className="info-field">
              <span className="field-label">FOCUS</span>
              <span className="field-value">
                {displayOrPlaceholder(fields?.focus, placeholderField)}
              </span>
            </div>
          </div>

          <div className="wide-field">
            <span className="field-label">COMMUNITY</span>
            <span className="field-value">
              {displayOrPlaceholder(fields?.community, placeholderField)}
            </span>
          </div>

          <div className="wide-field skills-field">
            <span className="field-label">SKILLS</span>
            <div className="skills">
              {status === 'success' && data?.skills.length ? (
                data.skills.map((skill) => <span key={skill}>{skill}</span>)
              ) : (
                <span className="skills__placeholder">{placeholderField}</span>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="card-bottom">
        <div className="credential-field">
          <span className="field-label">ISSUED</span>
          <span className="credential-value">
            {status === 'success' ? issued : credentialUnavailable}
          </span>
        </div>
        <div className="divider" />
        <div className="credential-field">
          <span className="field-label">NETWORK</span>
          <span className="credential-value">
            {status === 'success' ? network : credentialUnavailable}
          </span>
        </div>
        <div className="divider" />
        <div className="credential-field">
          <span className="field-label">OBJECT ID</span>
          <div className="value-row">
            {status === 'success' && objectId ? (
              <a
                className="value-row__link"
                href={suiscanObjectUrl(objectId)}
                target="_blank"
                rel="noopener noreferrer"
              >
                {truncateValue(objectId)}
              </a>
            ) : (
              <span>{credentialUnavailable}</span>
            )}
            {onCopy && (
              <button
                className="icon-btn"
                type="button"
                aria-label="Copy object ID"
                disabled={!objectId}
                onClick={(event) => {
                  event.stopPropagation();
                  void onCopy('objectId', objectId);
                }}
              >
                {copiedField === 'objectId' ? '✓' : '⧉'}
              </button>
            )}
          </div>
        </div>
        <div className="divider" />
        <div className="credential-field">
          <span className="field-label">OWNER</span>
          <div className="value-row">
            <span>{status === 'success' && owner ? truncateValue(owner) : credentialUnavailable}</span>
            {onCopy && (
              <button
                className="icon-btn"
                type="button"
                aria-label="Copy owner address"
                disabled={!owner}
                onClick={(event) => {
                  event.stopPropagation();
                  void onCopy('owner', owner);
                }}
              >
                {copiedField === 'owner' ? '✓' : '⧉'}
              </button>
            )}
          </div>
        </div>
        <div className="divider" />
        <a
          className="sui-link-box"
          href="https://www.sui.io/"
          target="_blank"
          rel="noopener noreferrer"
          aria-label="Visit Sui"
        >
          <BrandIcon icon={siSui} size={32} className="sui-logo" decorative />
        </a>
      </div>
    </div>
  );
}

export function CardBackFace({
  portfolio: _portfolio,
  backFaceTabIndex = 0,
  backFaceAriaHidden = false,
}: Pick<CardFaceProps, 'portfolio' | 'backFaceTabIndex' | 'backFaceAriaHidden'>) {
  return (
    <div className="card-side card-back" aria-hidden={backFaceAriaHidden}>
      <div className="material-noise" />
      <div className="material-light" />

      <div className="back-logo" aria-hidden="true">
        <div className="back-logo-shadow" />
        <div className="back-logo-highlight" />
        <div className="back-logo-face" />
      </div>

      <div className="back-content">
        <div className="back-brand">
          <h2>CRYPTITA PLAYS</h2>
          <p>BUILDER WORKSHOP 2026</p>
        </div>

        <div className="back-divider" />

        <div className="back-built-on">
          <span>Built on</span>
          <a
            href="https://www.sui.io/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="Visit Sui"
            tabIndex={backFaceTabIndex}
          >
            <BrandIcon icon={siSui} size={26} decorative />
            <span>Sui</span>
          </a>
        </div>

        <div className="back-divider" />

        <div className="back-community">
          <div className="community-title">Community Partners:</div>
          <div className="community-logos">
            <a
              className="community-partner"
              href="https://www.facebook.com/DEVCONLAGUNA"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="DEVCON Philippines"
              tabIndex={backFaceTabIndex}
            >
              <img src="/assets/icon/devcon-laguna.svg" alt="DEVCON Philippines" />
            </a>
            <div className="community-logo-divider" />
            <a
              className="community-partner"
              href="https://www.facebook.com/awssbg"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="AWS UPHSL"
              tabIndex={backFaceTabIndex}
            >
              <img src="/assets/icon/aws-uphsl.svg" alt="AWS UPHSL" />
            </a>
            <div className="community-logo-divider" />
            <a
              className="community-partner"
              href="https://www.facebook.com/grantix.global"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="grantix"
              tabIndex={backFaceTabIndex}
            >
              <img src="/assets/icon/grantix.svg" alt="grantix" />
            </a>
            <div className="community-logo-divider" />
            <a
              className="community-partner"
              href="https://www.facebook.com/kamiyonstudio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kamiyon Studio"
              tabIndex={backFaceTabIndex}
            >
              <img src="/assets/icon/kamiyon.svg" alt="Kamiyon Studio" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
