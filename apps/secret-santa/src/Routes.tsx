import { createHashRouter } from 'react-router-dom';

import Generator from './pages/Generator';
import { Decrypter, loader as decrypterLoader } from './pages/Decrypter';

export const router = createHashRouter([
    {
        path: '/',
        errorElement: <>Some error happened</>,
        children: [
            {
                path: '',
                element: <Generator />,
                index: true
            },
            {
                path: 'decrypter/:decryptionText',
                element: <Decrypter />,
                loader: decrypterLoader
            }
        ]
    }
]);
