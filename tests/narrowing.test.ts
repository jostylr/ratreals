import { describe, it, expect } from 'bun:test';
import { fromInterval } from '../src/functions';
import { bisect } from '../src/narrowing';
import { makeRational, width } from '../src/ops';

describe('narrowing', () => {
  it('bisect reduces interval width', () => {
    const o = fromInterval([makeRational(0), makeRational(10)]);
    const out = bisect(o, makeRational(1));
    expect(width(out)).toBeLessThanOrEqual(1);
  });
});

