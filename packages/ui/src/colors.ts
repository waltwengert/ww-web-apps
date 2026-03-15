const Base = {
    White: '#ffffff',
    Black: '#000000'
} as const;

export const SecretSanta = {
    BackgroundGreen: '#146b3a',
    PanelGreen: '#165b33',
    Red: '#bb2528',
    Gold: '#f8b229',
    White: Base.White
} as const;

export const FutureWeight = {
    White: Base.White,
    Black: Base.Black
} as const;

export const TitleCase = {
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
