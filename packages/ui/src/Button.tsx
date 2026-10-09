import React from 'react';
import styled from 'styled-components';

import { BaseColor } from './colors';
import { MOBILE_DEVICE_WIDTH } from './constants';

interface ButtonProps extends Omit<
    React.ButtonHTMLAttributes<HTMLButtonElement>,
    'color'
> {
    children: React.ReactNode;
    backgroundColor?: string;
    color?: string;
}

const StyledButton = styled.button<{
    $backgroundColor?: string;
    $color?: string;
}>`
    background-color: ${(props): string =>
        props.$backgroundColor || BaseColor.Black};
    color: ${(props): string => props.$color || BaseColor.White};
    font-size: 18px;
    border: none;
    border-radius: 100px;
    flex: 1;

    min-height: 40px;
    margin-right: 1vw;
    margin-left: 1vw;

    cursor: pointer;

    &:active {
        font-size: 16px;
    }

    &:disabled {
        cursor: not-allowed;
        opacity: 0.55;
    }

    @media (max-width: ${MOBILE_DEVICE_WIDTH}px) {
        width: 95vw;
    }

    // Media query for hover so the button doesn't look weird on touch devices
    @media (hover: hover) {
        &:hover {
            filter: brightness(0.8);
        }
    }
`;

export const Button = ({
    children,
    backgroundColor,
    color,
    className,
    type = 'button',
    ...buttonProps
}: ButtonProps): React.ReactElement => {
    return (
        <StyledButton
            {...buttonProps}
            className={className}
            $backgroundColor={backgroundColor}
            $color={color}
            type={type}
        >
            {children}
        </StyledButton>
    );
};
