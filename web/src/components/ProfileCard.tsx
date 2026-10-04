import { useCallback, useLayoutEffect, useRef, useState, type KeyboardEvent, type MouseEvent } from 'react';
import { useCardOrbit } from '../hooks/useCardOrbit';
import { PROFILE_PHOTO_PATH } from '../lib/profilePhoto';
import type { UsePortfolioResult } from '../types';
import { CardBackFace, CardFrontFace } from './ProfileCardFaces';
import '../styles/profile-card.css';

type ProfileCardProps = {
  portfolio: UsePortfolioResult;
  isOrbiting?: boolean;
};

export default function ProfileCard({ portfolio, isOrbiting = false }: ProfileCardProps) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [photoBroken, setPhotoBroken] = useState(false);
  const [copiedField, setCopiedField] = useState<'objectId' | 'owner' | null>(null);
  const startAngleRef = useRef(0);
  const wasOrbitingRef = useRef(false);
  const isFlippedRef = useRef(isFlipped);
  isFlippedRef.current = isFlipped;

  const { orbitRef, isAnimating } = useCardOrbit(isOrbiting, startAngleRef);
  const motionLocked = isOrbiting || isAnimating;

  const showPhoto = !photoBroken;

  useLayoutEffect(() => {
    if (isOrbiting && !wasOrbitingRef.current) {
      startAngleRef.current = isFlippedRef.current ? Math.PI : 0;
      setIsFlipped(false);
    }
    wasOrbitingRef.current = isOrbiting;
  }, [isOrbiting]);

  const handleCardClick = (event: MouseEvent<HTMLDivElement>) => {
    if (motionLocked) return;
    if ((event.target as HTMLElement).closest('a, button')) {
      return;
    }
    setIsFlipped((current) => !current);
  };

  const handleFlipKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (motionLocked) return;
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault();
      setIsFlipped((current) => !current);
    }
  };

  const handleMouseMove = (event: MouseEvent<HTMLDivElement>) => {
    const rect = event.currentTarget.getBoundingClientRect();
    const x = ((event.clientX - rect.left) / rect.width) * 100;
    const y = ((event.clientY - rect.top) / rect.height) * 100;
    event.currentTarget.style.setProperty('--mx', `${x}%`);
    event.currentTarget.style.setProperty('--my', `${y}%`);
  };

  const handleMouseLeave = (event: MouseEvent<HTMLDivElement>) => {
    event.currentTarget.style.setProperty('--mx', '50%');
    event.currentTarget.style.setProperty('--my', '50%');
  };

  const handleCopy = useCallback(async (field: 'objectId' | 'owner', value: string) => {
    if (!value) return;
    try {
      await navigator.clipboard.writeText(value);
      setCopiedField(field);
      window.setTimeout(() => setCopiedField((current) => (current === field ? null : current)), 900);
    } catch (copyError) {
      console.error('Clipboard unavailable:', copyError);
    }
  }, []);

  const backFaceTabIndex = isFlipped ? 0 : -1;

  return (
    <div className="card-orbit" ref={orbitRef}>
      <div className="card-scale__inner">
        <div
          className={`profile-card${isFlipped ? ' is-flipped' : ''}${motionLocked ? ' is-orbiting' : ''}`}
          onClick={handleCardClick}
          onMouseMove={handleMouseMove}
          onMouseLeave={handleMouseLeave}
          role="group"
          aria-label="Builder profile card"
        >
          <button
            type="button"
            className="flip-btn"
            disabled={motionLocked}
            onClick={(event) => {
              event.stopPropagation();
              if (motionLocked) return;
              setIsFlipped((current) => !current);
            }}
            onKeyDown={handleFlipKeyDown}
            aria-pressed={isFlipped}
            aria-label={isFlipped ? 'Show front of card' : 'Show back of card'}
          >
            <span className="flip-icon" aria-hidden="true">
              ↻
            </span>
            Flip
          </button>

          <CardFrontFace
            portfolio={portfolio}
            photoSrc={PROFILE_PHOTO_PATH}
            showPhoto={showPhoto}
            onPhotoError={() => setPhotoBroken(true)}
            copiedField={copiedField}
            onCopy={handleCopy}
          />

          <CardBackFace
            portfolio={portfolio}
            backFaceTabIndex={backFaceTabIndex}
            backFaceAriaHidden={!isFlipped}
          />
        </div>
      </div>
    </div>
  );
}
