import React, { useEffect, useState } from 'react';

import {
    ActivitySelect,
    CalculateButton,
    Card,
    ErrorText,
    FieldLabel,
    FormRow,
    FormStack,
    FutureWeightInput,
    Heading,
    Page,
    ResultCard,
    ResultLabel,
    ResultsGrid,
    ResultValue,
    Subheading,
    ToggleGroup,
    ToggleOption,
    UnitTag
} from './FutureWeightApp.styles';
import {
    calculateBmi,
    calculateBmr,
    calculateTdee,
    validateStats
} from './lib/futureWeight';

import './style.css';

type Results = { bmr: number; tdee: number; bmi: number };

const App: React.FC = () => {
    const [isMetric, setIsMetric] = useState(true);
    const [isMale, setIsMale] = useState(true);
    const [age, setAge] = useState('');
    const [height, setHeight] = useState('');
    const [weight, setWeight] = useState('');
    const [activity, setActivity] = useState('sedentary');
    const [bodyfat, setBodyfat] = useState('');
    const [error, setError] = useState<string | null>(null);
    const [results, setResults] = useState<Results | null>(null);

    const compute = (): Results | null => {
        if (validateStats(age, height, weight) !== null) return null;
        const ageNum = parseInt(age);
        const heightNum = parseInt(height);
        const weightNum = parseInt(weight);
        const bmr = calculateBmr(
            ageNum,
            heightNum,
            weightNum,
            isMetric,
            isMale
        );
        const tdee = calculateTdee(bmr, activity);
        const bmi = calculateBmi(heightNum, weightNum, isMetric);
        return { bmr, tdee, bmi };
    };

    // After first successful calculation, auto-update whenever any input changes.
    useEffect(() => {
        if (results === null) return;
        const updated = compute();
        if (updated !== null) {
            setError(null);
            setResults(updated);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [age, height, weight, activity, isMetric, isMale]);

    const handleCalculate = (): void => {
        const validationError = validateStats(age, height, weight);
        if (validationError) {
            setError(validationError);
            setResults(null);
            return;
        }
        setError(null);
        setResults(compute());
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') handleCalculate();
    };

    const heightUnit = isMetric ? 'cm' : 'in';
    const weightUnit = isMetric ? 'kg' : 'lbs';

    return (
        <Page>
            <Card>
                <Heading>Future Weight</Heading>
                <Subheading>
                    Calculate your BMR, TDEE, and BMI based on your stats.
                </Subheading>

                <FormStack>
                    <FormRow>
                        <FieldLabel>Units</FieldLabel>
                        <ToggleGroup>
                            <ToggleOption
                                $active={isMetric}
                                onClick={() => setIsMetric(true)}
                            >
                                Metric
                            </ToggleOption>
                            <ToggleOption
                                $active={!isMetric}
                                onClick={() => setIsMetric(false)}
                            >
                                Imperial
                            </ToggleOption>
                        </ToggleGroup>
                        <UnitTag />
                    </FormRow>

                    <FormRow>
                        <FieldLabel>Sex</FieldLabel>
                        <ToggleGroup>
                            <ToggleOption
                                $active={isMale}
                                onClick={() => setIsMale(true)}
                            >
                                Male
                            </ToggleOption>
                            <ToggleOption
                                $active={!isMale}
                                onClick={() => setIsMale(false)}
                            >
                                Female
                            </ToggleOption>
                        </ToggleGroup>
                        <UnitTag />
                    </FormRow>

                    <FormRow>
                        <FieldLabel>Age</FieldLabel>
                        <FutureWeightInput
                            aria-label="Age"
                            type="text"
                            value={age}
                            onChange={e => setAge(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="e.g. 30"
                        />
                        <UnitTag>yrs</UnitTag>
                    </FormRow>

                    <FormRow>
                        <FieldLabel>Height</FieldLabel>
                        <FutureWeightInput
                            aria-label="Height"
                            type="text"
                            value={height}
                            onChange={e => setHeight(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isMetric ? 'e.g. 175' : 'e.g. 69'}
                        />
                        <UnitTag>{heightUnit}</UnitTag>
                    </FormRow>

                    <FormRow>
                        <FieldLabel>Weight</FieldLabel>
                        <FutureWeightInput
                            aria-label="Weight"
                            type="text"
                            value={weight}
                            onChange={e => setWeight(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder={isMetric ? 'e.g. 75' : 'e.g. 165'}
                        />
                        <UnitTag>{weightUnit}</UnitTag>
                    </FormRow>

                    <FormRow>
                        <FieldLabel>Activity</FieldLabel>
                        <ActivitySelect
                            aria-label="Activity"
                            value={activity}
                            onChange={e => setActivity(e.target.value)}
                        >
                            <option value="sedentary">
                                Sedentary (little or no exercise)
                            </option>
                            <option value="light">
                                Lightly active (1–3 days/week)
                            </option>
                            <option value="moderate">
                                Moderately active (3–5 days/week)
                            </option>
                            <option value="heavy">
                                Very active (6–7 days/week)
                            </option>
                            <option value="insane">
                                Extremely active (physical job or 2x training)
                            </option>
                        </ActivitySelect>
                        <UnitTag />
                    </FormRow>

                    <FormRow>
                        <FieldLabel>Body fat %</FieldLabel>
                        <FutureWeightInput
                            aria-label="Body fat percentage"
                            type="text"
                            value={bodyfat}
                            onChange={e => setBodyfat(e.target.value)}
                            onKeyDown={handleKeyDown}
                            placeholder="optional"
                        />
                        <UnitTag>%</UnitTag>
                    </FormRow>

                    {error && <ErrorText>{error}</ErrorText>}

                    <CalculateButton onClick={handleCalculate}>
                        Calculate
                    </CalculateButton>

                    {results && (
                        <ResultsGrid>
                            <ResultCard>
                                <ResultValue>{results.bmr}</ResultValue>
                                <ResultLabel>BMR (kcal/day)</ResultLabel>
                            </ResultCard>
                            <ResultCard>
                                <ResultValue>{results.tdee}</ResultValue>
                                <ResultLabel>TDEE (kcal/day)</ResultLabel>
                            </ResultCard>
                            <ResultCard>
                                <ResultValue>{results.bmi}</ResultValue>
                                <ResultLabel>BMI</ResultLabel>
                            </ResultCard>
                        </ResultsGrid>
                    )}
                </FormStack>
            </Card>
        </Page>
    );
};

export default App;
