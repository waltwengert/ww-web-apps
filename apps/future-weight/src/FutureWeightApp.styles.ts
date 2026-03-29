import styled from 'styled-components';

import { FutureWeight, Input, Select } from '@ww-web-apps/ui';

export const Page = styled.main`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
`;

export const Card = styled.section`
    width: min(680px, 92vw);
    background: ${FutureWeight.CardBackground};
    border: 1px solid ${FutureWeight.CardBorder};
    border-radius: 20px;
    box-shadow: 0 20px 40px ${FutureWeight.CardShadow};
    padding: 28px 24px;
`;

export const Heading = styled.h1`
    margin: 0;
    text-align: center;
    color: ${FutureWeight.Heading};
    font-size: clamp(2rem, 4.4vw, 2.9rem);
    letter-spacing: 0.02em;
`;

export const Subheading = styled.p`
    margin: 10px 0 24px;
    text-align: center;
    color: ${FutureWeight.Muted};
    font-size: 1.02rem;
`;

export const FormStack = styled.div`
    width: min(520px, 100%);
    margin: 0 auto;
    display: grid;
    gap: 14px;
`;

export const FormRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

export const FieldLabel = styled.span`
    width: 110px;
    flex-shrink: 0;
    font-size: 15px;
    color: ${FutureWeight.Muted};
    font-weight: 500;
`;

export const UnitTag = styled.span`
    font-size: 14px;
    color: ${FutureWeight.Muted};
    min-width: 28px;
`;

export const FutureWeightInput = styled(Input)`
    flex: 1;
    width: auto;
    margin: 0;
    font-size: 16px;
    border: 1px solid ${FutureWeight.CardBorder};
    border-radius: 12px;
    color: ${FutureWeight.Text};
    background: ${FutureWeight.White};

    &:focus {
        outline: 2px solid ${FutureWeight.Accent};
        outline-offset: 1px;
    }
`;

export const ActivitySelect = styled(Select)`
    flex: 1;
    width: auto;
    margin: 0;
    font-size: 15px;
    border-color: ${FutureWeight.CardBorder};
    color: ${FutureWeight.Text};
    background-color: ${FutureWeight.White};
`;

export const ToggleGroup = styled.div`
    display: flex;
    flex: 1;
    background: ${FutureWeight.AccentSoft};
    border-radius: 12px;
    padding: 3px;
    gap: 3px;
`;

export const ToggleOption = styled.button<{ $active?: boolean }>`
    flex: 1;
    padding: 7px 14px;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s;
    background: ${({ $active }): string =>
        $active ? FutureWeight.Accent : 'transparent'};
    color: ${({ $active }): string =>
        $active ? FutureWeight.White : FutureWeight.Muted};
    font-weight: ${({ $active }): string => ($active ? '600' : '400')};
`;

export const ErrorText = styled.p`
    color: ${FutureWeight.Error};
    font-size: 14px;
    text-align: center;
    margin: 0;
`;

export const CalculateButton = styled.button`
    width: 100%;
    padding: 12px;
    background: ${FutureWeight.Accent};
    color: ${FutureWeight.White};
    border: none;
    border-radius: 12px;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
        background: ${FutureWeight.Heading};
    }
`;

export const ResultsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

export const ResultCard = styled.div`
    background: ${FutureWeight.AccentSoft};
    border: 1px solid ${FutureWeight.CardBorder};
    border-radius: 14px;
    padding: 16px 12px;
    text-align: center;
`;

export const ResultValue = styled.div`
    font-size: 1.9rem;
    font-weight: 700;
    color: ${FutureWeight.Heading};
`;

export const ResultLabel = styled.div`
    font-size: 0.82rem;
    color: ${FutureWeight.Muted};
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
`;
