import React from 'react';

import App from '../App';
import { UserInput } from '../components/UserInput';

const Generator = (): React.ReactElement => {
    return (
        <App>
            <UserInput />
        </App>
    );
};

export default Generator;
