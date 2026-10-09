import React, { createContext, useState } from 'react';

export type OutputMode = 'plain' | 'encrypted' | 'qr';

interface GeneratorState {
    nameList: string[];
    setNameList: React.Dispatch<React.SetStateAction<string[]>>;
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
    const [nameList, setNameList] = useState<string[]>([]);
    const [shuffledNameList, setShuffledNameList] = useState<string[]>([]);
    const [mode, setMode] = useState<OutputMode>('plain');
    const [hidden, setHidden] = useState(false);
    const [currentText, setCurrentText] = useState('');

    return (
        <GeneratorStateContext.Provider
            value={{
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
            }}
        >
            {children}
        </GeneratorStateContext.Provider>
    );
};
