import { createHashRouter } from 'react-router-dom';

import { Decrypter, loader as decrypterLoader } from './pages/Decrypter';
import Generator from './pages/Generator';

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
