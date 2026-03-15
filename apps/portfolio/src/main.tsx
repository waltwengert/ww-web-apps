import React from 'react';
import ReactDOM from 'react-dom/client';

import App from './PortfolioApp';

import '@fontsource/roboto-slab/400.css';
import '../style.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <App />
    </React.StrictMode>
);
