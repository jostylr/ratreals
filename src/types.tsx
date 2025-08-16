// Public-facing types for oracles, using ratmath types when available.
// Note: Type-only imports are erased at runtime, so tests can run without ratmath installed.

import type { Rational as RM_Rational, RationalInterval as RM_RationalInterval } from 'ratmath';

export type Rational = RM_Rational | [number, number];
export type RationalInterval = RM_RationalInterval | [Rational, Rational];

export type Answer = {
  ans: boolean;
  cd: RationalInterval;
  out?: unknown;
};

export interface Oracle {
  (ab: RationalInterval, delta: Rational, input?: unknown): Answer;
  yes: RationalInterval;
}

