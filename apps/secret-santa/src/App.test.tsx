import { render, screen } from '@testing-library/react';

import App from './App';

it('renders secret santa text', () => {
    render(<App>Test</App>);
    const linkElement = screen.getByText(/secret santa/i);
    expect(linkElement).toBeInTheDocument();
});
