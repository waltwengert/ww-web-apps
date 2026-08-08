import styled from 'styled-components';

import { FightPredictorColor, Input, Select } from '@ww-web-apps/ui';

export const AppShell = styled.main`
    max-width: 960px;
    margin: 0 auto;
    padding: 24px;
`;

export const Heading = styled.h1`
    margin: 0 0 16px;
`;

export const SectionCard = styled.section`
    background: ${FightPredictorColor.Surface};
    border: 1px solid ${FightPredictorColor.Border};
    border-radius: 16px;
    padding: 20px;
    margin-bottom: 20px;
`;

export const FieldRow = styled.div`
    display: flex;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 16px;
    align-items: flex-end;
`;

export const FieldLabel = styled.label`
    display: flex;
    flex-direction: column;
    gap: 6px;
    flex: 1 1 200px;
    min-width: 0;
`;

export const FighterSelect = styled(Select)`
    padding: 10px 14px;
    border-radius: 10px;
    border: 1px solid ${FightPredictorColor.SelectBorder};
    width: 100%;
    box-sizing: border-box;
    min-width: 0;
`;

export const ActionButton = styled.button`
    padding: 10px 14px;
    border-radius: 10px;
    border: 1px solid ${FightPredictorColor.SelectBorder};
    background: ${FightPredictorColor.Primary};
    color: ${FightPredictorColor.PrimaryText};
    cursor: pointer;
    font-weight: 600;

    &:disabled {
        opacity: 0.6;
        cursor: not-allowed;
    }
`;

export const ErrorMessage = styled.p`
    color: ${FightPredictorColor.Error};
    margin-top: 0;
`;

export const TableScroll = styled.div`
    overflow-x: auto;
`;

export const Table = styled.table`
    width: 100%;
    border-collapse: collapse;
`;

export const TableHeaderCell = styled.th`
    text-align: left;
    padding: 12px 10px;
    border-bottom: 1px solid ${FightPredictorColor.Border};
`;

export const TableCell = styled.td`
    text-align: left;
    padding: 12px 10px;
    border-bottom: 1px solid ${FightPredictorColor.Border};
`;

export const InputField = styled(Input)`
    padding: 10px 14px;
    border-radius: 10px;
    border: 1px solid ${FightPredictorColor.SelectBorder};
`;
