import { forwardRef } from 'react';
import { siGithub } from '../lib/brandIcons';
import BrandIcon from './BrandIcon';

const GITHUB_REPO_URL =
  'https://github.com/owenlim225/CRYPTITAPLAYS_BuilderWorkshop2026/tree/codex/community-2-mmcl-facilitator';

const Header = forwardRef<HTMLElement>(function Header(_props, ref) {
  return (
    <header ref={ref} className="site-header">
      <a
        className="site-header__link"
        href="https://www.facebook.com/cryptitaplays"
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Cryptita Plays on Facebook"
      >
        <img
          className="site-header__logo"
          src="/assets/icon/cryptita-long.svg"
          alt="Cryptita Plays"
        />
      </a>

      <a
        className="site-header__github"
        href={GITHUB_REPO_URL}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="View workshop source on GitHub"
      >
        <BrandIcon icon={siGithub} size={18} decorative />
        <span className="site-header__github-label">GitHub</span>
      </a>
    </header>
  );
});

export default Header;
