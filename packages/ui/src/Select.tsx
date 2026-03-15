import styled from 'styled-components';

import { Base } from './colors';

export const Select = styled.select`
    font-size: 18px;
    padding: 10px 14px;
    margin-top: 10px;
    margin-bottom: 10px;

    display: block;
    width: 40vw;
    margin-right: auto;
    margin-left: auto;

    color: ${Base.Black};
    background-color: ${Base.White};
    border: 1px solid ${Base.SelectBorder};
    border-radius: 12px;

    // Remove browser-default arrow so custom arrow is consistent.
    appearance: none;
    background-image:
        linear-gradient(45deg, transparent 50%, ${Base.SelectArrow} 50%),
        linear-gradient(135deg, ${Base.SelectArrow} 50%, transparent 50%);
    background-position:
        calc(100% - 18px) calc(50% - 3px),
        calc(100% - 12px) calc(50% - 3px);
    background-size:
        6px 6px,
        6px 6px;
    background-repeat: no-repeat;
`;
