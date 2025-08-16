import { type Oracle, type Rational, type RationalInterval, type Answer } from './types';
import {
  ZERO,
  addIntervals,
  containsZero,
  divIntervals,
  makeRational,
  mulIntervals,
  normalizeInterval,
  subIntervals,
  toNumber,
  width,
  withinDelta,
  intersect,
} from './ops';
import { getLogger } from './logger';

function makeOracle(
  yes: RationalInterval,
  compute: (ab: RationalInterval, delta: Rational) => RationalInterval
): Oracle {
  const fn = ((ab: RationalInterval, delta: Rational): Answer => {
    const prophecy = normalizeInterval(compute(ab, delta));
    const target = normalizeInterval(ab);
    const ans = !!intersect(prophecy, target) && withinDelta(prophecy, target, delta);
    return { ans, cd: prophecy };
  }) as Oracle;
  fn.yes = normalizeInterval(yes);
  return fn;
}

export function negate(a: Oracle): Oracle {
  const yes = normalizeInterval(mulIntervals(a.yes, [makeRational(-1), makeRational(-1)]));
  return makeOracle(yes, () => yes);
}

export function add(a: Oracle, b: Oracle): Oracle {
  const yes = normalizeInterval(addIntervals(a.yes, b.yes));
  return makeOracle(yes, () => yes);
}

export function subtract(a: Oracle, b: Oracle): Oracle {
  const yes = normalizeInterval(subIntervals(a.yes, b.yes));
  return makeOracle(yes, () => yes);
}

export function multiply(a: Oracle, b: Oracle): Oracle {
  const yes = normalizeInterval(mulIntervals(a.yes, b.yes));
  return makeOracle(yes, () => yes);
}

export function divide(numer: Oracle, denom: Oracle): Oracle {
  const dYes = normalizeInterval(denom.yes);
  if (toNumber(dYes[0]) === 0 && toNumber(dYes[1]) === 0) {
    throw new Error('Division by zero: denominator known to be zero');
  }
  if (containsZero(dYes)) {
    getLogger().warn('Division setup warning: denominator yes-interval contains zero');
  }
  // For initial yes, exclude zero via a naive contraction if needed
  let safeDen = dYes;
  if (containsZero(safeDen)) {
    const w = width(safeDen);
    const eps = Math.max(w * 1e-6, 1e-9);
    // Push away from zero slightly
    const lo = toNumber(safeDen[0]);
    const hi = toNumber(safeDen[1]);
    if (hi <= 0) {
      // already non-positive
      safeDen = [safeDen[0], makeRational(hi - eps)];
    } else if (lo >= 0) {
      safeDen = [makeRational(lo + eps), safeDen[1]];
    } else {
      // spans zero; narrow to side with larger magnitude
      if (Math.abs(lo) > Math.abs(hi)) {
        safeDen = [safeDen[0], makeRational(-eps)];
      } else {
        safeDen = [makeRational(eps), safeDen[1]];
      }
    }
  }
  const yes = normalizeInterval(divIntervals(numer.yes, safeDen));

  return makeOracle(yes, (_ab, delta) => {
    // Check again at evaluation time with delta: if zero still in range, throw
    const dNow = normalizeInterval(denom.yes);
    if (containsZero(dNow)) {
      // Try a delta-based contraction heuristic
      const d = Math.abs(toNumber(delta as unknown as [number, number]));
      const lo = toNumber(dNow[0]);
      const hi = toNumber(dNow[1]);
      const nlo = lo + d;
      const nhi = hi - d;
      if (nlo <= 0 && nhi >= 0) {
        throw new Error('Division by zero under requested delta: denominator interval still spans zero');
      }
    }
    return yes;
  });
}

