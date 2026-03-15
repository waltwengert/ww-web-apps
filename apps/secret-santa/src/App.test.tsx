import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';

import App from './App';

it('renders secret santa text', () => {
    render(
        <MemoryRouter>
            <App>Test</App>
        </MemoryRouter>
    );
    const linkElement = screen.getByText(/secret santa/i);
    expect(linkElement).toBeInTheDocument();
});
