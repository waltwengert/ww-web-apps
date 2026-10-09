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

    it('does not shuffle fewer than two participants', () => {
        render(
            <GeneratorStateProvider>
                <Generator />
            </GeneratorStateProvider>
        );
        const input = screen.getByPlaceholderText('Name');

        fireEvent.change(input, { target: { value: 'Jane' } });
        fireEvent.click(screen.getByRole('button', { name: 'Add' }));
        fireEvent.click(screen.getByRole('button', { name: 'Shuffle' }));

        expect(screen.getByRole('alert')).toHaveTextContent(
            'Add at least two participants'
        );
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
        expect(screen.getByText('alex')).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: 'Save all QR codes' })
        ).toBeEnabled();
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

    describe('partner pairs', () => {
        const selectParticipant = (label: string, name: string): void => {
            const select = screen.getByLabelText(label) as HTMLSelectElement;
            const option = Array.from(select.options).find(
                candidate => candidate.textContent === name
            );

            if (!option)
                throw new Error(`Could not find participant option: ${name}`);
            fireEvent.change(select, { target: { value: option.value } });
        };

        it('prevents both directions of a partner assignment', () => {
            vi.spyOn(Math, 'random').mockReturnValue(0.5);

            const { container } = render(
                <GeneratorStateProvider>
                    <Generator />
                </GeneratorStateProvider>
            );
            const input = screen.getByPlaceholderText('Name');

            for (const name of ['Jane', 'Joe', 'Mary', 'Max']) {
                fireEvent.change(input, { target: { value: name } });
                fireEvent.click(screen.getByRole('button', { name: 'Add' }));
            }

            fireEvent.click(
                screen.getByRole('button', { name: 'Add partner pair' })
            );
            selectParticipant('First participant in partner pair 1', 'jane');
            selectParticipant('Second participant in partner pair 1', 'joe');
            fireEvent.click(
                screen.getByRole('button', { name: 'Add partner pair' })
            );
            selectParticipant('First participant in partner pair 2', 'mary');
            selectParticipant('Second participant in partner pair 2', 'max');
            expect(
                screen.getByRole('button', { name: 'Add partner pair' })
            ).toBeDisabled();
            fireEvent.click(screen.getByRole('button', { name: 'Shuffle' }));

            const assignments = new Map(
                Array.from(
                    container.querySelectorAll(
                        '[data-testid^="assignment-row-"]'
                    )
                ).map(row => [
                    row.children[0].textContent,
                    row.children[1].textContent
                ])
            );
            expect(assignments.get('jane')).not.toBe('joe');
            expect(assignments.get('joe')).not.toBe('jane');
            expect(assignments.get('mary')).not.toBe('max');
            expect(assignments.get('max')).not.toBe('mary');
        });

        it('shows an error when partner constraints make a shuffle impossible', () => {
            render(
                <GeneratorStateProvider>
                    <Generator />
                </GeneratorStateProvider>
            );
            const input = screen.getByPlaceholderText('Name');

            for (const name of ['Jane', 'Joe', 'Mary']) {
                fireEvent.change(input, { target: { value: name } });
                fireEvent.click(screen.getByRole('button', { name: 'Add' }));
            }

            fireEvent.click(
                screen.getByRole('button', { name: 'Add partner pair' })
            );
            selectParticipant('First participant in partner pair 1', 'jane');
            selectParticipant('Second participant in partner pair 1', 'joe');
            fireEvent.click(screen.getByRole('button', { name: 'Shuffle' }));

            expect(screen.getByRole('alert')).toHaveTextContent(
                'No valid assignments are possible'
            );
        });
    });
});
