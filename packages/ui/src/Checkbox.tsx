import React from 'react';
import styled from 'styled-components';

import { BaseColor } from './colors';

const CheckboxWrapper = styled.label`
    display: inline-flex;
    align-items: center;
    gap: 10px;
    padding: 10px 12px;
    border: 1px solid ${BaseColor.CheckboxBorder};
    border-radius: 10px;
    background: ${BaseColor.CheckboxBackground};
    min-height: 44px;
    font-weight: 500;

    &:hover {
        cursor: pointer;
    }

    // The below prevents text from being selectable
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const StyledCheckbox = styled.input`
    margin: 0;
    width: 16px;
    height: 16px;
    accent-color: ${BaseColor.CheckboxAccent};
`;

interface CheckboxProps {
    labelText: string;
    checked?: boolean;
    onChange?: (event: React.ChangeEvent<HTMLInputElement>) => void;
    className?: string;
}

export const Checkbox = ({
    labelText,
    checked,
    onChange,
    className
}: CheckboxProps): React.ReactElement => {
    return (
        <CheckboxWrapper className={className}>
            <StyledCheckbox
                type="checkbox"
                checked={checked}
                onChange={onChange}
            />
            {labelText}
        </CheckboxWrapper>
    );
};
