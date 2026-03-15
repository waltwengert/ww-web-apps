import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    decrypt,
    decryptStringArray,
    encrypt,
    encryptStringArray,
    shuffle
} from './secretSanta';

describe('encrypt/decrypt', () => {
    it('encrypts and decrypts with case normalization and trimming', () => {
        const original = '  Alex Volkanovski  ';
        const encrypted = encrypt(original);

        expect(encrypted).toBe('nyrk ibyxnabifxv');
        expect(decrypt(encrypted)).toBe('alex volkanovski');
    });

    it('wraps alphabet edges correctly for encrypt/decrypt', () => {
        expect(encrypt('xyz')).toBe('klm');
        expect(decrypt('abc')).toBe('nop');
    });

    it('leaves non-letter characters unchanged', () => {
        expect(encrypt('a-z 123!')).toBe('n-m 123!');
        expect(decrypt('n-m 123!')).toBe('a-z 123!');
    });

    it('encrypts and decrypts string arrays', () => {
        const names = ['alex', 'charles', 'robocop'];
        const encrypted = encryptStringArray(names);

        expect(encrypted).toEqual(['nyrk', 'puneyrf', 'ebobpbc']);
        expect(decryptStringArray(encrypted)).toEqual(names);
    });
});

describe('shuffle', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('returns original array for length <= 1', () => {
        const one = ['only'];
        const empty: string[] = [];

        expect(shuffle(one)).toBe(one);
        expect(shuffle(empty)).toBe(empty);
    });

    it('shuffles in place and produces a derangement for length > 1', () => {
        vi.spyOn(Math, 'random').mockReturnValue(0);

        const original = [1, 2, 3, 4];
        const copy = [...original];
        const result = shuffle(copy);

        expect(result).toBe(copy);
        expect(result).not.toEqual(original);

        result.forEach((value, idx) => {
            expect(value).not.toBe(original[idx]);
        });
    });
});
