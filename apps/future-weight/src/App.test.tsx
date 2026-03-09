import { render, screen } from '@testing-library/react';
import { expect, it } from 'vitest';

import App from './App';

it('renders future weight text', () => {
    render(<App />);
    const linkElement = screen.getByText(/future weight/i);
    expect(linkElement).toBeInTheDocument();
});
