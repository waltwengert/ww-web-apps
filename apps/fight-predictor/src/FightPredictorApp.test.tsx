import { render, screen } from '@testing-library/react';
import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { afterAll, afterEach, beforeAll, describe, expect, it } from 'vitest';

import FightPredictorApp from './FightPredictorApp';

describe('FightPredictorApp', () => {
    const server = setupServer();

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
        server.use(
            http.get('*/fighters', () =>
                HttpResponse.json([
                    {
                        fighter_id: 1,
                        name: 'Justin Gaethje',
                        total_wins: 25,
                        total_losses: 5
                    },
                    {
                        fighter_id: 2,
                        name: 'Max Holloway',
                        total_wins: 26,
                        total_losses: 8
                    }
                ])
            ),
            http.get('*/cards', () =>
                HttpResponse.json([
                    {
                        card_id: 1,
                        name: 'UFC 329: McGregor vs. Holloway 2',
                        event_date: 'Jul 11, 2026',
                        location: 'T-Mobile Arena, Las Vegas'
                    }
                ])
            ),
            http.get('*/fights', () =>
                HttpResponse.json([
                    {
                        fight_id: 1,
                        card_id: 1,
                        red_fighter_id: 2,
                        blue_fighter_id: 1,
                        winner_id: 2,
                        fight_weight_class: 'Lightweight',
                        result_method_type: 'TKO',
                        result_round: '1'
                    }
                ])
            )
        );

        render(<FightPredictorApp />);

        expect(
            await screen.findByText('UFC 329: McGregor vs. Holloway 2')
        ).toBeInTheDocument();
        // fighter appears as both a table cell and a dropdown option
        expect(screen.getAllByText('Max Holloway').length).toBeGreaterThan(0);
    });
});
