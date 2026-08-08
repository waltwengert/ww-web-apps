import React from 'react';
import ReactDOM from 'react-dom/client';

import FightPredictorApp from './FightPredictorApp';

import './global.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <FightPredictorApp />
    </React.StrictMode>
);
