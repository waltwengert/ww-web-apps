import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import App from './FutureWeightApp';

describe('FutureWeight App', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders app heading', () => {
        render(<App />);
        expect(screen.getByText(/future weight/i)).toBeInTheDocument();
    });

    it('calculates and renders BMR, TDEE, and BMI for valid metric inputs', () => {
        render(<App />);

        const textInputs = screen.getAllByRole('textbox');
        const [ageInput, heightInput, weightInput] = textInputs;

        fireEvent.change(ageInput, { target: { value: '30' } });
        fireEvent.change(heightInput, { target: { value: '180' } });
        fireEvent.change(weightInput, { target: { value: '80' } });

        fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

        expect(screen.getByText('1780')).toBeInTheDocument();
        expect(screen.getByText('2136')).toBeInTheDocument();
        expect(screen.getByText('24.7')).toBeInTheDocument();
    });

    it('shows inline validation error and does not show results with invalid stats', () => {
        render(<App />);

        const textInputs = screen.getAllByRole('textbox');
        const [ageInput, heightInput, weightInput] = textInputs;

        fireEvent.change(ageInput, { target: { value: '141' } });
        fireEvent.change(heightInput, { target: { value: '180' } });
        fireEvent.change(weightInput, { target: { value: '80' } });

        fireEvent.click(screen.getByRole('button', { name: /calculate/i }));

        expect(
            screen.getByText('Age must be a whole number between 0 and 140')
        ).toBeInTheDocument();
        expect(screen.queryByText('1780')).not.toBeInTheDocument();
    });
});
