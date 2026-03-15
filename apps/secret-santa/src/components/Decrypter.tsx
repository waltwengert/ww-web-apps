import React, { ChangeEvent, KeyboardEvent, useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import styled from 'styled-components';

import { Button, SecretSanta } from '@ww-web-apps/ui';

import { decrypt } from '../utilities/utils';
import {
    BaseResultsPanel,
    ButtonRowContainer,
    ButtonRowWrapper
} from './layout';
import { PrimaryInput } from './PrimaryInput';

const ResultPanel = styled(BaseResultsPanel)`
    min-height: 100px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    padding: 16px;
`;

const ResultLabel = styled.p`
    margin: 0;
    color: ${SecretSanta.White};
    font-size: 22px;
`;

const ResultText = styled.p`
    margin: 8px 0 0;
    color: ${SecretSanta.Gold};
    font-size: 26px;
`;

const DecryptButton = styled(Button)`
    flex: 0 0 260px;
    max-width: 85vw;
`;

export const Decrypter = (): React.ReactElement => {
    const { decryptionText } = useParams();
    const [manualToken, setManualToken] = useState('');
    const [submittedToken, setSubmittedToken] = useState('');

    const isParamMode = Boolean(decryptionText);

    const tokenToDecrypt = useMemo((): string => {
        if (isParamMode) {
            return decryptionText ?? '';
        }

        return submittedToken;
    }, [decryptionText, isParamMode, submittedToken]);

    const decryptedName = useMemo((): string => {
        if (!tokenToDecrypt.trim()) {
            return '';
        }

        return decrypt(tokenToDecrypt);
    }, [tokenToDecrypt]);

    const handleInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setManualToken(e.target.value);
    };

    const onDecrypt = (): void => {
        setSubmittedToken(manualToken.trim());
    };

    const onInputKeyUp = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            onDecrypt();
        }
    };

    return (
        <>
            {!isParamMode ? (
                <>
                    <PrimaryInput
                        id="manual-decrypter-input"
                        type="text"
                        placeholder="The code goes here"
                        autoFocus
                        value={manualToken}
                        onChange={handleInputChange}
                        onKeyUp={onInputKeyUp}
                    />
                    <ButtonRowWrapper>
                        <ButtonRowContainer>
                            <DecryptButton
                                backgroundColor={SecretSanta.Red}
                                color={SecretSanta.White}
                                onClick={onDecrypt}
                            >
                                Who do I have?
                            </DecryptButton>
                        </ButtonRowContainer>
                    </ButtonRowWrapper>
                </>
            ) : null}

            {decryptedName ? (
                <ResultPanel>
                    <ResultLabel>You have:</ResultLabel>
                    <ResultText>{decryptedName}</ResultText>
                </ResultPanel>
            ) : null}
        </>
    );
};
