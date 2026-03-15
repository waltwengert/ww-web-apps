import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';

import App from './PortfolioApp';

describe('Portfolio App', () => {
    afterEach(() => {
        vi.restoreAllMocks();
    });

    it('renders heading and section navigation buttons', () => {
        render(<App />);

        expect(screen.getByRole('heading', { level: 1 })).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /about/i })
        ).toBeInTheDocument();
        expect(
            screen.getByRole('button', { name: /projects/i })
        ).toBeInTheDocument();
    });

    it('scrolls to selected section when nav button is clicked', () => {
        const scrollSpy = vi.fn();
        Object.defineProperty(window, 'scroll', {
            value: scrollSpy,
            writable: true
        });

        render(<App />);

        const projectsSection = document.getElementById('projects');
        expect(projectsSection).toBeTruthy();

        Object.defineProperty(window, 'innerHeight', {
            value: 800,
            configurable: true
        });

        Object.defineProperty(document.documentElement, 'scrollHeight', {
            value: 2000,
            configurable: true
        });

        Object.defineProperty(projectsSection!, 'offsetTop', {
            value: 500,
            configurable: true
        });

        fireEvent.click(screen.getByRole('button', { name: /projects/i }));

        expect(scrollSpy).toHaveBeenCalledWith({
            top: 422,
            behavior: 'auto'
        });
    });
});
