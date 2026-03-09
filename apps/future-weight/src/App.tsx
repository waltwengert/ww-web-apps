import React, { useState } from 'react';
import { BaseButton, BaseInput, BaseLabel } from '@ww-web-apps/ui';
import './style.css';

const REG_INT = /^\d+$/;

const METRIC_HEIGHT = 'cm';
const METRIC_WEIGHT = 'kg';
const IMPERIAL_HEIGHT = 'in';
const IMPERIAL_WEIGHT = 'lbs';

const MIN_AGE = 0;
const MAX_AGE = 140;
const MIN_HEIGHT = 0;
const MAX_HEIGHT = 300;
const MIN_WEIGHT = 0;
const MAX_WEIGHT = 500;

const ACTIVITY_MULTIPLIERS = new Map([
    ['sedentary', 1.2],
    ['light', 1.375],
    ['moderate', 1.55],
    ['heavy', 1.725],
    ['insane', 1.9]
]);

const App: React.FC = () => {
    const [units, setUnits] = useState<'metric' | 'imperial'>('metric');
    const [sex, setSex] = useState<'male' | 'female'>('male');
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [activity, setActivity] = useState('sedentary');
    const [bodyfat, setBodyfat] = useState('');
    const [results, setResults] = useState('');

    const changeUnits = (newUnits: 'metric' | 'imperial') => {
        setUnits(newUnits);
    };

    const updateSex = (newSex: 'male' | 'female') => {
        setSex(newSex);
    };

    const validStats = (
        age: string,
        height: string,
        weight: string
    ): boolean => {
        const ageNum = parseInt(age);
        const heightNum = parseInt(height);
        const weightNum = parseInt(weight);

        if (!REG_INT.test(age) || ageNum < MIN_AGE || ageNum > MAX_AGE) {
            alert(
                `Age must be a whole number between ${MIN_AGE} and ${MAX_AGE}`
            );
            return false;
        } else if (
            !REG_INT.test(height) ||
            heightNum < MIN_HEIGHT ||
            heightNum > MAX_HEIGHT
        ) {
            alert(
                `Height must be a whole number between ${MIN_HEIGHT} and ${MAX_HEIGHT}`
            );
            return false;
        } else if (
            !REG_INT.test(weight) ||
            weightNum < MIN_WEIGHT ||
            weightNum > MAX_WEIGHT
        ) {
            alert(
                `Weight must be a whole number between ${MIN_WEIGHT} and ${MAX_WEIGHT}`
            );
            return false;
        }
        return true;
    };

    const calculateBmr = (
        age: number,
        height: number,
        weight: number,
        bodyfat: string
    ): number => {
        let normalizedWeight = weight;
        let normalizedHeight = height;

        // Convert to metric if needed
        if (units === 'imperial') {
            normalizedWeight = weight * 0.45359237;
            normalizedHeight = height * 2.54;
        }

        if (sex === 'male') {
            return Math.round(
                10 * normalizedWeight + 6.25 * normalizedHeight - 5 * age + 5
            );
        } else {
            return Math.round(
                10 * normalizedWeight + 6.25 * normalizedHeight - 5 * age - 161
            );
        }
    };

    const calculateBmi = (height: number, weight: number): number => {
        let normalizedWeight = weight;
        let normalizedHeight = height;

        // Convert to metric if needed
        if (units === 'imperial') {
            normalizedWeight = weight * 0.45359237;
            normalizedHeight = height * 2.54;
        }

        const heightM = normalizedHeight / 100;
        return Math.round((normalizedWeight / heightM / heightM) * 10) / 10;
    };

    const calculateTdee = () => {
        if (!validStats(age, height, weight)) {
            return;
        }

        const ageNum = parseInt(age);
        const heightNum = parseInt(height);
        const weightNum = parseInt(weight);

        const bmr = calculateBmr(ageNum, heightNum, weightNum, bodyfat);
        const tdee = Math.round(bmr * ACTIVITY_MULTIPLIERS.get(activity)!);
        const bmi = calculateBmi(heightNum, weightNum);

        setResults(
            `Your BMR is ${bmr}\nYour TDEE is ${tdee}\nYour BMI is ${bmi}`
        );
    };

    return (
        <div>
            <h1>Future Weight</h1>

            <div id="tdee">
                <div>
                    <h2>
                        Enter your information to calculate your maintenance:
                    </h2>
                </div>

                <div>
                    <label>
                        <input
                            type="radio"
                            name="units"
                            checked={units === 'metric'}
                            onChange={() => changeUnits('metric')}
                        />
                        Metric
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="units"
                            checked={units === 'imperial'}
                            onChange={() => changeUnits('imperial')}
                        />
                        Imperial
                    </label>
                </div>

                <div>
                    <BaseLabel>Age</BaseLabel>
                    <BaseInput
                        type="text"
                        value={age}
                        onChange={e => setAge(e.target.value)}
                    />
                </div>

                <div>
                    <BaseLabel>Sex</BaseLabel>

                    <label>
                        <input
                            type="radio"
                            name="sex"
                            checked={sex === 'male'}
                            onChange={() => updateSex('male')}
                        />
                        Male
                    </label>

                    <label>
                        <input
                            type="radio"
                            name="sex"
                            checked={sex === 'female'}
                            onChange={() => updateSex('female')}
                        />
                        Female
                    </label>
                </div>

                <div>
                    <BaseLabel>Height</BaseLabel>
                    <BaseInput
                        type="text"
                        value={height}
                        onChange={e => setHeight(e.target.value)}
                    />
                    <span>
                        {units === 'metric' ? METRIC_HEIGHT : IMPERIAL_HEIGHT}
                    </span>
                </div>

                <div>
                    <BaseLabel>Weight</BaseLabel>
                    <BaseInput
                        type="text"
                        value={weight}
                        onChange={e => setWeight(e.target.value)}
                    />
                    <span>
                        {units === 'metric' ? METRIC_WEIGHT : IMPERIAL_WEIGHT}
                    </span>
                </div>

                <div>
                    <BaseLabel>Activity Level</BaseLabel>
                    <select
                        value={activity}
                        onChange={e => setActivity(e.target.value)}
                    >
                        <option value="sedentary">
                            Sedentary (little or no exercise)
                        </option>
                        <option value="light">
                            Lightly active (light exercise 1-3 days/week)
                        </option>
                        <option value="moderate">
                            Moderately active (moderate exercise 3-5 days/week)
                        </option>
                        <option value="heavy">
                            Very active (hard exercise 6-7 days/week)
                        </option>
                        <option value="insane">
                            Extremely active (very hard exercise, physical job,
                            or 2x training)
                        </option>
                    </select>
                </div>

                <div>
                    <BaseLabel>Body Fat % (optional)</BaseLabel>
                    <BaseInput
                        type="text"
                        value={bodyfat}
                        onChange={e => setBodyfat(e.target.value)}
                        placeholder="Leave blank if unknown"
                    />
                </div>

                <div>
                    <BaseButton onClick={calculateTdee}>Calculate</BaseButton>
                </div>

                <div id="results">
                    <h3>Results:</h3>
                    <p>{results}</p>
                </div>
            </div>
        </div>
    );
};

export default App;
