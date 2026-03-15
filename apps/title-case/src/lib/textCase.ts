function isLowerAlpha(charCode: number): boolean {
    return charCode >= 97 && charCode <= 122;
}

function isUpperAlpha(charCode: number): boolean {
    return charCode >= 65 && charCode <= 90;
}

function isAsciiAlpha(charCode: number): boolean {
    return isLowerAlpha(charCode) || isUpperAlpha(charCode);
}

function toUpperAscii(charCode: number): number {
    return isLowerAlpha(charCode) ? charCode - 32 : charCode;
}

function toLowerAscii(charCode: number): number {
    return isUpperAlpha(charCode) ? charCode + 32 : charCode;
}

export function toTitleCase(sentence: string): string {
    let result = '';
    let startOfWord = true;

    for (let i = 0; i < sentence.length; i++) {
        let charCode = sentence.charCodeAt(i);

        if (isAsciiAlpha(charCode)) {
            charCode = startOfWord
                ? toUpperAscii(charCode)
                : toLowerAscii(charCode);
            startOfWord = false;
        } else {
            startOfWord = true;
        }

        result += String.fromCharCode(charCode);
    }

    return result;
}

export function toSentenceCase(sentence: string): string {
    let result = '';
    let startOfSentence = true;

    for (let i = 0; i < sentence.length; i++) {
        let charCode = sentence.charCodeAt(i);

        if (isAsciiAlpha(charCode)) {
            charCode = startOfSentence
                ? toUpperAscii(charCode)
                : toLowerAscii(charCode);
            startOfSentence = false;
        }

        const char = String.fromCharCode(charCode);
        if (char === '.' || char === '!' || char === '?') {
            startOfSentence = true;
        }

        result += char;
    }

    return result;
}

export function toUpperCaseAscii(sentence: string): string {
    let result = '';

    for (let i = 0; i < sentence.length; i++) {
        const charCode = sentence.charCodeAt(i);
        result += String.fromCharCode(toUpperAscii(charCode));
    }

    return result;
}

export function toLowerCaseAscii(sentence: string): string {
    let result = '';

    for (let i = 0; i < sentence.length; i++) {
        const charCode = sentence.charCodeAt(i);
        result += String.fromCharCode(toLowerAscii(charCode));
    }

    return result;
}

export function convertTextCase(sentence: string, type: string): string {
    switch (type) {
        case 'title':
            return toTitleCase(sentence);
        case 'sentence':
            return toSentenceCase(sentence);
        case 'upper':
            return toUpperCaseAscii(sentence);
        case 'lower':
            return toLowerCaseAscii(sentence);
        default:
            return toTitleCase(sentence);
    }
}
