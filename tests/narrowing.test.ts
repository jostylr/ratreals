import { describe, it, expect } from 'bun:test';
import { fromInterval, fromTestFunction } from '../src/functions';
import { bisect, narrowWithCutter } from '../src/narrowing';
import { makeRational, width } from '../src/ops';
import { RationalInterval, Rational } from 'ratmath';

describe('narrowing', () => {
  it('bisect reduces interval width', () => {
    const o = fromInterval(new RationalInterval(makeRational(0), makeRational(10)) as any);
    const out = bisect(o, makeRational(1));
    expect(width(out)).toBeLessThanOrEqual(1);
  });

  it('bisect consults oracle to choose side', () => {
    const three = makeRational(3);
    const containsThree = (i: RationalInterval) => i.low.lessThanOrEqual(three) && i.high.greaterThanOrEqual(three);
    const o = fromTestFunction(containsThree);
    // start search interval
    (o as any).yes = new RationalInterval(makeRational(0), makeRational(10));
    const half = new Rational(1).divide(new Rational(2));
    const out = bisect(o, half as any);
    expect(out.low.lessThanOrEqual(three)).toBe(true);
    expect(out.high.greaterThanOrEqual(three)).toBe(true);
    expect(width(out)).toBeLessThanOrEqual(0.5);
  });

  it('narrowWithCutter narrows using a custom cut function', () => {
    const target = makeRational(7);
    const containsTarget = (i: RationalInterval) => i.low.lessThanOrEqual(target) && i.high.greaterThanOrEqual(target);
    const o = fromTestFunction(containsTarget);
    (o as any).yes = new RationalInterval(makeRational(0), makeRational(20));
    const quarter = new Rational(1).divide(new Rational(4));
    const out = narrowWithCutter(
      o,
      quarter as any,
      (i) => i.low.add(i.high).divide(new Rational(2))
    );
    expect(out.low.lessThanOrEqual(target)).toBe(true);
    expect(out.high.greaterThanOrEqual(target)).toBe(true);
    expect(width(out)).toBeLessThanOrEqual(0.25);
  });
});
