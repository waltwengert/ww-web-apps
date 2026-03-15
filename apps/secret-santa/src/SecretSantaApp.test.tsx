import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';

import App from './SecretSantaApp';

it('renders secret santa text', () => {
    render(
        <MemoryRouter>
            <App>Test</App>
        </MemoryRouter>
    );
    const linkElement = screen.getByText(/secret santa/i);
    expect(linkElement).toBeInTheDocument();
});

it('has no a11y violations', async () => {
    const { container } = render(
        <MemoryRouter>
            <App>Test</App>
        </MemoryRouter>
    );
    expect(await axe(container)).toHaveNoViolations();
});
