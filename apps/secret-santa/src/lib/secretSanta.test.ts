import { afterEach, describe, expect, it, vi } from 'vitest';

import {
    decrypt,
    decryptStringArray,
    encrypt,
    encryptStringArray,
    shuffle,
    shuffleWithPartnerRestrictions
} from './secretSanta';

describe('secretSanta', () => {
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

    describe('shuffleWithPartnerRestrictions', () => {
        it('assigns everyone once while excluding themselves and their partner', () => {
            const participantIds = ['alex', 'robert', 'charles', 'robocop'];
            const partnerPairs = [
                {
                    id: 'pair-1',
                    firstParticipantId: 'alex',
                    secondParticipantId: 'robert'
                },
                {
                    id: 'pair-2',
                    firstParticipantId: 'charles',
                    secondParticipantId: 'robocop'
                }
            ];

            const assignments = shuffleWithPartnerRestrictions(
                participantIds,
                partnerPairs,
                () => 0.5
            );

            expect(assignments).not.toBeNull();
            expect(new Set(assignments).size).toBe(participantIds.length);
            const partnerByParticipant = new Map<string, string>();
            partnerPairs.forEach(pair => {
                partnerByParticipant.set(
                    pair.firstParticipantId,
                    pair.secondParticipantId
                );
                partnerByParticipant.set(
                    pair.secondParticipantId,
                    pair.firstParticipantId
                );
            });
            assignments?.forEach((recipientId, index) => {
                expect(recipientId).not.toBe(participantIds[index]);
                expect(recipientId).not.toBe(
                    partnerByParticipant.get(participantIds[index])
                );
            });
        });

        it('returns no assignment when a partner pair leaves too few recipients', () => {
            const assignments = shuffleWithPartnerRestrictions(
                ['alex', 'robert', 'charles'],
                [
                    {
                        id: 'pair-1',
                        firstParticipantId: 'alex',
                        secondParticipantId: 'robert'
                    }
                ],
                () => 0.5
            );

            expect(assignments).toBeNull();
        });
    });
});
