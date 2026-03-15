const Base = {
    White: '#ffffff',
    Black: '#000000',
    SelectBorder: '#b8c4dd',
    SelectArrow: '#6b7b9d'
} as const;

export const SecretSanta = {
    BackgroundGreen: '#146b3a',
    PanelGreen: '#165b33',
    Red: '#bb2528',
    Gold: '#f8b229',
    White: Base.White
} as const;

export const FutureWeight = {
    BackgroundStart: '#edf7f1',
    BackgroundEnd: '#e0f0ec',
    CardBackground: '#f7fdfb',
    CardBorder: '#a8cfc0',
    CardShadow: 'rgba(20, 80, 60, 0.12)',
    Heading: '#164741',
    Accent: '#2a7a5c',
    AccentSoft: '#d4ede5',
    Text: '#1a2d26',
    Muted: '#4a7060',
    Error: '#c0392b',
    White: Base.White,
    Black: Base.Black
} as const;

export const TitleCase = {
    BackgroundStart: '#f6efde',
    BackgroundEnd: '#dce9ff',
    CardBackground: '#fffdf7',
    CardBorder: '#c9d7ef',
    CardShadow: 'rgba(32, 58, 114, 0.14)',
    Heading: '#203a72',
    Accent: '#2d6cdf',
    AccentSoft: '#e7f0ff',
    Text: '#1f2a44',
    Muted: '#516082',
    White: Base.White,
    Black: Base.Black
} as const;

export const Portfolio = {
    Background: '#222222',
    Text: '#fffaff',
    Button: '#627280',
    ButtonActive: '#2a4e6c',
    ButtonText: '#2a2a2a'
} as const;

export { Base };
