import React, { useState } from 'react';
import styled from 'styled-components';

import { Input, Select, TitleCase } from '@ww-web-apps/ui';

import { convertTextCase, TextCaseType } from './lib/textCase';

const Page = styled.main`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
`;

const Card = styled.section`
    width: min(720px, 92vw);
    background: ${TitleCase.CardBackground};
    border: 1px solid ${TitleCase.CardBorder};
    border-radius: 20px;
    box-shadow: 0 20px 40px ${TitleCase.CardShadow};
    padding: 28px 24px;
`;

const Heading = styled.h1`
    margin: 0;
    text-align: center;
    color: ${TitleCase.Heading};
    font-size: clamp(2rem, 4.4vw, 2.9rem);
    letter-spacing: 0.02em;
`;

const Subheading = styled.p`
    margin: 10px 0 24px;
    text-align: center;
    color: ${TitleCase.Muted};
    font-size: 1.02rem;
`;

const ControlsStack = styled.div`
    width: min(560px, 100%);
    margin: 0 auto;
    display: grid;
    gap: 12px;
    align-items: center;
`;

const TitleCaseInput = styled(Input)`
    width: 100%;
    margin: 0;
    border: 1px solid ${TitleCase.CardBorder};
    border-radius: 12px;
    color: ${TitleCase.Text};
    background: ${TitleCase.White};

    &:focus {
        outline: 2px solid ${TitleCase.Accent};
        outline-offset: 1px;
    }
`;

const CaseSelector = styled(Select)`
    width: 100%;
    margin: 0;
    border-color: ${TitleCase.Accent};
    color: ${TitleCase.Heading};
    background-color: ${TitleCase.AccentSoft};
`;

const App: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [caseType, setCaseType] = useState<TextCaseType>('title');
    const [cipherShift, setCipherShift] = useState('13');

    const getParsedCipherShift = (rawShift: string): number => {
        const parsedShift = parseInt(rawShift, 10);
        return Number.isNaN(parsedShift) ? 0 : parsedShift;
    };

    const isCaesarMode =
        caseType === 'caesar-encode' || caseType === 'caesar-decode';

    const handleInputChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const newText = e.target.value;
        setInputText(newText);
        setOutputText(
            convertTextCase(
                newText,
                caseType,
                getParsedCipherShift(cipherShift)
            )
        );
    };

    const handleCaseTypeChange = (
        e: React.ChangeEvent<HTMLSelectElement>
    ): void => {
        const newType = e.target.value as TextCaseType;
        setCaseType(newType);
        setOutputText(
            convertTextCase(
                inputText,
                newType,
                getParsedCipherShift(cipherShift)
            )
        );
    };

    const handleCipherShiftChange = (
        e: React.ChangeEvent<HTMLInputElement>
    ): void => {
        const newShift = e.target.value;
        setCipherShift(newShift);
        setOutputText(
            convertTextCase(inputText, caseType, getParsedCipherShift(newShift))
        );
    };

    return (
        <Page>
            <Card>
                <Heading>TitleCase</Heading>
                <Subheading>
                    Convert text between title, sentence, upper, and lower case
                    styles.
                </Subheading>

                <ControlsStack>
                    <TitleCaseInput
                        aria-label="Input text"
                        type="text"
                        value={inputText}
                        onChange={handleInputChange}
                        placeholder="text like this"
                    />

                    {isCaesarMode ? (
                        <TitleCaseInput
                            aria-label="Cipher shift"
                            type="number"
                            value={cipherShift}
                            onChange={handleCipherShiftChange}
                            placeholder="e.g. 13"
                        />
                    ) : null}

                    <CaseSelector
                        aria-label="Case type"
                        value={caseType}
                        onChange={handleCaseTypeChange}
                    >
                        <optgroup label="Case styles">
                            <option value="title">Title Case</option>
                            <option value="sentence">Sentence case</option>
                            <option value="upper">UPPER CASE</option>
                            <option value="lower">lower case</option>
                        </optgroup>
                        <optgroup label="Caesar cipher">
                            <option value="caesar-encode">Caesar encode</option>
                            <option value="caesar-decode">Caesar decode</option>
                        </optgroup>
                    </CaseSelector>

                    <TitleCaseInput
                        aria-label="Output text"
                        type="text"
                        value={outputText}
                        readOnly
                    />
                </ControlsStack>
            </Card>
        </Page>
    );
};

export default App;
