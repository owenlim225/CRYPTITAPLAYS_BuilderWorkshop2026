export type ChainId = 'sui';

export type ChainTheme = {
  id: ChainId;
  name: string;
  primary: string;
  primaryRgb: `${number}, ${number}, ${number}`;
  molten: {
    color1: string;
    color2: string;
    color3: string;
  };
};

const CHAIN_THEMES: Record<ChainId, ChainTheme> = {
  sui: {
    id: 'sui',
    name: 'Sui',
    primary: '#4DA2FF',
    primaryRgb: '77, 162, 255',
    molten: {
      color1: '#0B3D7A',
      color2: '#4DA2FF',
      color3: '#D6EBFF',
    },
  },
};

function resolveChainId(): ChainId {
  const raw = (import.meta.env.VITE_CHAIN ?? 'sui').trim().toLowerCase();
  if (raw in CHAIN_THEMES) {
    return raw as ChainId;
  }
  return 'sui';
}

export function getActiveChainTheme(): ChainTheme {
  return CHAIN_THEMES[resolveChainId()];
}

export function applyChainTheme(theme: ChainTheme = getActiveChainTheme()): ChainTheme {
  const root = document.documentElement;
  root.style.setProperty('--chain-primary', theme.primary);
  root.style.setProperty('--chain-primary-rgb', theme.primaryRgb);
  root.style.setProperty('--blue', theme.primary);

  return theme;
}
