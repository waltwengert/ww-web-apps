import React, { useEffect, useMemo, useState } from 'react';

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
    height_cm?: number;
    reach_cm?: number;
    strike_accuracy?: number;
    strike_defence?: number;
    td_accuracy?: number;
    td_defence?: number;
    strikes_landed_per_minute?: number;
    strikes_absorbed_per_minute?: number;
    takedown_average?: number;
    submission_average?: number;
    current_ufc_win_streak?: number;
    last_seen_fight?: string;
}

interface Card {
    card_id: number;
    name: string;
    event_date?: string;
    location?: string;
}

interface Fight {
    fight_id: number;
    card_id: number;
    fight_date?: string;
    fight_weight_class?: string;
    weight_class_pounds?: number;
    fight_rounds?: number;
    is_main_event?: number;
    is_title_fight?: number;
    result_method?: string;
    result_method_type?: string;
    result_round?: string;
    red_fighter_id: number;
    blue_fighter_id: number;
    winner_id?: number;
}

interface PredictionResult {
    red_win_probability: number;
    blue_win_probability: number;
    favorite: 'red' | 'blue' | 'draw';
}

const apiBase = import.meta.env.VITE_API_BASE;

const FightPredictorApp = (): React.ReactElement => {
    const [fighters, setFighters] = useState<Fighter[]>([]);
    const [cards, setCards] = useState<Card[]>([]);
    const [fights, setFights] = useState<Fight[]>([]);
    const [selectedCardId, setSelectedCardId] = useState<number | undefined>(
        undefined
    );
    const [selectedFighterId, setSelectedFighterId] = useState<
        number | undefined
    >(undefined);
    const [redId, setRedId] = useState<number | undefined>(undefined);
    const [blueId, setBlueId] = useState<number | undefined>(undefined);
    const [result, setResult] = useState<PredictionResult | null>(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadData = async (): Promise<void> => {
            try {
                const [fightersResponse, cardsResponse, fightsResponse] =
                    await Promise.all([
                        fetch(`${apiBase}/fighters`),
                        fetch(`${apiBase}/cards`),
                        fetch(`${apiBase}/fights`)
                    ]);

                if (
                    !fightersResponse.ok ||
                    !cardsResponse.ok ||
                    !fightsResponse.ok
                ) {
                    throw new Error('Could not load data from backend');
                }

                const fightersData = await fightersResponse.json();
                const cardsData = await cardsResponse.json();
                const fightsData = await fightsResponse.json();

                setFighters(fightersData);
                const sortedCards = [...cardsData].sort((a: Card, b: Card) => {
                    // Sort by event_date descending; undated cards go to the end
                    const da = a.event_date
                        ? new Date(a.event_date).getTime()
                        : 0;
                    const db = b.event_date
                        ? new Date(b.event_date).getTime()
                        : 0;
                    return db - da;
                });
                setCards(sortedCards);
                setFights(fightsData);
                if (sortedCards.length > 0) {
                    setSelectedCardId(sortedCards[0].card_id);
                }
            } catch (err) {
                setError(
                    (err as Error).message || 'Could not load data from backend'
                );
            }
        };

        void loadData();
    }, []);

    const selectedCardFights = useMemo(() => {
        return fights
            .filter(fight => fight.card_id === selectedCardId)
            .slice(0, 12);
    }, [fights, selectedCardId]);

    const selectedFighter = useMemo(() => {
        return fighters.find(
            fighter => fighter.fighter_id === selectedFighterId
        );
    }, [fighters, selectedFighterId]);

    const fighterMatchups = useMemo(() => {
        if (!selectedFighterId) {
            return [];
        }

        return fights.filter(
            fight =>
                fight.red_fighter_id === selectedFighterId ||
                fight.blue_fighter_id === selectedFighterId
        );
    }, [fights, selectedFighterId]);

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
            <p>
                Browse cards, inspect fighter profiles, review recent matchups,
                and predict outcomes from current data.
            </p>

            <SectionCard>
                <h2>Fight cards</h2>
                <FieldLabel>
                    Select card
                    <FighterSelect
                        value={selectedCardId ?? ''}
                        onChange={event =>
                            setSelectedCardId(
                                Number(event.target.value) || undefined
                            )
                        }
                    >
                        {cards.map(card => (
                            <option key={card.card_id} value={card.card_id}>
                                {card.name}
                            </option>
                        ))}
                    </FighterSelect>
                </FieldLabel>
                {((): React.ReactElement | null => {
                    const activeCard = cards.find(
                        c => c.card_id === selectedCardId
                    );
                    return activeCard ? (
                        <p>
                            {activeCard.event_date ?? '-'}{' '}
                            {activeCard.location
                                ? `· ${activeCard.location}`
                                : ''}
                        </p>
                    ) : null;
                })()}
                <TableScroll>
                    <Table>
                        <thead>
                            <tr>
                                <TableHeaderCell>Fighter</TableHeaderCell>
                                <TableHeaderCell>Opponent</TableHeaderCell>
                                <TableHeaderCell>Weight class</TableHeaderCell>
                                <TableHeaderCell>Result</TableHeaderCell>
                                <TableHeaderCell>Method</TableHeaderCell>
                                <TableHeaderCell>Rnd</TableHeaderCell>
                            </tr>
                        </thead>
                        <tbody>
                            {selectedCardFights.length === 0 ? (
                                <tr>
                                    <TableCell colSpan={6}>
                                        No fights available for this card.
                                    </TableCell>
                                </tr>
                            ) : (
                                selectedCardFights.map(fight => {
                                    const red = fighters.find(
                                        f =>
                                            f.fighter_id ===
                                            fight.red_fighter_id
                                    );
                                    const blue = fighters.find(
                                        f =>
                                            f.fighter_id ===
                                            fight.blue_fighter_id
                                    );
                                    const winner =
                                        fight.winner_id === fight.red_fighter_id
                                            ? red
                                            : fight.winner_id ===
                                                fight.blue_fighter_id
                                              ? blue
                                              : null;
                                    const loser =
                                        winner?.fighter_id === red?.fighter_id
                                            ? blue
                                            : red;
                                    return (
                                        <tr key={fight.fight_id}>
                                            <TableCell>
                                                {winner?.name ??
                                                    red?.name ??
                                                    'Unknown'}
                                            </TableCell>
                                            <TableCell>
                                                {loser?.name ??
                                                    blue?.name ??
                                                    'Unknown'}
                                            </TableCell>
                                            <TableCell>
                                                {fight.fight_weight_class ??
                                                    '-'}
                                            </TableCell>
                                            <TableCell>
                                                {fight.winner_id
                                                    ? winner
                                                        ? 'W'
                                                        : '?'
                                                    : '-'}
                                            </TableCell>
                                            <TableCell>
                                                {fight.result_method_type ??
                                                    fight.result_method ??
                                                    '-'}
                                            </TableCell>
                                            <TableCell>
                                                {fight.result_round ?? '-'}
                                            </TableCell>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </Table>
                </TableScroll>
            </SectionCard>

            <SectionCard>
                <h2>Fighter profiles</h2>
                <FieldLabel>
                    Select fighter
                    <FighterSelect
                        value={selectedFighterId ?? ''}
                        onChange={event =>
                            setSelectedFighterId(
                                Number(event.target.value) || undefined
                            )
                        }
                    >
                        <option value="">Choose a fighter</option>
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

                {selectedFighter ? (
                    <div>
                        <p>
                            <strong>{selectedFighter.name}</strong>
                        </p>
                        <p>
                            Wins: {selectedFighter.total_wins ?? '-'} • Losses:{' '}
                            {selectedFighter.total_losses ?? '-'}
                        </p>
                        <p>
                            Height:{' '}
                            {selectedFighter.height_cm
                                ? `${selectedFighter.height_cm} cm`
                                : '-'}{' '}
                            • Reach:{' '}
                            {selectedFighter.reach_cm
                                ? `${selectedFighter.reach_cm} cm`
                                : '-'}
                        </p>
                        <p>
                            Current UFC win streak:{' '}
                            {selectedFighter.current_ufc_win_streak ?? '-'}
                        </p>
                        <p>
                            Strikes landed/min:{' '}
                            {selectedFighter.strikes_landed_per_minute ?? '-'} •
                            Strikes absorbed/min:{' '}
                            {selectedFighter.strikes_absorbed_per_minute ?? '-'}
                        </p>
                        <p>
                            Strike acc:{' '}
                            {selectedFighter.strike_accuracy != null
                                ? `${selectedFighter.strike_accuracy}%`
                                : '-'}{' '}
                            • Strike def:{' '}
                            {selectedFighter.strike_defence != null
                                ? `${selectedFighter.strike_defence}%`
                                : '-'}
                        </p>
                        <p>
                            TD avg: {selectedFighter.takedown_average ?? '-'} •
                            TD acc:{' '}
                            {selectedFighter.td_accuracy != null
                                ? `${selectedFighter.td_accuracy}%`
                                : '-'}{' '}
                            • TD def:{' '}
                            {selectedFighter.td_defence != null
                                ? `${selectedFighter.td_defence}%`
                                : '-'}{' '}
                            • Sub avg:{' '}
                            {selectedFighter.submission_average ?? '-'}
                        </p>
                    </div>
                ) : null}

                {fighterMatchups.length > 0 ? (
                    <TableScroll>
                        <Table>
                            <thead>
                                <tr>
                                    <TableHeaderCell>Opponent</TableHeaderCell>
                                    <TableHeaderCell>W/L</TableHeaderCell>
                                    <TableHeaderCell>Method</TableHeaderCell>
                                    <TableHeaderCell>Rnd</TableHeaderCell>
                                </tr>
                            </thead>
                            <tbody>
                                {fighterMatchups.map(fight => {
                                    const opponentId =
                                        fight.red_fighter_id ===
                                        selectedFighterId
                                            ? fight.blue_fighter_id
                                            : fight.red_fighter_id;
                                    const opponent = fighters.find(
                                        f => f.fighter_id === opponentId
                                    );
                                    const outcome =
                                        fight.winner_id === selectedFighterId
                                            ? 'Win'
                                            : fight.winner_id &&
                                                fight.winner_id !==
                                                    selectedFighterId
                                              ? 'Loss'
                                              : '-';
                                    return (
                                        <tr key={fight.fight_id}>
                                            <TableCell>
                                                {opponent?.name ?? 'Unknown'}
                                            </TableCell>
                                            <TableCell>{outcome}</TableCell>
                                            <TableCell>
                                                {fight.result_method_type ??
                                                    fight.result_method ??
                                                    '-'}
                                            </TableCell>
                                            <TableCell>
                                                {fight.result_round ?? '-'}
                                            </TableCell>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </Table>
                    </TableScroll>
                ) : null}
            </SectionCard>

            <SectionCard>
                <h2>Predictor</h2>
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

                <FieldRow>
                    <ActionButton onClick={predict} disabled={loading}>
                        {loading ? 'Predicting…' : 'Predict winner'}
                    </ActionButton>
                </FieldRow>
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
        </AppShell>
    );
};

export default FightPredictorApp;
