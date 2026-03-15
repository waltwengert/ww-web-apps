import React, { useState } from 'react';

const CIPHER_KEY = 13;
const PREFIX_LENGTH = 4;

const decryptToken = (token: string): string => {
    const nameKey = token.toLowerCase();
    const nameKeyNumberStripped = nameKey.slice(PREFIX_LENGTH);
    let decryptedParticipant = '';

    for (let i = 0; i < nameKeyNumberStripped.length; i++) {
        let charCode = nameKeyNumberStripped.charAt(i).charCodeAt(0);

        // lower-case ASCII alphabet is 97 (a) to 122 (z)
        if (charCode - CIPHER_KEY < 97) {
            charCode -= CIPHER_KEY - 26;
        } else {
            charCode -= CIPHER_KEY;
        }

        decryptedParticipant += String.fromCharCode(charCode);
    }

    return decryptedParticipant;
};

const App = (): React.ReactElement => {
    const [input, setInput] = useState('');
    const [recipient, setRecipient] = useState('');

    const onDecrypt = (): void => {
        setRecipient(decryptToken(input));
    };

    const onInputKeyUp = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') {
            onDecrypt();
        }
    };

    return (
        <>
            <h1 className="heading">Secret Santa</h1>
            <input
                id="input"
                type="text"
                placeholder="The code goes here"
                autoFocus
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyUp={onInputKeyUp}
            />

            <div className="inputBtns">
                <button onClick={onDecrypt} id="hide">
                    Who do I have?
                </button>
            </div>

            <div id="result" className="pContainer">
                <p className="whiteTxt">You have:</p>
                <p id="recipient">{recipient}</p>
            </div>
        </>
    );
};

export default App;
