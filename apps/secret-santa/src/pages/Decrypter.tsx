import React from 'react';

import { Decrypter as DecrypterComponent } from '../components/Decrypter';
import SecretSantaApp from '../SecretSantaApp';

export const Decrypter = (): React.ReactElement => {
    return (
        <SecretSantaApp>
            <DecrypterComponent />
        </SecretSantaApp>
    );
};
