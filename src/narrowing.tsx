import { type Oracle, type Rational, type RationalInterval } from './types';
import { midpoint, normalizeInterval, width } from './ops';
import { RationalInterval as RMInterval, Rational } from 'ratmath';

export function bisect(oracle: Oracle, precision: Rational): RationalInterval {
  let current = normalizeInterval(oracle.yes);
  const targetWidth = typeof (precision as any) === 'number'
    ? Math.abs(precision as unknown as number)
    : Math.abs(Number((precision as unknown as Rational).numerator) / Number((precision as unknown as Rational).denominator));
  let guard = 0;
  while (width(current) > targetWidth && guard++ < 10_000) {
    const m = midpoint(current);
    const left: RationalInterval = new RMInterval(current.low, m);
    const right: RationalInterval = new RMInterval(m, current.high);
    // Alternate sides to shrink
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
