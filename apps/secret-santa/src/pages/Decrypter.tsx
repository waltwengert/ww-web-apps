import React from 'react';

import App from '../App';
import { Decrypter as DecrypterComponent } from '../components/Decrypter';

export const Decrypter = (): React.ReactElement => {
    return (
        <App>
            <DecrypterComponent />
        </App>
    );
};
