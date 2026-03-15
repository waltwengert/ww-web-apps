import React from 'react';
import styled from 'styled-components';

import { SecretSanta } from '@ww-web-apps/ui';

import { Header } from './components/Header';

const AppWrapper = styled.div`
    background-color: ${SecretSanta.BackgroundGreen};

    min-width: 100vw;
    min-height: 100vh;

    text-align: center;
    display: flex;
    flex-direction: column;
`;

interface AppProps {
    children: React.ReactNode;
}

const App = ({ children }: AppProps): React.ReactElement => {
    return (
        <AppWrapper>
            <Header />
            {children}
        </AppWrapper>
    );
};

export default App;
