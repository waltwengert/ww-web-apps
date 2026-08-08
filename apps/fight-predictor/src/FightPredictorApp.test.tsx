import { fireEvent, render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import FightPredictorApp from './FightPredictorApp';

describe('FightPredictorApp', () => {
    const server = setupServer();

    const fighters = [
        {
            fighter_id: 1,
            name: 'Justin Gaethje',
            total_wins: 25,
            total_losses: 5,
            height_cm: 180,
            reach_cm: 178,
            strike_accuracy: 61,
            strike_defence: 55,
            td_accuracy: 34,
            td_defence: 77,
            strikes_landed_per_minute: 7.46,
            strikes_absorbed_per_minute: 7.88,
            takedown_average: 0.15,
            submission_average: 0,
            current_ufc_win_streak: 2
        },
        {
            fighter_id: 2,
            name: 'Max Holloway',
            total_wins: 26,
            total_losses: 8,
            height_cm: 181,
            reach_cm: 175,
            strike_accuracy: 48,
            strike_defence: 59,
            td_accuracy: 53,
            td_defence: 84,
            strikes_landed_per_minute: 7.16,
            strikes_absorbed_per_minute: 4.77,
            takedown_average: 0.25,
            submission_average: 0.2,
            current_ufc_win_streak: 1
        },
        {
            fighter_id: 3,
            name: 'Ilia Topuria'
        }
    ];

    const cards = [
        {
            card_id: 1,
            name: 'UFC 329: McGregor vs. Holloway 2',
            event_date: 'Jul 11, 2026',
            location: 'T-Mobile Arena, Las Vegas'
        },
        {
            card_id: 2,
            name: 'UFC 328: Topuria vs. Volkanovski 2',
            event_date: 'Jun 20, 2026'
        }
    ];

    const fights = [
        {
            fight_id: 1,
            card_id: 1,
            red_fighter_id: 2,
            blue_fighter_id: 1,
            winner_id: 2,
            fight_weight_class: 'Lightweight',
            result_method_type: 'TKO',
            result_round: '1'
        },
        {
            fight_id: 2,
            card_id: 1,
            red_fighter_id: 3,
            blue_fighter_id: 2,
            winner_id: 3,
            result_method: 'Decision'
        },
        {
            fight_id: 3,
            card_id: 2,
            red_fighter_id: 3,
            blue_fighter_id: 1
        }
    ];

    const useSuccessfulBootstrapHandlers = (): void => {
        server.use(
            http.get('*/fighters', () => HttpResponse.json(fighters)),
            http.get('*/cards', () => HttpResponse.json(cards)),
            http.get('*/fights', () => HttpResponse.json(fights))
        );
    };

    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

    afterEach(() => server.resetHandlers());

    afterAll(() => server.close());

    it('renders the main sections', () => {
        server.use(
            http.get('*/fighters', () => HttpResponse.json([])),
            http.get('*/cards', () => HttpResponse.json([])),
            http.get('*/fights', () => HttpResponse.json([]))
        );

        render(<FightPredictorApp />);

        expect(
            screen.getByRole('heading', { name: /fight predictor/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: /fight cards/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: /fighter profiles/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('heading', { name: 'Predictor' })
        ).toBeInTheDocument();
    });

    it('loads and displays fight card data', async () => {
        useSuccessfulBootstrapHandlers();

        render(<FightPredictorApp />);

        expect(
            await screen.findByText('UFC 329: McGregor vs. Holloway 2')
        ).toBeInTheDocument();
        // fighter appears as both a table cell and a dropdown option
        expect(screen.getAllByText('Max Holloway').length).toBeGreaterThan(0);
    });

    it('renders backend loading errors', async () => {
        server.use(
            http.get('*/fighters', () =>
                HttpResponse.json([], { status: 500 })
            ),
            http.get('*/cards', () => HttpResponse.json([])),
            http.get('*/fights', () => HttpResponse.json([]))
        );

        render(<FightPredictorApp />);

        expect(
            await screen.findByText('Could not load data from backend')
        ).toBeInTheDocument();
    });

    it('shows fighter profile and matchup outcomes', async () => {
        useSuccessfulBootstrapHandlers();

        render(<FightPredictorApp />);

        const fighterSelect = await screen.findByLabelText(/select fighter/i);
        fireEvent.change(fighterSelect, { target: { value: '2' } });

        expect(
            await screen.findByText('Wins: 26 • Losses: 8')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Height: 181 cm • Reach: 175 cm')
        ).toBeInTheDocument();
        expect(
            screen.getByText('Current UFC win streak: 1')
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'Strikes landed/min: 7.16 • Strikes absorbed/min: 4.77'
            )
        ).toBeInTheDocument();
        expect(
            screen.getByText('Strike acc: 48% • Strike def: 59%')
        ).toBeInTheDocument();
        expect(
            screen.getByText(
                'TD avg: 0.25 • TD acc: 53% • TD def: 84% • Sub avg: 0.2'
            )
        ).toBeInTheDocument();
        expect(screen.getAllByText('Justin Gaethje').length).toBeGreaterThan(0);
        expect(screen.getByText('Win')).toBeInTheDocument();
        expect(screen.getByText('Loss')).toBeInTheDocument();
    });

    it('validates predictor inputs before requesting prediction', async () => {
        useSuccessfulBootstrapHandlers();

        render(<FightPredictorApp />);

        const predictButton = await screen.findByRole('button', {
            name: /predict winner/i
        });

        fireEvent.click(predictButton);

        expect(
            await screen.findByText('Select both a red and blue fighter.')
        ).toBeInTheDocument();
    });

    it('shows prediction results on successful response', async () => {
        useSuccessfulBootstrapHandlers();
        server.use(
            http.post('*/predict', () =>
                HttpResponse.json({
                    red_win_probability: 0.35,
                    blue_win_probability: 0.65,
                    favorite: 'blue'
                })
            )
        );

        render(<FightPredictorApp />);

        const redFighterSelect = await screen.findByLabelText(/red fighter/i);
        const blueFighterSelect = screen.getByLabelText(/blue fighter/i);

        fireEvent.change(redFighterSelect, { target: { value: '1' } });
        fireEvent.change(blueFighterSelect, { target: { value: '2' } });
        fireEvent.click(
            screen.getByRole('button', { name: /predict winner/i })
        );

        expect(
            await screen.findByText('Red win probability:')
        ).toBeInTheDocument();
        expect(screen.getByText('35%')).toBeInTheDocument();
        expect(screen.getByText('65%')).toBeInTheDocument();
        expect(screen.getByText('blue')).toBeInTheDocument();
    });

    it('renders prediction errors from backend failures', async () => {
        useSuccessfulBootstrapHandlers();
        server.use(
            http.post('*/predict', () => HttpResponse.json({}, { status: 500 }))
        );

        render(<FightPredictorApp />);

        const redFighterSelect = await screen.findByLabelText(/red fighter/i);
        const blueFighterSelect = screen.getByLabelText(/blue fighter/i);

        fireEvent.change(redFighterSelect, { target: { value: '1' } });
        fireEvent.change(blueFighterSelect, { target: { value: '2' } });
        fireEvent.click(
            screen.getByRole('button', { name: /predict winner/i })
        );

        expect(
            await screen.findByText('Prediction request failed')
        ).toBeInTheDocument();
    });
});
