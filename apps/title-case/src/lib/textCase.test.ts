import { describe, expect, it } from 'vitest';

import {
    convertTextCase,
    toLowerCaseAscii,
    toSentenceCase,
    toTitleCase,
    toUpperCaseAscii
} from './textCase';

describe('textCase', () => {
    describe('toTitleCase', () => {
        it('converts to title case', () => {
            expect(toTitleCase('hello world. this IS some tExT!')).toBe(
                'Hello World. This Is Some Text!'
            );
        });
    });

    describe('toSentenceCase', () => {
        it('converts to sentence case across sentence boundaries', () => {
            expect(toSentenceCase('hello world. this IS some tExT!')).toBe(
                'Hello world. This is some text!'
            );
        });
    });

    describe('toUpperCaseAscii and toLowerCaseAscii', () => {
        it('converts to upper and lower ascii', () => {
            expect(toUpperCaseAscii('Hello world!')).toBe('HELLO WORLD!');
            expect(toLowerCaseAscii('Hello WORLD!')).toBe('hello world!');
        });
    });

    describe('convertTextCase', () => {
        it('converts through convertTextCase', () => {
            expect(convertTextCase('hello world', 'title')).toBe('Hello World');
            expect(convertTextCase('hello world', 'sentence')).toBe(
                'Hello world'
            );
            expect(convertTextCase('hello world', 'upper')).toBe('HELLO WORLD');
            expect(convertTextCase('HELLO WORLD', 'lower')).toBe('hello world');
        });

        it('supports Caesar encode/decode with arbitrary shifts', () => {
            expect(convertTextCase('abc xyz', 'caesar-encode', 13)).toBe(
                'nop klm'
            );
            expect(convertTextCase('nop klm', 'caesar-decode', 13)).toBe(
                'abc xyz'
            );

            expect(convertTextCase('abc', 'caesar-encode', 29)).toBe('def');
            expect(convertTextCase('abc', 'caesar-encode', -1)).toBe('zab');
        });
    });
});
