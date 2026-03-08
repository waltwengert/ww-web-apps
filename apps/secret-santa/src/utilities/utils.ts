import { CIPHER_KEY } from './consts';

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

/**
 * Takes a string and encrypts it using a Caesar cipher (letters only).
 * @param stringToEncrypt String to encrypt.
 * @returns Encrypted string.
 */
export function encrypt(stringToEncrypt: string): string {
    stringToEncrypt = stringToEncrypt.trim().toLowerCase();
    let encryptedString = '';

    for (let i = 0; i < stringToEncrypt.length; i++) {
        let charCode = stringToEncrypt.charCodeAt(i);

        // lower case ASCII alphabet is 97(a) to 122(z)
        if (charCode >= 97 && charCode <= 122) {
            if (charCode + CIPHER_KEY > 122) {
                // wrap
                charCode += CIPHER_KEY - 26;
            } else {
                charCode += CIPHER_KEY;
            }
        }

        encryptedString += String.fromCharCode(charCode);
    }

    return encryptedString;
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
    stringToDecrypt = stringToDecrypt.trim().toLowerCase();
    let decryptedString = '';

    for (let i = 0; i < stringToDecrypt.length; i++) {
        let charCode = stringToDecrypt.charCodeAt(i);

        // lower case ASCII alphabet is 97(a) to 122(z)
        if (charCode >= 97 && charCode <= 122) {
            if (charCode - CIPHER_KEY < 97) {
                // wrap
                charCode -= CIPHER_KEY - 26;
            } else {
                charCode -= CIPHER_KEY;
            }
        }

        decryptedString += String.fromCharCode(charCode);
    }

    return decryptedString;
}

/**
 * Takes an array of strings and decrypts them.
 * @param arrayToDecrypt Array to decrypt.
 * @returns Decrypted array.
 */
export function decryptStringArray(arrayToDecrypt: string[]): string[] {
    return arrayToDecrypt.map(stringToDecrypt => decrypt(stringToDecrypt));
}
