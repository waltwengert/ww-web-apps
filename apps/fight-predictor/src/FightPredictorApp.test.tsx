import { render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import FightPredictorApp from './FightPredictorApp';

describe('FightPredictor App', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders app heading', () => {
        render(<FightPredictorApp />);
        expect(screen.getByText(/fight predictor/i)).toBeInTheDocument();
    });
});
