import React from 'react';

import App from '../App';
import { Generator as GeneratorComponent } from '../components/Generator';

const Generator = (): React.ReactElement => {
    return (
        <App>
            <GeneratorComponent />
        </App>
    );
};

export default Generator;
