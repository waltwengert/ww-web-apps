import { describe, expect, it } from 'vitest';

import { caesarDecrypt, caesarEncrypt, caesarShift } from './caesarCipher';

describe('caesarCipher', () => {
    it('handles identity shifts (0, 26, -26)', () => {
        const input = 'Abc xyz!';

        expect(caesarShift(input, 0)).toBe(input);
        expect(caesarShift(input, 26)).toBe(input);
        expect(caesarShift(input, -26)).toBe(input);
    });

    it('normalizes large positive and negative shifts', () => {
        expect(caesarShift('abc', 1000)).toBe('mno');
        expect(caesarShift('abc', -1000)).toBe('opq');
    });

    it('truncates decimal shifts before normalization', () => {
        expect(caesarShift('abc', 2.9)).toBe('cde');
        expect(caesarShift('abc', -2.9)).toBe('yza');
    });

    it('preserves case and leaves non-letters unchanged', () => {
        expect(caesarShift('Abc-XYZ 123!', 2)).toBe('Cde-ZAB 123!');
    });

    it('encrypt/decrypt round-trip with arbitrary shift', () => {
        const original = 'Hello, Caesar!';
        const encrypted = caesarEncrypt(original, 19);

        expect(encrypted).toBe('Axeeh, Vtxltk!');
        expect(caesarDecrypt(encrypted, 19)).toBe(original);
    });
});
