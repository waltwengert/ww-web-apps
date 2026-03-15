import { fireEvent, render, screen } from '@testing-library/react';
import { axe } from 'jest-axe';
import { describe, expect, it } from 'vitest';

import App from './TitleCaseApp';

describe('TitleCase App', () => {
    it('renders app heading', () => {
        render(<App />);
        expect(screen.getByText(/titlecase/i)).toBeInTheDocument();
    });

    it('has no a11y violations', async () => {
        const { container } = render(<App />);
        expect(await axe(container)).toHaveNoViolations();
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

    it('shows cipher shift input for Caesar modes and applies chosen shift', () => {
        render(<App />);

        const [input, output] = screen.getAllByRole('textbox');
        const selector = screen.getByRole('combobox');

        expect(screen.queryByLabelText('Cipher shift')).not.toBeInTheDocument();

        fireEvent.change(selector, { target: { value: 'caesar-encode' } });

        const shiftInput = screen.getByLabelText('Cipher shift');
        expect(shiftInput).toBeInTheDocument();

        fireEvent.change(input, { target: { value: 'abc xyz' } });
        expect(output).toHaveValue('nop klm');

        fireEvent.change(shiftInput, { target: { value: '5' } });
        expect(output).toHaveValue('fgh cde');

        fireEvent.change(selector, { target: { value: 'caesar-decode' } });
        fireEvent.change(input, { target: { value: 'fgh cde' } });
        expect(output).toHaveValue('abc xyz');
    });
});
