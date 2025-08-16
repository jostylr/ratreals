import { describe, it, expect, mock } from 'bun:test';
import { add, subtract, multiply, divide } from '../src/arithmetic';
import { fromRational, fromInterval } from '../src/functions';
import { makeRational } from '../src/ops';
import { setLogger } from '../src/logger';

describe('arithmetic oracles', () => {
  it('add/subtract/multiply combine yes intervals', () => {
    const a = fromInterval([makeRational(1), makeRational(2)]);
    const b = fromInterval([makeRational(3), makeRational(4)]);
    const s = add(a, b);
    expect(s.yes[0][0]).toBe(4);
    expect(s.yes[1][0]).toBe(6);
    const d = subtract(b, a);
    expect(d.yes[0][0]).toBe(1);
    expect(d.yes[1][0]).toBe(3);
    const m = multiply(a, b);
    expect(m.yes[0][0]).toBe(3);
    expect(m.yes[1][0]).toBe(8);
  });

  it('division warns when denom yes contains zero and throws for known zero', () => {
    const warn = mock(() => {});
    setLogger({ warn });
    const numer = fromInterval([makeRational(1), makeRational(2)]);
    // denom spans zero -> warn
    const denomWarn = fromInterval([makeRational(-1), makeRational(1)]);
    const d1 = divide(numer, denomWarn);
    expect(warn).toHaveBeenCalled();

    // denom known zero -> throw
    const denomZero = fromInterval([makeRational(0), makeRational(0)]);
    expect(() => divide(numer, denomZero)).toThrowError();
  });
});

