export const palette = {
  background: '#030712',
  surface: '#0f172a',
  surfaceElevated: 'rgba(30, 41, 59, 0.65)',
  card: 'rgba(15, 23, 42, 0.9)',
  cardOverlay: 'rgba(94, 234, 212, 0.08)',
  border: 'rgba(148, 163, 184, 0.18)',
  highlight: '#38bdf8',
  highlightSecondary: '#22d3ee',
  textPrimary: '#e2e8f0',
  textSecondary: '#94a3b8',
  textMuted: '#64748b',
  success: '#34d399',
  warning: '#f59e0b',
  danger: '#f87171',
};

export const spacing = {
  xs: 6,
  sm: 10,
  md: 16,
  lg: 24,
  xl: 32,
  xxl: 48,
};

export const radii = {
  sm: 10,
  md: 16,
  lg: 24,
  pill: 999,
};

export const typography = {
  fontFamily: 'System',
  heading1: 28,
  heading2: 22,
  heading3: 18,
  body: 15,
  small: 13,
  tiny: 11,
};

export const shadows = {
  card: {
    shadowColor: '#000',
    shadowOpacity: 0.25,
    shadowOffset: { width: 0, height: 12 },
    shadowRadius: 24,
    elevation: 12,
  },
};

export const gradients = {
  background: ['#020617', '#07102a', '#030712'],
  accent: ['#38bdf8', '#2563eb'],
};

export const theme = {
  palette,
  spacing,
  radii,
  typography,
  shadows,
  gradients,
};

export type Theme = typeof theme;
