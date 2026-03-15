function normalizeShift(shift: number): number {
    // Normalize arbitrary shifts (including negative and >26) to 0..25.
    return ((Math.trunc(shift) % 26) + 26) % 26;
}

function shiftLowerAscii(charCode: number, normalizedShift: number): number {
    return ((charCode - 97 + normalizedShift) % 26) + 97;
}

function shiftUpperAscii(charCode: number, normalizedShift: number): number {
    return ((charCode - 65 + normalizedShift) % 26) + 65;
}

export function caesarShift(text: string, shift: number): string {
    const normalizedShift = normalizeShift(shift);
    let result = '';

    for (let i = 0; i < text.length; i++) {
        const charCode = text.charCodeAt(i);

        // lower case ASCII alphabet is 97(a) to 122(z)
        if (charCode >= 97 && charCode <= 122) {
            result += String.fromCharCode(
                shiftLowerAscii(charCode, normalizedShift)
            );
            continue;
        }
        // upper case ASCII alphabet is 65(A) to 90(Z)
        if (charCode >= 65 && charCode <= 90) {
            result += String.fromCharCode(
                shiftUpperAscii(charCode, normalizedShift)
            );
            continue;
        }

        result += text[i];
    }

    return result;
}

export function caesarEncrypt(text: string, shift: number): string {
    return caesarShift(text, shift);
}

export function caesarDecrypt(text: string, shift: number): string {
    return caesarShift(text, -shift);
}
