import React from 'react';

import { Generator as GeneratorComponent } from '../components/Generator';
import App from '../SecretSantaApp';

const Generator = (): React.ReactElement => {
    return (
        <App>
            <GeneratorComponent />
        </App>
    );
};

export default Generator;
