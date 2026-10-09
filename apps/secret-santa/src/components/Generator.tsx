import React, { ChangeEvent, KeyboardEvent, useContext } from 'react';
import styled from 'styled-components';

import {
    Button,
    MOBILE_DEVICE_WIDTH,
    SecretSantaColor,
    Select
} from '@ww-web-apps/ui';

import { GeneratorStateContext, OutputMode } from '../context/GeneratorState';
import {
    decryptStringArray,
    encryptStringArray,
    Participant,
    PartnerPair,
    shuffle,
    shuffleWithPartnerRestrictions
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

const PartnerControls = styled.div`
    width: 50vw;
    margin: 12px auto 0;

    @media (max-width: ${MOBILE_DEVICE_WIDTH}px) {
        width: 90vw;
    }
`;

const PartnerPairList = styled.fieldset`
    display: flex;
    flex-direction: column;
    gap: 10px;
    margin: 12px 0 0;
    padding: 12px;
    border: 1px solid ${SecretSantaColor.White};
    color: ${SecretSantaColor.White};
`;

const PartnerPairRow = styled.div`
    display: grid;
    grid-template-columns: minmax(0, 1fr) minmax(0, 1fr) auto;
    align-items: center;
    gap: 8px;
`;

const PartnerSelect = styled(Select)`
    display: block;
    box-sizing: border-box;
    width: 100%;
    min-width: 0;
    min-height: 40px;
    padding: 6px;
    margin: 0;
`;

const PartnerAction = styled(Button).attrs({
    backgroundColor: SecretSantaColor.Red,
    color: SecretSantaColor.White
})`
    flex: 0 0 auto;
    width: auto;
    min-height: 40px;
    margin: 0;
    padding: 0 12px;
    border-radius: 6px;

    &:active {
        font-size: 18px;
    }
`;

const PartnerError = styled.p`
    color: ${SecretSantaColor.Gold};
`;

export const Generator = (): React.ReactElement => {
    const generatorState = useContext(GeneratorStateContext);
    if (!generatorState)
        throw new Error('Generator requires GeneratorStateProvider');

    const {
        participants,
        setParticipants,
        partnerPairs,
        setPartnerPairs,
        shuffledNameList,
        setShuffledNameList,
        mode,
        setMode,
        hidden,
        setHidden,
        currentText,
        setCurrentText
    } = generatorState;
    const [assignmentError, setAssignmentError] = React.useState('');
    const hideButtonText = hidden ? 'Reveal all' : 'Hide all';

    const handleTextInputChange = (e: ChangeEvent<HTMLInputElement>): void => {
        setCurrentText(e.target.value);
    };

    const onAdd = (): void => {
        const clean = currentText.trim().toLowerCase();
        if (clean.length > 0) {
            setParticipants([
                ...participants,
                { id: crypto.randomUUID(), name: clean }
            ]);
            setShuffledNameList([]);
            setAssignmentError('');
        }
        setCurrentText('');
    };

    const onInputKeyUp = (e: KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') onAdd();
    };

    const onShuffle = (): void => {
        if (participants.length < 2) {
            setAssignmentError(
                'Add at least two participants before shuffling.'
            );
            return;
        }

        if (
            partnerPairs.some(
                pair => !pair.firstParticipantId || !pair.secondParticipantId
            )
        ) {
            setAssignmentError('Choose both people in each partner pair.');
            return;
        }

        const shuffledParticipantIds = partnerPairs.length
            ? shuffleWithPartnerRestrictions(
                  participants.map(participant => participant.id),
                  partnerPairs
              )
            : shuffle([...participants]).map(participant => participant.id);

        if (!shuffledParticipantIds) {
            setAssignmentError(
                'No valid assignments are possible with these partner pairs. Adjust the pairs or add participants and try again.'
            );
            return;
        }

        const participantNames = new Map(
            participants.map(participant => [participant.id, participant.name])
        );
        const shuffled = shuffledParticipantIds.map(
            participantId => participantNames.get(participantId) ?? ''
        );
        if (mode !== 'plain') {
            setShuffledNameList(encryptStringArray(shuffled));
        } else {
            setShuffledNameList(shuffled);
        }
        setAssignmentError('');
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

    const assignedParticipantIds = new Set(
        partnerPairs.flatMap(pair => [
            pair.firstParticipantId,
            pair.secondParticipantId
        ])
    );
    const availableParticipants = participants.filter(
        participant => !assignedParticipantIds.has(participant.id)
    );
    const hasIncompletePartnerPair = partnerPairs.some(
        pair => !pair.firstParticipantId || !pair.secondParticipantId
    );

    const getPairOptions = (
        pair: PartnerPair,
        selection: 'firstParticipantId' | 'secondParticipantId'
    ): Participant[] => {
        const selectedInOtherPairs = new Set(
            partnerPairs
                .filter(otherPair => otherPair.id !== pair.id)
                .flatMap(otherPair => [
                    otherPair.firstParticipantId,
                    otherPair.secondParticipantId
                ])
        );
        const otherSelection =
            selection === 'firstParticipantId'
                ? pair.secondParticipantId
                : pair.firstParticipantId;
        const currentSelection = pair[selection];

        return participants.filter(
            participant =>
                participant.id === currentSelection ||
                (!selectedInOtherPairs.has(participant.id) &&
                    participant.id !== otherSelection)
        );
    };

    const updatePartnerPair = (
        pairId: string,
        selection: 'firstParticipantId' | 'secondParticipantId',
        participantId: string
    ): void => {
        setPartnerPairs(
            partnerPairs.map(pair =>
                pair.id === pairId
                    ? { ...pair, [selection]: participantId }
                    : pair
            )
        );
        setShuffledNameList([]);
        setAssignmentError('');
    };

    const addPartnerPair = (): void => {
        if (availableParticipants.length < 2 || hasIncompletePartnerPair)
            return;
        const newPair: PartnerPair = {
            id: crypto.randomUUID(),
            firstParticipantId: '',
            secondParticipantId: ''
        };
        setPartnerPairs([...partnerPairs, newPair]);
        setShuffledNameList([]);
        setAssignmentError('');
    };

    const removePartnerPair = (pairId: string): void => {
        setPartnerPairs(partnerPairs.filter(pair => pair.id !== pairId));
        setShuffledNameList([]);
        setAssignmentError('');
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
            <PartnerControls>
                <PartnerAction
                    type="button"
                    onClick={addPartnerPair}
                    disabled={
                        availableParticipants.length < 2 ||
                        hasIncompletePartnerPair
                    }
                >
                    Add partner pair
                </PartnerAction>
                {partnerPairs.length > 0 ? (
                    <PartnerPairList>
                        <legend>Partner pairs</legend>
                        {partnerPairs.map((pair, index) => (
                            <PartnerPairRow key={pair.id}>
                                <PartnerSelect
                                    aria-label={`First participant in partner pair ${index + 1}`}
                                    value={pair.firstParticipantId}
                                    onChange={event =>
                                        updatePartnerPair(
                                            pair.id,
                                            'firstParticipantId',
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">Select participant</option>
                                    {getPairOptions(
                                        pair,
                                        'firstParticipantId'
                                    ).map(participant => (
                                        <option
                                            key={participant.id}
                                            value={participant.id}
                                        >
                                            {participant.name}
                                        </option>
                                    ))}
                                </PartnerSelect>
                                <PartnerSelect
                                    aria-label={`Second participant in partner pair ${index + 1}`}
                                    value={pair.secondParticipantId}
                                    onChange={event =>
                                        updatePartnerPair(
                                            pair.id,
                                            'secondParticipantId',
                                            event.target.value
                                        )
                                    }
                                >
                                    <option value="">Select participant</option>
                                    {getPairOptions(
                                        pair,
                                        'secondParticipantId'
                                    ).map(participant => (
                                        <option
                                            key={participant.id}
                                            value={participant.id}
                                        >
                                            {participant.name}
                                        </option>
                                    ))}
                                </PartnerSelect>
                                <PartnerAction
                                    type="button"
                                    onClick={() => removePartnerPair(pair.id)}
                                    aria-label={`Remove partner pair ${index + 1}`}
                                >
                                    Remove
                                </PartnerAction>
                            </PartnerPairRow>
                        ))}
                    </PartnerPairList>
                ) : null}
                {assignmentError ? (
                    <PartnerError role="alert">{assignmentError}</PartnerError>
                ) : null}
            </PartnerControls>
            <Results
                participants={participants}
                shuffledNameList={shuffledNameList}
                hidden={hidden}
                mode={mode}
            />
        </>
    );
};
