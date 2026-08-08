import React from 'react';

import { Generator as GeneratorComponent } from '../components/Generator';
import SecretSantaApp from '../SecretSantaApp';

const Generator = (): React.ReactElement => {
    return (
        <SecretSantaApp>
            <GeneratorComponent />
        </SecretSantaApp>
    );
};

export default Generator;
