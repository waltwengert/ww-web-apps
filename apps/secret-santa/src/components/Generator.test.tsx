import { fireEvent, render, screen } from '@testing-library/react';
import { Link, MemoryRouter, Route, Routes } from 'react-router-dom';
import { afterEach, describe, expect, it, vi } from 'vitest';

import { GeneratorStateProvider } from '../context/GeneratorState';
import { Generator } from './Generator';

describe('Generator UI', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('adds participant names trimmed/lowercased', () => {
        render(
            <GeneratorStateProvider>
                <Generator />
            </GeneratorStateProvider>
        );

        fireEvent.change(screen.getByPlaceholderText('Name'), {
            target: { value: ' Alex ' }
        });
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));

        expect(screen.getByText('alex')).toBeInTheDocument();
    });

    it('shows encrypted links after shuffle when encrypted mode is selected', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        render(
            <GeneratorStateProvider>
                <Generator />
            </GeneratorStateProvider>
        );

        const input = screen.getByPlaceholderText('Name');
        fireEvent.change(input, { target: { value: ' Alex ' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));
        fireEvent.change(input, { target: { value: 'charles' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));

        fireEvent.click(screen.getByLabelText('Encrypted'));
        fireEvent.click(screen.getByRole('button', { name: 'Shuffle' }));

        const encryptedLinks = screen.getAllByRole('link');
        expect(encryptedLinks.length).toBeGreaterThan(0);
        expect(encryptedLinks[0]).toHaveAttribute(
            'href',
            expect.stringContaining('/decrypter/')
        );
    });

    it('shows QR codes after shuffle when QR mode is selected', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        const { container } = render(
            <GeneratorStateProvider>
                <Generator />
            </GeneratorStateProvider>
        );

        const input = screen.getByPlaceholderText('Name');
        fireEvent.change(input, { target: { value: 'Alex' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));
        fireEvent.change(input, { target: { value: 'Charles' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));

        fireEvent.click(screen.getByLabelText('QR'));
        fireEvent.click(screen.getByRole('button', { name: 'Shuffle' }));

        expect(
            screen.getAllByRole('img', { name: 'Scan to reveal assignment' })
        ).toHaveLength(2);
        expect(container.querySelector('svg')).toBeInTheDocument();
    });

    it('retains generator state when navigating to and from the decrypter', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        render(
            <GeneratorStateProvider>
                <MemoryRouter initialEntries={['/generator']}>
                    <Routes>
                        <Route
                            path="/generator"
                            element={
                                <>
                                    <Generator />
                                    <Link to="/decrypter">Open Decrypter</Link>
                                </>
                            }
                        />
                        <Route
                            path="/decrypter"
                            element={
                                <Link to="/generator">Back to Generator</Link>
                            }
                        />
                    </Routes>
                </MemoryRouter>
            </GeneratorStateProvider>
        );

        const input = screen.getByPlaceholderText('Name');
        fireEvent.change(input, { target: { value: 'Alex' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));
        fireEvent.change(input, { target: { value: 'Charles' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));
        fireEvent.click(screen.getByLabelText('QR'));
        fireEvent.click(screen.getByRole('button', { name: 'Shuffle' }));

        fireEvent.click(screen.getByRole('link', { name: 'Open Decrypter' }));
        fireEvent.click(
            screen.getByRole('link', { name: 'Back to Generator' })
        );

        expect(screen.getByLabelText('QR')).toBeChecked();
        expect(
            screen.getAllByRole('img', { name: 'Scan to reveal assignment' })
        ).toHaveLength(2);
        expect(screen.getByText('alex')).toBeInTheDocument();
    });
});
