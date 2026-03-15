import React, { ChangeEvent, useEffect, useState } from 'react';
import styled from 'styled-components';

import { Button, Checkbox, SecretSanta } from '@ww-web-apps/ui';

import {
    decryptStringArray,
    encryptStringArray,
    shuffle
} from '../utilities/utils';
import { ButtonRowContainer, ButtonRowWrapper } from './layout';
import { PrimaryInput } from './PrimaryInput';
import { Results } from './Results';

const EncryptedCheckbox = styled(Checkbox)`
    flex: 2;
`;

export const Generator = (): React.ReactElement => {
    const [nameList, setNameList] = useState<string[]>([]);
    const [shuffledNameList, setShuffledNameList] = useState<string[]>([]);
    const [encrypted, setEncrypted] = useState(false);
    const [hidden, setHidden] = useState(false);
    const [currentText, setCurrentText] = useState('');

    const [hideButtonText, setHideButtonText] = useState<
        'Hide all' | 'Reveal all'
    >('Hide all');

    const handleTextInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCurrentText(e.target.value);
    };

    const onAdd = (): void => {
        const clean = currentText.trim().toLowerCase();
        if (clean.length > 0) {
            setNameList([...nameList, clean]);
        }
        setCurrentText('');
    };

    const onShuffle = (): void => {
        const shuffled = shuffle([...nameList]);
        if (encrypted) {
            setShuffledNameList(encryptStringArray(shuffled));
        } else {
            setShuffledNameList(shuffled);
        }
    };

    const onToggleEncrypted = (): void => {
        const next = !encrypted;
        setEncrypted(next);
        if (next) {
            // Encrypt whatever is currently in shuffledNameList.
            setShuffledNameList(encryptStringArray(shuffledNameList));
        } else {
            // Decrypt tokens back to plain names.
            setShuffledNameList(decryptStringArray(shuffledNameList));
        }
    };

    const onHide = (): void => {
        setHidden(!hidden);
    };

    useEffect(() => {
        if (hidden) {
            setHideButtonText('Reveal all');
        } else {
            setHideButtonText('Hide all');
        }
    }, [hidden]);

    return (
        <>
            <PrimaryInput
                placeholder="Name"
                autoFocus={true}
                value={currentText}
                onChange={handleTextInputChange}
                bottomSlot={
                    <EncryptedCheckbox
                        labelText="Encrypted?"
                        onChange={onToggleEncrypted}
                    />
                }
            />
            <ButtonRowWrapper>
                <ButtonRowContainer>
                    <Button
                        backgroundColor={SecretSanta.Red}
                        color={SecretSanta.White}
                        onClick={onAdd}
                    >
                        Add
                    </Button>
                    <Button
                        backgroundColor={SecretSanta.Red}
                        color={SecretSanta.White}
                        onClick={onShuffle}
                    >
                        Shuffle
                    </Button>
                    <Button
                        backgroundColor={SecretSanta.Red}
                        color={SecretSanta.White}
                        onClick={onHide}
                    >
                        {hideButtonText}
                    </Button>
                </ButtonRowContainer>
            </ButtonRowWrapper>
            <Results
                nameList={nameList}
                shuffledNameList={shuffledNameList}
                hidden={hidden}
                encrypted={encrypted}
            />
        </>
    );
};
