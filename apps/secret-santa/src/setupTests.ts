import * as matchers from '@testing-library/jest-dom/matchers';
import { toHaveNoViolations } from 'jest-axe';
import { expect } from 'vitest';

expect.extend(matchers);
expect.extend(toHaveNoViolations);
