import { describe, it, expect } from 'bun:test';
import { fromRational, fromInterval } from '../src/functions';
import { makeRational, toNumber } from '../src/ops';

describe('basic oracles', () => {
  it('fromRational sets yes to q:q', () => {
    const q = makeRational(3);
    const o = fromRational(q);
    expect(toNumber(o.yes[0])).toBe(3);
    expect(toNumber(o.yes[1])).toBe(3);
  });

  it('fromInterval normalizes yes', () => {
    const o = fromInterval([makeRational(5), makeRational(1)]);
    expect(toNumber(o.yes[0])).toBe(1);
    expect(toNumber(o.yes[1])).toBe(5);
  });
});

