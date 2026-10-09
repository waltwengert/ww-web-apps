import { caesarDecrypt, caesarEncrypt } from '@ww-web-apps/utils';

const CIPHER_KEY = 13;

export const ENCRYPTED_LENGTH = 12;

/**
 * Takes a string and encrypts it using a Caesar cipher (letters only).
 * @param stringToEncrypt String to encrypt.
 * @returns Encrypted string.
 */
export function encrypt(stringToEncrypt: string): string {
    return caesarEncrypt(stringToEncrypt.trim().toLowerCase(), CIPHER_KEY);
}

/**
 * Takes an array of strings and encrypts them (simple Caesar shift per string).
 * @param arrayToEncrypt Array to encrypt.
 * @returns Encrypted array.
 */
export function encryptStringArray(arrayToEncrypt: string[]): string[] {
    return arrayToEncrypt.map(stringToEncrypt => encrypt(stringToEncrypt));
}

/**
 * Takes an encrypted string and decrypts it using the Caesar shift.
 * @param stringToDecrypt Encrypted string to decrypt.
 * @returns Decrypted string.
 */
export function decrypt(stringToDecrypt: string): string {
    return caesarDecrypt(stringToDecrypt.trim().toLowerCase(), CIPHER_KEY);
}

/**
 * Takes an array of strings and decrypts them.
 * @param arrayToDecrypt Array to decrypt.
 * @returns Decrypted array.
 */
export function decryptStringArray(arrayToDecrypt: string[]): string[] {
    return arrayToDecrypt.map(stringToDecrypt => decrypt(stringToDecrypt));
}

/**
 * Takes an array and shuffles it.
 * @param array Array to be shuffled.
 * @returns Shuffled array.
 */
export function shuffle<T>(array: T[]): T[] {
    const n = array.length;
    if (n <= 1) return array;

    // Sattolo's algorithm produces a single cycle permutation (derangement)
    // which guarantees no element remains in its original position for n > 1.
    for (let i = n - 1; i > 0; i--) {
        // pick j such that 0 <= j <= i-1
        const j = Math.floor(Math.random() * i);
        [array[i], array[j]] = [array[j], array[i]];
    }

    return array;
}

export interface Participant {
    id: string;
    name: string;
}

export interface PartnerPair {
    id: string;
    firstParticipantId: string;
    secondParticipantId: string;
}

/**
 * Takes an array of participant IDs and shuffles them while ensuring that no participant is assigned to their partner.
 * @param participantIds Array of participant IDs to be shuffled.
 * @param partnerPairs Array of partner pairs.
 * @param random Function to generate a random number.
 * @returns Shuffled array of participant IDs or null if impossible.
 */
export function shuffleWithPartnerRestrictions(
    participantIds: string[],
    partnerPairs: PartnerPair[],
    random: () => number = Math.random
): string[] | null {
    const participantIndexes = new Map(
        participantIds.map((participantId, index) => [participantId, index])
    );
    if (participantIndexes.size !== participantIds.length) return null;
    if (participantIds.length === 0) return [];

    const partnerByParticipant = new Map<string, string>();
    for (const pair of partnerPairs) {
        const { firstParticipantId, secondParticipantId } = pair;
        if (
            firstParticipantId === secondParticipantId ||
            !participantIndexes.has(firstParticipantId) ||
            !participantIndexes.has(secondParticipantId) ||
            partnerByParticipant.has(firstParticipantId) ||
            partnerByParticipant.has(secondParticipantId)
        ) {
            return null;
        }
        partnerByParticipant.set(firstParticipantId, secondParticipantId);
        partnerByParticipant.set(secondParticipantId, firstParticipantId);
    }

    const recipientsByGiver = participantIds.map((giverId, giverIndex) =>
        randomizedOrder(
            participantIds
                .map((recipientId, recipientIndex) => ({
                    recipientId,
                    recipientIndex
                }))
                .filter(
                    ({ recipientId, recipientIndex }) =>
                        recipientIndex !== giverIndex &&
                        partnerByParticipant.get(giverId) !== recipientId
                )
                .map(({ recipientIndex }) => recipientIndex),
            random
        )
    );
    const giverOrder = randomizedOrder(
        participantIds.map((_, index) => index),
        random
    );
    const giverByRecipient = Array<number>(participantIds.length).fill(-1);

    const assignRecipient = (
        giverIndex: number,
        visitedRecipients: Set<number>
    ): boolean => {
        for (const recipientIndex of recipientsByGiver[giverIndex]) {
            if (visitedRecipients.has(recipientIndex)) continue;
            visitedRecipients.add(recipientIndex);

            const previousGiver = giverByRecipient[recipientIndex];
            if (
                previousGiver === -1 ||
                assignRecipient(previousGiver, visitedRecipients)
            ) {
                giverByRecipient[recipientIndex] = giverIndex;
                return true;
            }
        }
        return false;
    };

    for (const giverIndex of giverOrder) {
        if (!assignRecipient(giverIndex, new Set<number>())) return null;
    }

    const recipientByGiver = Array<number>(participantIds.length).fill(-1);
    giverByRecipient.forEach((giverIndex, recipientIndex) => {
        recipientByGiver[giverIndex] = recipientIndex;
    });

    if (recipientByGiver.some(recipientIndex => recipientIndex === -1)) {
        return null;
    }
    return recipientByGiver.map(
        recipientIndex => participantIds[recipientIndex]
    );
}

/**
 * Helper function to randomize the order of an array using the Fisher-Yates shuffle algorithm.
 */
function randomizedOrder<T>(array: T[], random: () => number): T[] {
    for (let index = array.length - 1; index > 0; index--) {
        const swapIndex = Math.floor(random() * (index + 1));
        [array[index], array[swapIndex]] = [array[swapIndex], array[index]];
    }
    return array;
}
