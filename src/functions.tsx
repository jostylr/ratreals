import { type Oracle, type Rational, type RationalInterval, type Answer } from './types';
import { intersect, normalizeInterval, withinDelta, makeRational } from './ops';
import { Rational, RationalInterval as RMInterval } from 'ratmath';

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
  const rq = q instanceof Rational ? q : new Rational(q as any);
  const yes: RationalInterval = new RMInterval(rq, rq);
  return makeOracle(yes, () => yes);
}

export function fromInterval(i: RationalInterval): Oracle {
  const yes = normalizeInterval(i);
  return makeOracle(yes, () => yes);
}

export function fromTestFunction(testFn: (i: RationalInterval) => boolean): Oracle {
  // Start with a broad yes interval if not otherwise provided. Here, [-1e9, 1e9].
  const yes: RationalInterval = new RMInterval(makeRational(-1e9), makeRational(1e9));
  return makeOracle(yes, (ab) => {
    if (testFn(ab)) return ab;
    // Return a nearby point outside to force No
    const outside = new RMInterval(makeRational(1e12), makeRational(1e12));
    return outside;
  });
}
