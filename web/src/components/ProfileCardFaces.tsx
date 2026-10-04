import { siSui } from '../lib/brandIcons';
import { objectId as configuredObjectId, suiscanObjectUrl } from '../config';
import { PROFILE_PHOTO_PATH } from '../lib/profilePhoto';
import type { UsePortfolioResult } from '../types';
import BrandIcon from './BrandIcon';
import '../styles/community-partners.css';
import '../styles/facilitator-card.css';

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
    <div className="card-side card-front facilitator-card">
      <div className="material-noise" />
      <div className="material-light" />

      <div className="cryptita-deboss" aria-hidden="true">
        <div className="deboss-shadow" />
        <div className="deboss-highlight" />
        <div className="deboss-face" />
      </div>

      <div className="card-top">
        <div className="brand">
          <h2>CRYPTITA PLAYS</h2>
          <p>BUILDER WORKSHOP 2026</p>
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
      </div>

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
    <div className="card-side card-back facilitator-card" aria-hidden={backFaceAriaHidden}>
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
          <div className="community-logos community-logos--mmcl">
            <div className="community-partner">
              <img src="/assets/icon/cjc-race.svg" alt="CJC Race" />
            </div>
            <div className="community-partner">
              <img src="/assets/icon/blockchain4youth.svg" alt="Blockchain4Youth" />
            </div>
            <a
              className="community-partner"
              href="https://www.facebook.com/grantix.global"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Grantix"
              tabIndex={backFaceTabIndex}
            >
              <img src="/assets/icon/grantix-mmcl.svg" alt="Grantix" />
            </a>
            <a
              className="community-partner"
              href="https://www.facebook.com/kamiyonstudio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Kamiyon Studio"
              tabIndex={backFaceTabIndex}
            >
              <img src="/assets/icon/kamiyon-studio.svg" alt="Kamiyon Studio" />
            </a>
            <div className="community-partner">
              <img src="/assets/icon/blockchain4her.svg" alt="Blockchain4Her" />
            </div>
            <div className="community-partner">
              <img src="/assets/icon/lbank-academy.svg" alt="Lbank Academy" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
