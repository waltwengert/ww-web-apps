import styled from 'styled-components';
import React from 'react';

const CheckboxWrapper = styled.label`
    display: flex;
    justify-content: center;
    align-items: center;

    &: hover {
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
    margin-right: 10px;
`;

interface CheckboxProps {
    labelText: string;
    onChange: () => void;
}

export const BaseCheckbox = ({
    labelText,
    onChange
}: CheckboxProps): React.ReactElement => {
    return (
        <CheckboxWrapper>
            <StyledCheckbox type="checkbox" onChange={onChange} />
            {labelText}
        </CheckboxWrapper>
    );
};
