import { type Oracle, type Rational, type RationalInterval, type Answer } from './types';
import {
  ZERO,
  containsZero,
  intersect,
  makeRational,
  normalizeInterval,
  toNumber,
  withinDelta,
} from './ops';

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

export function fromRational(q: Rational): Oracle {
  const yes: RationalInterval = [q, q];
  return makeOracle(yes, () => yes);
}

export function fromInterval(i: RationalInterval): Oracle {
  const yes = normalizeInterval(i);
  return makeOracle(yes, () => yes);
}

export function fromTestFunction(testFn: (i: RationalInterval) => boolean): Oracle {
  // Start with a broad yes interval if not otherwise provided. Here, [-1e9, 1e9].
  const yes: RationalInterval = [makeRational(-1e9), makeRational(1e9)];
  return makeOracle(yes, (ab) => {
    // If test says inside, return ab as a prophecy; otherwise return a disjoint prophecy near ab
    if (testFn(ab)) return ab;
    const a = toNumber(ab[0]);
    const b = toNumber(ab[1]);
    const mid = (a + b) / 2;
    // Return a tiny interval disjoint from ab to force a No
    const tiny = 1e-6;
    const outside: RationalInterval = [makeRational(mid + tiny), makeRational(mid + tiny)];
    return outside;
  });
}

