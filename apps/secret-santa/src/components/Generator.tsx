import React, { ChangeEvent, KeyboardEvent, useContext } from 'react';
import styled from 'styled-components';

import { Button, SecretSantaColor } from '@ww-web-apps/ui';

import { GeneratorStateContext, OutputMode } from '../context/GeneratorState';
import {
    decryptStringArray,
    encryptStringArray,
    shuffle
} from '../lib/secretSanta';
import { ButtonRowContainer, ButtonRowWrapper } from './layout';
import { PrimaryInput } from './PrimaryInput';
import { Results } from './Results';

const ModeSelector = styled.fieldset`
    display: flex;
    justify-content: center;
    gap: 12px;
    margin: 0 0 10px;
    padding: 0;
    border: 0;
`;

const ModeOption = styled.label`
    display: inline-flex;
    align-items: center;
    gap: 6px;
    cursor: pointer;

    input {
        margin: 0;
        accent-color: ${SecretSantaColor.Red};
    }
`;

export const Generator = (): React.ReactElement => {
    const generatorState = useContext(GeneratorStateContext);
    if (!generatorState)
        throw new Error('Generator requires GeneratorStateProvider');

    const {
        nameList,
        setNameList,
        shuffledNameList,
        setShuffledNameList,
        mode,
        setMode,
        hidden,
        setHidden,
        currentText,
        setCurrentText
    } = generatorState;
    const hideButtonText = hidden ? 'Reveal all' : 'Hide all';

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

    const onInputKeyUp = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') onAdd();
    };

    const onShuffle = (): void => {
        const shuffled = shuffle([...nameList]);
        if (mode !== 'plain') {
            setShuffledNameList(encryptStringArray(shuffled));
        } else {
            setShuffledNameList(shuffled);
        }
    };

    const onModeChange = (nextMode: OutputMode): void => {
        if (nextMode === mode) return;

        if (mode === 'plain' && nextMode !== 'plain') {
            setShuffledNameList(encryptStringArray(shuffledNameList));
        } else if (mode !== 'plain' && nextMode === 'plain') {
            setShuffledNameList(decryptStringArray(shuffledNameList));
        }
        setMode(nextMode);
    };

    const onHide = (): void => {
        setHidden(!hidden);
    };

    return (
        <>
            <PrimaryInput
                placeholder="Name"
                autoFocus={true}
                value={currentText}
                onChange={handleTextInputChange}
                onKeyUp={onInputKeyUp}
                bottomSlot={
                    <ModeSelector aria-label="Output mode">
                        <ModeOption>
                            <input
                                type="radio"
                                name="output-mode"
                                value="plain"
                                checked={mode === 'plain'}
                                onChange={() => onModeChange('plain')}
                            />
                            Plain
                        </ModeOption>
                        <ModeOption>
                            <input
                                type="radio"
                                name="output-mode"
                                value="encrypted"
                                checked={mode === 'encrypted'}
                                onChange={() => onModeChange('encrypted')}
                            />
                            Encrypted
                        </ModeOption>
                        <ModeOption>
                            <input
                                type="radio"
                                name="output-mode"
                                value="qr"
                                checked={mode === 'qr'}
                                onChange={() => onModeChange('qr')}
                            />
                            QR
                        </ModeOption>
                    </ModeSelector>
                }
            />
            <ButtonRowWrapper>
                <ButtonRowContainer>
                    <Button
                        backgroundColor={SecretSantaColor.Red}
                        color={SecretSantaColor.White}
                        onClick={onAdd}
                    >
                        Add
                    </Button>
                    <Button
                        backgroundColor={SecretSantaColor.Red}
                        color={SecretSantaColor.White}
                        onClick={onShuffle}
                    >
                        Shuffle
                    </Button>
                    <Button
                        backgroundColor={SecretSantaColor.Red}
                        color={SecretSantaColor.White}
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
                mode={mode}
            />
        </>
    );
};
