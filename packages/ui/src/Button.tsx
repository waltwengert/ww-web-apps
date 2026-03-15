import React from 'react';
import styled from 'styled-components';

import { MOBILE_DEVICE_WIDTH } from './constants';

interface ButtonProps {
    children: React.ReactNode;
    backgroundColor?: string;
    color?: string;
    onClick?: () => void;
    type?: 'button' | 'submit' | 'reset';
}

const StyledButton = styled.button<{
    backgroundColor?: string;
    color?: string;
}>`
    background-color: ${(props): string => props.backgroundColor || '#000000'};
    color: ${(props): string => props.color || '#ffffff'};
    font-size: 18px;
    border: none;
    border-radius: 100px;
    flex: 1;

    min-height: 40px;
    margin-right: 1vw;
    margin-left: 1vw;

    cursor: pointer;

    &: active {
        font-size: 16px;
    }

    @media (max-width: ${MOBILE_DEVICE_WIDTH}px) {
        width: 95vw;
    }

    // Media query for hover so the button doesn't look weird on touch devices
    @media (hover: hover) {
        &: hover {
            filter: brightness(0.8);
        }
    }
`;

export const BaseButton = ({
    children,
    backgroundColor,
    color,
    onClick,
    type = 'button'
}: ButtonProps): React.ReactElement => {
    return (
        <StyledButton
            backgroundColor={backgroundColor}
            color={color}
            onClick={onClick}
            type={type}
        >
            {children}
        </StyledButton>
    );
};
