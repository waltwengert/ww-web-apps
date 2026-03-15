import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { Generator } from './Generator';

describe('Generator UI', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('adds participant names trimmed/lowercased', () => {
        render(<Generator />);

        fireEvent.change(screen.getByPlaceholderText('Name'), {
            target: { value: ' Alex ' }
        });
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));

        expect(screen.getByText('alex')).toBeInTheDocument();
    });

    it('shows encrypted links after shuffle when encryption is enabled', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        render(<Generator />);

        const input = screen.getByPlaceholderText('Name');
        fireEvent.change(input, { target: { value: ' Alex ' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));
        fireEvent.change(input, { target: { value: 'charles' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));

        fireEvent.click(screen.getByLabelText('Encrypted?'));
        fireEvent.click(screen.getByRole('button', { name: 'Shuffle' }));

        const encryptedLinks = screen.getAllByRole('link');
        expect(encryptedLinks.length).toBeGreaterThan(0);
        expect(encryptedLinks[0]).toHaveAttribute(
            'href',
            expect.stringContaining('/decrypter/')
        );
    });
});
