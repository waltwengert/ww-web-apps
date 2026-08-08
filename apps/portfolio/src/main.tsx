import React from 'react';
import ReactDOM from 'react-dom/client';

import PortfolioApp from './PortfolioApp';

import '@fontsource/roboto-slab/400.css';
import './global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <PortfolioApp />
    </React.StrictMode>
);
