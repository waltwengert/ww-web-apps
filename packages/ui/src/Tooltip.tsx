import React from 'react';
import styled from 'styled-components';

import { BaseColor } from './colors';

const StyledTooltip = styled.span`
    position: relative;
    display: inline-flex;
    align-items: center;
    color: inherit;

    &:hover > [role='tooltip'],
    &:focus-within > [role='tooltip'] {
        visibility: visible;
        opacity: 1;
    }
`;

const InfoTrigger = styled.button`
    display: inline-flex;
    align-items: center;
    justify-content: center;
    width: 18px;
    height: 18px;
    padding: 0;
    border: 1px solid currentColor;
    border-radius: 50%;
    background: transparent;
    color: inherit;
    font-size: 12px;
    font-weight: 700;
    line-height: 1;
    cursor: help;

    &:focus-visible {
        outline: 2px solid currentColor;
        outline-offset: 2px;
    }
`;

const TooltipContent = styled.span`
    position: absolute;
    z-index: 10;
    bottom: calc(100% + 8px);
    left: 50%;
    width: max-content;
    max-width: min(260px, 80vw);
    padding: 8px 10px;
    border-radius: 4px;
    background: ${BaseColor.Black};
    color: ${BaseColor.White};
    font-size: 14px;
    font-weight: 400;
    line-height: 1.4;
    text-align: left;
    white-space: normal;
    visibility: hidden;
    opacity: 0;
    transform: translateX(-50%);
    transition: opacity 120ms ease-in-out;
    pointer-events: none;
`;

interface TooltipProps {
    content: React.ReactNode;
    children?: React.ReactNode;
    ariaLabel?: string;
    className?: string;
}

export const Tooltip = ({
    content,
    children,
    ariaLabel = 'More information',
    className
}: TooltipProps): React.ReactElement => {
    const tooltipId = React.useId();

    return (
        <StyledTooltip
            className={className}
            role={children ? 'group' : undefined}
            tabIndex={children ? 0 : undefined}
            aria-describedby={children ? tooltipId : undefined}
        >
            {children || (
                <InfoTrigger
                    type="button"
                    aria-label={ariaLabel}
                    aria-describedby={tooltipId}
                >
                    <span aria-hidden="true">i</span>
                </InfoTrigger>
            )}
            <TooltipContent id={tooltipId} role="tooltip">
                {content}
            </TooltipContent>
        </StyledTooltip>
    );
};
