import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';

import App from './TitleCaseApp';

describe('TitleCase App', () => {
    it('renders app heading', () => {
        render(<App />);
        expect(screen.getByText(/titlecase/i)).toBeInTheDocument();
    });

    it('converts text to title/upper/sentence/lower via case selector', () => {
        render(<App />);

        const [input, output] = screen.getAllByRole('textbox');
        const selector = screen.getByRole('combobox');

        fireEvent.change(input, {
            target: { value: 'hello world. this IS some tExT!' }
        });
        expect(output).toHaveValue('Hello World. This Is Some Text!');

        fireEvent.change(selector, { target: { value: 'upper' } });
        expect(output).toHaveValue('HELLO WORLD. THIS IS SOME TEXT!');

        fireEvent.change(selector, { target: { value: 'sentence' } });
        expect(output).toHaveValue('Hello world. This is some text!');

        fireEvent.change(selector, { target: { value: 'lower' } });
        expect(output).toHaveValue('hello world. this is some text!');
    });
});
