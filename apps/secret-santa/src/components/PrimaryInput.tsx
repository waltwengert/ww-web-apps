import React from 'react';
import styled from 'styled-components';

import { Input, SecretSanta } from '@ww-web-apps/ui';

const InputWrapper = styled.div`
    flex: 0 1 auto;

    background-color: ${SecretSanta.BackgroundGreen};

    display: flex;
    flex-direction: column;

    width: 100%;
    justify-content: center;

    // The below prevents text from being selectable
    -webkit-touch-callout: none;
    -webkit-user-select: none;
    -khtml-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
`;

const StyledInput = styled(Input)`
    flex: 3;
`;

interface PrimaryInputProps {
    id?: string;
    type?: 'text' | 'password' | 'email' | 'number';
    placeholder?: string;
    autoFocus?: boolean;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyUp?: (e: React.KeyboardEvent<HTMLInputElement>) => void;
    bottomSlot?: React.ReactNode;
}

export const PrimaryInput = ({
    id,
    type = 'text',
    placeholder,
    autoFocus,
    value,
    onChange,
    onKeyUp,
    bottomSlot
}: PrimaryInputProps): React.ReactElement => {
    return (
        <InputWrapper>
            <StyledInput
                id={id}
                type={type}
                placeholder={placeholder}
                autoFocus={autoFocus}
                value={value}
                onChange={onChange}
                onKeyUp={onKeyUp}
            />
            {bottomSlot}
        </InputWrapper>
    );
};
