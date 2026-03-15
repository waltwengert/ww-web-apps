import React from 'react';

import { Decrypter as DecrypterComponent } from '../components/Decrypter';
import App from '../SecretSantaApp';

export const Decrypter = (): React.ReactElement => {
    return (
        <App>
            <DecrypterComponent />
        </App>
    );
};
