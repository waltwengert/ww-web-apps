import { fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { describe, expect, it } from 'vitest';

import { Decrypter } from './Decrypter';

describe('Decrypter UI', () => {
    it('decrypts manual input when button is clicked', () => {
        render(
            <MemoryRouter initialEntries={['/decrypter']}>
                <Routes>
                    <Route path="/decrypter" element={<Decrypter />} />
                </Routes>
            </MemoryRouter>
        );

        fireEvent.change(screen.getByPlaceholderText('The code goes here'), {
            target: { value: 'nyrk' }
        });
        fireEvent.click(screen.getByRole('button', { name: 'Who do I have?' }));

        expect(screen.getByText('alex')).toBeInTheDocument();
    });

    it('auto-decrypts when URL param is present', () => {
        render(
            <MemoryRouter initialEntries={['/decrypter/nyrk']}>
                <Routes>
                    <Route
                        path="/decrypter/:decryptionText"
                        element={<Decrypter />}
                    />
                </Routes>
            </MemoryRouter>
        );

        expect(
            screen.queryByPlaceholderText('The code goes here')
        ).not.toBeInTheDocument();
        expect(screen.getByText('alex')).toBeInTheDocument();
    });
});
