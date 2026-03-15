import React, { useEffect, useState } from 'react';
import styled from 'styled-components';

import { FutureWeight, Input, Select } from '@ww-web-apps/ui';

import {
    calculateBmi,
    calculateBmr,
    calculateTdee,
    validateStats
} from './lib/futureWeight';

import './style.css';

// ── Layout ────────────────────────────────────────────────────────────────────

const Page = styled.main`
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 24px;
`;

const Card = styled.section`
    width: min(680px, 92vw);
    background: ${FutureWeight.CardBackground};
    border: 1px solid ${FutureWeight.CardBorder};
    border-radius: 20px;
    box-shadow: 0 20px 40px ${FutureWeight.CardShadow};
    padding: 28px 24px;
`;

const Heading = styled.h1`
    margin: 0;
    text-align: center;
    color: ${FutureWeight.Heading};
    font-size: clamp(2rem, 4.4vw, 2.9rem);
    letter-spacing: 0.02em;
`;

const Subheading = styled.p`
    margin: 10px 0 24px;
    text-align: center;
    color: ${FutureWeight.Muted};
    font-size: 1.02rem;
`;

// ── Form ──────────────────────────────────────────────────────────────────────

const FormStack = styled.div`
    width: min(520px, 100%);
    margin: 0 auto;
    display: grid;
    gap: 14px;
`;

const FormRow = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const FieldLabel = styled.span`
    width: 110px;
    flex-shrink: 0;
    font-size: 15px;
    color: ${FutureWeight.Muted};
    font-weight: 500;
`;

const UnitTag = styled.span`
    font-size: 14px;
    color: ${FutureWeight.Muted};
    min-width: 28px;
`;

const FutureWeightInput = styled(Input)`
    flex: 1;
    width: auto;
    margin: 0;
    font-size: 16px;
    border: 1px solid ${FutureWeight.CardBorder};
    border-radius: 12px;
    color: ${FutureWeight.Text};
    background: ${FutureWeight.White};

    &:focus {
        outline: 2px solid ${FutureWeight.Accent};
        outline-offset: 1px;
    }
`;

const ActivitySelect = styled(Select)`
    flex: 1;
    width: auto;
    margin: 0;
    font-size: 15px;
    border-color: ${FutureWeight.CardBorder};
    color: ${FutureWeight.Text};
    background-color: ${FutureWeight.White};
`;

// ── Segmented toggle ──────────────────────────────────────────────────────────

const ToggleGroup = styled.div`
    display: flex;
    flex: 1;
    background: ${FutureWeight.AccentSoft};
    border-radius: 12px;
    padding: 3px;
    gap: 3px;
`;

const ToggleOption = styled.button<{ $active?: boolean }>`
    flex: 1;
    padding: 7px 14px;
    border: none;
    border-radius: 10px;
    font-size: 15px;
    cursor: pointer;
    transition:
        background 0.15s,
        color 0.15s;
    background: ${({ $active }): string =>
        $active ? FutureWeight.Accent : 'transparent'};
    color: ${({ $active }): string =>
        $active ? FutureWeight.White : FutureWeight.Muted};
    font-weight: ${({ $active }): string => ($active ? '600' : '400')};
`;

// ── Feedback & action ─────────────────────────────────────────────────────────

const ErrorText = styled.p`
    color: ${FutureWeight.Error};
    font-size: 14px;
    text-align: center;
    margin: 0;
`;

const CalculateButton = styled.button`
    width: 100%;
    padding: 12px;
    background: ${FutureWeight.Accent};
    color: ${FutureWeight.White};
    border: none;
    border-radius: 12px;
    font-size: 17px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.15s;

    &:hover {
        background: ${FutureWeight.Heading};
    }
`;

// ── Results ───────────────────────────────────────────────────────────────────

const ResultsGrid = styled.div`
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 12px;

    @media (max-width: 480px) {
        grid-template-columns: 1fr;
    }
`;

const ResultCard = styled.div`
    background: ${FutureWeight.AccentSoft};
    border: 1px solid ${FutureWeight.CardBorder};
    border-radius: 14px;
    padding: 16px 12px;
    text-align: center;
`;

const ResultValue = styled.div`
    font-size: 1.9rem;
    font-weight: 700;
    color: ${FutureWeight.Heading};
`;

const ResultLabel = styled.div`
    font-size: 0.82rem;
    color: ${FutureWeight.Muted};
    margin-top: 4px;
    text-transform: uppercase;
    letter-spacing: 0.06em;
`;

// ── Component ─────────────────────────────────────────────────────────────────

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
