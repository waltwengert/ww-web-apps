const REG_INT = /^\d+$/;

export const MIN_AGE = 0;
export const MAX_AGE = 140;
export const MIN_HEIGHT = 0;
export const MAX_HEIGHT = 300;
export const MIN_WEIGHT = 0;
export const MAX_WEIGHT = 500;

export const ACTIVITY_MULTIPLIERS: Record<string, number> = {
    sedentary: 1.2,
    light: 1.375,
    moderate: 1.55,
    heavy: 1.725,
    insane: 1.9
};

export function validateStats(
    age: string,
    height: string,
    weight: string
): string | null {
    const ageNum = parseInt(age);
    const heightNum = parseInt(height);
    const weightNum = parseInt(weight);

    if (!REG_INT.test(age) || ageNum < MIN_AGE || ageNum > MAX_AGE) {
        return `Age must be a whole number between ${MIN_AGE} and ${MAX_AGE}`;
    }
    if (
        !REG_INT.test(height) ||
        heightNum < MIN_HEIGHT ||
        heightNum > MAX_HEIGHT
    ) {
        return `Height must be a whole number between ${MIN_HEIGHT} and ${MAX_HEIGHT}`;
    }
    if (
        !REG_INT.test(weight) ||
        weightNum < MIN_WEIGHT ||
        weightNum > MAX_WEIGHT
    ) {
        return `Weight must be a whole number between ${MIN_WEIGHT} and ${MAX_WEIGHT}`;
    }
    return null;
}

/**
 * Mifflin-St Jeor equation (1990).
 * Male:   BMR = 10w + 6.25h - 5a + 5
 * Female: BMR = 10w + 6.25h - 5a - 161
 * where w = weight (kg), h = height (cm), a = age (years).
 */
export function calculateBmr(
    age: number,
    height: number,
    weight: number,
    isMetric: boolean,
    isMale: boolean
): number {
    let w = weight;
    let h = height;
    if (!isMetric) {
        w = weight * 0.45359237;
        h = height * 2.54;
    }
    if (isMale) {
        return Math.round(10 * w + 6.25 * h - 5 * age + 5);
    }
    return Math.round(10 * w + 6.25 * h - 5 * age - 161);
}

/**
 * Standard BMI formula: weight (kg) / height (m)^2.
 */
export function calculateBmi(
    height: number,
    weight: number,
    isMetric: boolean
): number {
    let w = weight;
    let h = height;
    if (!isMetric) {
        w = weight * 0.45359237;
        h = height * 2.54;
    }
    const hM = h / 100;
    return Math.round((w / hM / hM) * 10) / 10;
}

/**
 * Harris-Benedict activity multipliers applied to BMR.
 */
export function calculateTdee(bmr: number, activityLevel: string): number {
    return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activityLevel] ?? 1.2));
}
