import { render, screen } from '@testing-library/react';

import App from './App';

it('renders title case text', () => {
    render(<App />);
    const linkElement = screen.getByText(/titlecase/i);
    expect(linkElement).toBeInTheDocument();
});
