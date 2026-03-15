import styled from 'styled-components';
import React from 'react';

import { Header } from './components/Header';

const AppWrapper = styled.div`
    background-color: #146b3a;

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
