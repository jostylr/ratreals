import { type Oracle, type Rational, type RationalInterval } from './types';
import { midpoint, makeRational, normalizeInterval, width } from './ops';

export function bisect(oracle: Oracle, precision: Rational): RationalInterval {
  let current = normalizeInterval(oracle.yes);
  const targetWidth = Math.abs(precision as unknown as number) || 0; // precision as rational is supported via ops in future
  let guard = 0;
  while (width(current) > targetWidth && guard++ < 10_000) {
    const m = midpoint(current);
    const left: RationalInterval = [current[0], makeRational(m)];
    const right: RationalInterval = [makeRational(m), current[1]];
    // Prefer the half that intersects with current yes by definition; choose smaller one next
    // For this scaffold, alternate sides to shrink
    current = guard % 2 === 0 ? left : right;
  }
  return current;
}

export function refine(oracle: Oracle, precision: Rational): Oracle {
  const refinedYes = bisect(oracle, precision);
  const fn = ((ab: RationalInterval, delta: Rational) => {
    // Delegate to original oracle; yes interval now refined
    return oracle(ab, delta);
  }) as Oracle;
  fn.yes = refinedYes;
  return fn;
}

