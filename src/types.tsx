// Public-facing types for oracles, using ratmath classes directly.
import { Rational, RationalInterval } from 'ratmath';

export type Answer = {
  ans: boolean;
  cd: RationalInterval;
  out?: unknown;
};

export interface Oracle {
  (ab: RationalInterval, delta: Rational, input?: unknown): Answer;
  yes: RationalInterval;
}
