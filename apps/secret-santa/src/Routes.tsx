import type { ReactElement } from 'react';
import { createHashRouter, Outlet } from 'react-router-dom';

import { GeneratorStateProvider } from './context/GeneratorState';
import { Decrypter } from './pages/Decrypter';
import Generator from './pages/Generator';

const RootLayout = (): ReactElement => (
    <GeneratorStateProvider>
        <Outlet />
    </GeneratorStateProvider>
);

export const router = createHashRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <>Some error happened</>,
        children: [
            {
                path: '',
                element: <Generator />,
                index: true
            },
            {
                path: 'decrypter',
                element: <Decrypter />
            },
            {
                path: 'decrypter/:decryptionText',
                element: <Decrypter />
            }
        ]
    }
]);
