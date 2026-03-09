import React, { useState } from 'react';
import { BaseButton, BaseInput, BaseLabel } from '@ww-web-apps/ui';
import './style.css';

const App: React.FC = () => {
    const [inputText, setInputText] = useState('');
    const [outputText, setOutputText] = useState('');
    const [caseType, setCaseType] = useState('title');

    const convert = (sentence: string, type: string): string => {
        let newSentence = '';

        for (let i = 0; i < sentence.length; i++) {
            let charCode = sentence.charAt(i).charCodeAt(0);

            switch (type) {
                case 'title':
                    // For now, just return as-is. Could implement proper title case later
                    break;

                case 'sentence':
                    if (i == 0) {
                        //first letter in the sentence
                        //TODO: subsequent sentences
                        if (charCode >= 97 && charCode <= 122) {
                            //if charCode is lowercase alphabet
                            charCode -= 32; //convert to uppercase
                        }
                    }
                    break;

                case 'upper':
                    if (charCode >= 97 && charCode <= 122) {
                        //if charCode is lowercase alphabet
                        charCode -= 32; //convert to uppercase
                    }
                    break;

                case 'lower':
                    if (charCode >= 65 && charCode <= 90) {
                        //if charCode is uppercase alphabet
                        charCode += 32; //convert to lowercase
                    }
                    break;

                default: //title case
                    break;
            }

            const char = String.fromCharCode(charCode);
            newSentence += char;
        }

        return newSentence;
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newText = e.target.value;
        setInputText(newText);
        setOutputText(convert(newText, caseType));
    };

    const handleCaseTypeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
        const newType = e.target.value;
        setCaseType(newType);
        setOutputText(convert(inputText, newType));
    };

    const getPlaceholderText = () => {
        return `Will convert to: ${convert('text like this', caseType)}`;
    };

    return (
        <div>
            <h1 className="center">TitleCase</h1>
            <div id="userIn" className="center">
                <BaseInput
                    type="text"
                    value={inputText}
                    onChange={handleInputChange}
                    placeholder="text like this"
                />

                <select
                    value={caseType}
                    onChange={handleCaseTypeChange}
                    className="input"
                >
                    <option value="title">Title Case</option>
                    <option value="sentence">Sentence case</option>
                    <option value="upper">UPPER CASE</option>
                    <option value="lower">lower case</option>
                </select>

                <BaseInput
                    type="text"
                    value={outputText}
                    readOnly
                    placeholder={getPlaceholderText()}
                />
            </div>
        </div>
    );
};

export default App;
