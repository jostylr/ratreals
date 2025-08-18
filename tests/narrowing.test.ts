import { describe, it, expect } from 'bun:test';
import { fromInterval } from '../src/functions';
import { bisect } from '../src/narrowing';
import { makeRational, width } from '../src/ops';
import { RationalInterval } from 'ratmath';

describe('narrowing', () => {
  it('bisect reduces interval width', () => {
    const o = fromInterval(new RationalInterval(makeRational(0), makeRational(10)) as any);
    const out = bisect(o, makeRational(1));
    expect(width(out)).toBeLessThanOrEqual(1);
  });
});
