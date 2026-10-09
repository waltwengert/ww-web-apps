import React, { createContext, useState } from 'react';

import { Participant, PartnerPair } from '../lib/secretSanta';

export type OutputMode = 'plain' | 'encrypted' | 'qr';

interface GeneratorState {
    participants: Participant[];
    setParticipants: React.Dispatch<React.SetStateAction<Participant[]>>;
    partnerPairs: PartnerPair[];
    setPartnerPairs: React.Dispatch<React.SetStateAction<PartnerPair[]>>;
    shuffledNameList: string[];
    setShuffledNameList: React.Dispatch<React.SetStateAction<string[]>>;
    mode: OutputMode;
    setMode: React.Dispatch<React.SetStateAction<OutputMode>>;
    hidden: boolean;
    setHidden: React.Dispatch<React.SetStateAction<boolean>>;
    currentText: string;
    setCurrentText: React.Dispatch<React.SetStateAction<string>>;
}

export const GeneratorStateContext = createContext<GeneratorState | undefined>(
    undefined
);

interface GeneratorStateProviderProps {
    children: React.ReactNode;
}

export const GeneratorStateProvider = ({
    children
}: GeneratorStateProviderProps): React.ReactElement => {
    const [participants, setParticipants] = useState<Participant[]>([]);
    const [partnerPairs, setPartnerPairs] = useState<PartnerPair[]>([]);
    const [shuffledNameList, setShuffledNameList] = useState<string[]>([]);
    const [mode, setMode] = useState<OutputMode>('plain');
    const [hidden, setHidden] = useState(false);
    const [currentText, setCurrentText] = useState('');

    return (
        <GeneratorStateContext.Provider
            value={{
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
            }}
        >
            {children}
        </GeneratorStateContext.Provider>
    );
};
