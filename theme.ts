export const colors = {
    // Primary backgrounds
    primaryBK: '#111827',
    secondaryBK: '#1D2734',

    // Accent
    primary: '#319FB6',

    // Semantic
    red: '#ff0000',
    green: '#1CC54B',
    orange: '#ffa500',
    black: '#000',
    white: '#FFFFFF',

    // Danger scale
    danger400: '#C04C41',
    danger500: '#961212',

    // Basic scale
    basic100: '#FFFFFF',
    basic200: '#F5F5F5',
    basic400: '#D4D4D4',
    basic500: '#B3B3B3',
    basic600: '#808080',
    basic700: '#4A4A4A',
    basic800: '#383838',

    // Text
    textPrimary: '#FFFFFF',
    textHint: '#828995',
    textDisabled: '#111827',

    // Transparent
    transparent: 'transparent',
} as const;

export const spacing = {
    xs: 4,
    sm: 8,
    md: 16,
    lg: 24,
    xl: 32,
    xxl: 48,
} as const;

export const borderRadius = {
    sm: 8,
    md: 12,
    lg: 15,
    xl: 20,
    full: 9999,
} as const;

export const fontSize = {
    xs: 12,
    sm: 14,
    md: 16,
    lg: 20,
    xl: 24,
    xxl: 32,
} as const;

export const theme = {
    colors,
    spacing,
    borderRadius,
    fontSize,
} as const;

export type Theme = typeof theme;
