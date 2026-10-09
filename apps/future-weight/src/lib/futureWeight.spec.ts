import { describe, expect, it } from 'vitest';

import {
    calculateBmi,
    calculateBmr,
    calculateTdee,
    validateStats
} from './futureWeight';

describe('validateStats', () => {
    it('returns null for valid inputs', () => {
        expect(validateStats('30', '180', '80')).toBeNull();
    });

    it('rejects age above max', () => {
        expect(validateStats('141', '180', '80')).toMatch(/Age must be/);
    });

    it('rejects non-integer age', () => {
        expect(validateStats('30.5', '180', '80')).toMatch(/Age must be/);
    });

    it('rejects height out of range', () => {
        expect(validateStats('30', '301', '80')).toMatch(/Height must be/);
    });

    it('rejects weight out of range', () => {
        expect(validateStats('30', '180', '501')).toMatch(/Weight must be/);
    });
});

describe('calculateBmr', () => {
    it('calculates male metric BMR', () => {
        expect(calculateBmr(30, 180, 80, true, true)).toBe(1780);
    });

    it('calculates female metric BMR', () => {
        expect(calculateBmr(30, 180, 80, true, false)).toBe(1614);
    });

    it('converts imperial inputs before calculating', () => {
        // 71in ~= 180.3cm, 176lbs ~= 79.8kg -> result should be close to metric.
        const bmr = calculateBmr(30, 71, 176, false, true);
        expect(bmr).toBeGreaterThan(1750);
        expect(bmr).toBeLessThan(1820);
    });
});

describe('calculateBmi', () => {
    it('calculates metric BMI', () => {
        expect(calculateBmi(180, 80, true)).toBe(24.7);
    });

    it('converts imperial inputs before calculating', () => {
        const bmi = calculateBmi(71, 176, false);
        expect(bmi).toBeGreaterThan(24);
        expect(bmi).toBeLessThan(26);
    });
});

describe('calculateTdee', () => {
    it('calculates sedentary TDEE', () => {
        expect(calculateTdee(1780, 'sedentary')).toBe(2136);
    });

    it('calculates moderate TDEE', () => {
        expect(calculateTdee(1780, 'moderate')).toBe(2759);
    });

    it('falls back to sedentary multiplier for unknown activity', () => {
        expect(calculateTdee(1000, 'unknown')).toBe(1200);
    });
});
