import React, { useEffect, useState } from 'react';

import {
    ActionButton,
    AppShell,
    ErrorMessage,
    FieldLabel,
    FieldRow,
    FighterSelect,
    Heading,
    SectionCard,
    Table,
    TableCell,
    TableHeaderCell,
    TableScroll
} from './FightPredictorApp.styles';

interface Fighter {
    fighter_id: number;
    name: string;
    total_wins?: number;
    total_losses?: number;
}

interface PredictionResult {
    red_win_probability: number;
    blue_win_probability: number;
    favorite: 'red' | 'blue' | 'draw';
}

const apiBase = import.meta.env.VITE_API_BASE;

const FightPredictorApp = (): React.ReactElement => {
    const [fighters, setFighters] = useState<Fighter[]>([]);
    const [redId, setRedId] = useState<number | undefined>(undefined);
    const [blueId, setBlueId] = useState<number | undefined>(undefined);
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        fetch(`${apiBase}/fighters`)
            .then(res => res.json())
            .then(setFighters)
            .catch(() => setError('Could not load fighters from backend'));
    }, []);

    const predict = async (): Promise<void> => {
        setError(null);
        setResult(null);

        if (!redId || !blueId) {
            setError('Select both a red and blue fighter.');
            return;
        }

        setLoading(true);
        try {
            const response = await fetch(`${apiBase}/predict`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    red_fighter_id: redId,
                    blue_fighter_id: blueId
                })
            });

            if (!response.ok) {
                throw new Error('Prediction request failed');
            }

            setResult(await response.json());
        } catch (err) {
            setError((err as Error).message || 'Prediction failed');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AppShell>
            <Heading>Fight Predictor</Heading>

            <SectionCard>
                <h2>Matchup</h2>
                <FieldRow>
                    <FieldLabel>
                        Red fighter
                        <FighterSelect
                            value={redId ?? ''}
                            onChange={event =>
                                setRedId(
                                    Number(event.target.value) || undefined
                                )
                            }
                        >
                            <option value="">Select a fighter</option>
                            {fighters.map(fighter => (
                                <option
                                    key={fighter.fighter_id}
                                    value={fighter.fighter_id}
                                >
                                    {fighter.name}
                                </option>
                            ))}
                        </FighterSelect>
                    </FieldLabel>

                    <FieldLabel>
                        Blue fighter
                        <FighterSelect
                            value={blueId ?? ''}
                            onChange={event =>
                                setBlueId(
                                    Number(event.target.value) || undefined
                                )
                            }
                        >
                            <option value="">Select a fighter</option>
                            {fighters.map(fighter => (
                                <option
                                    key={fighter.fighter_id}
                                    value={fighter.fighter_id}
                                >
                                    {fighter.name}
                                </option>
                            ))}
                        </FighterSelect>
                    </FieldLabel>
                </FieldRow>

                <ActionButton onClick={predict} disabled={loading}>
                    {loading ? 'Predicting…' : 'Predict winner'}
                </ActionButton>
            </SectionCard>

            {error ? <ErrorMessage>{error}</ErrorMessage> : null}

            {result ? (
                <SectionCard>
                    <h2>Prediction</h2>
                    <p>
                        Red win probability:{' '}
                        <strong>
                            {(result.red_win_probability * 100).toFixed(0)}%
                        </strong>
                    </p>
                    <p>
                        Blue win probability:{' '}
                        <strong>
                            {(result.blue_win_probability * 100).toFixed(0)}%
                        </strong>
                    </p>
                    <p>
                        Favorite: <strong>{result.favorite}</strong>
                    </p>
                </SectionCard>
            ) : null}

            <SectionCard>
                <h2>Fighters</h2>
                <TableScroll>
                    <Table>
                        <thead>
                            <tr>
                                <TableHeaderCell>Name</TableHeaderCell>
                                <TableHeaderCell>Wins</TableHeaderCell>
                                <TableHeaderCell>Losses</TableHeaderCell>
                            </tr>
                        </thead>
                        <tbody>
                            {fighters.map(fighter => (
                                <tr key={fighter.fighter_id}>
                                    <TableCell>{fighter.name}</TableCell>
                                    <TableCell>
                                        {fighter.total_wins ?? '-'}
                                    </TableCell>
                                    <TableCell>
                                        {fighter.total_losses ?? '-'}
                                    </TableCell>
                                </tr>
                            ))}
                        </tbody>
                    </Table>
                </TableScroll>
            </SectionCard>
        </AppShell>
    );
};

export default FightPredictorApp;
