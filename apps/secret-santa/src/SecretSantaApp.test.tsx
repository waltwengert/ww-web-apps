import { render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { MemoryRouter } from 'react-router-dom';
import { expect, it } from 'vitest';

import SecretSantaApp from './SecretSantaApp';

it('renders secret santa text', () => {
    render(
        <MemoryRouter>
            <SecretSantaApp>Test</SecretSantaApp>
        </MemoryRouter>
    );
    const linkElement = screen.getByText(/secret santa/i);
    expect(linkElement).toBeInTheDocument();
});

it('has no a11y violations', async () => {
    const { container } = render(
        <MemoryRouter>
            <SecretSantaApp>Test</SecretSantaApp>
        </MemoryRouter>
    );
    expect(await axe(container)).toHaveNoViolations();
});
