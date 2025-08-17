// Minimal interval/rational helpers with simple numeric semantics.
// Designed to be swappable with ratmath-provided utilities later.
// Swap points (ratmath):
// - normalizeInterval(i)
// - width(i)
// - containsZero(i)
// - intersect(a,b)
// - addIntervals/subIntervals/mulIntervals/divIntervals
// - midpoint(i)

export type Rational = [number, number];
export type RationalInterval = [Rational, Rational];

export const ZERO: Rational = [0, 1];

export function makeRational(n: number): Rational {
  return [n, 1];
}

export function toNumber(q: Rational): number {
  const [n, d] = q;
  return d === 0 ? Number.NaN : n / d;
}

export function normalizeInterval(i: RationalInterval): RationalInterval {
  const a = toNumber(i[0]);
  const b = toNumber(i[1]);
  return a <= b ? i : [i[1], i[0]];
}

export function width(i: RationalInterval): number {
  const [lo, hi] = normalizeInterval(i);
  return Math.abs(toNumber(hi) - toNumber(lo));
}

export function containsZero(i: RationalInterval): boolean {
  const [lo, hi] = normalizeInterval(i);
  const alo = toNumber(lo);
  const ahi = toNumber(hi);
  return Math.min(alo, ahi) <= 0 && Math.max(alo, ahi) >= 0;
}

export function expand(i: RationalInterval, delta: Rational): RationalInterval {
  const d = Math.abs(toNumber(delta));
  const [lo, hi] = normalizeInterval(i);
  const nlo = makeRational(toNumber(lo) - d);
  const nhi = makeRational(toNumber(hi) + d);
  return [nlo, nhi];
}

export function intersect(a: RationalInterval, b: RationalInterval): RationalInterval | null {
  const [alo, ahi] = normalizeInterval(a);
  const [blo, bhi] = normalizeInterval(b);
  const lo = Math.max(toNumber(alo), toNumber(blo));
  const hi = Math.min(toNumber(ahi), toNumber(bhi));
  if (lo > hi) return null;
  return [makeRational(lo), makeRational(hi)];
}

export function withinDelta(prophecy: RationalInterval, target: RationalInterval, delta: Rational) {
  const expanded = expand(target, delta);
  const int = intersect(prophecy, expanded);
  return !!int; // overlap is enough for our simplified semantics
}

// Interval arithmetic (very naive, numeric)
export function addIntervals(a: RationalInterval, b: RationalInterval): RationalInterval {
  const [alo, ahi] = normalizeInterval(a);
  const [blo, bhi] = normalizeInterval(b);
  return [makeRational(toNumber(alo) + toNumber(blo)), makeRational(toNumber(ahi) + toNumber(bhi))];
}

export function subIntervals(a: RationalInterval, b: RationalInterval): RationalInterval {
  const [alo, ahi] = normalizeInterval(a);
  const [blo, bhi] = normalizeInterval(b);
  return [makeRational(toNumber(alo) - toNumber(bhi)), makeRational(toNumber(ahi) - toNumber(blo))];
}

export function mulIntervals(a: RationalInterval, b: RationalInterval): RationalInterval {
  const [alo, ahi] = normalizeInterval(a);
  const [blo, bhi] = normalizeInterval(b);
  const vals = [
    toNumber(alo) * toNumber(blo),
    toNumber(alo) * toNumber(bhi),
    toNumber(ahi) * toNumber(blo),
    toNumber(ahi) * toNumber(bhi),
  ];
  return [makeRational(Math.min(...vals)), makeRational(Math.max(...vals))];
}

export function divIntervals(a: RationalInterval, b: RationalInterval): RationalInterval {
  // Caller must ensure b does not contain zero.
  const [alo, ahi] = normalizeInterval(a);
  const [blo, bhi] = normalizeInterval(b);
  const vals = [
    toNumber(alo) / toNumber(blo),
    toNumber(alo) / toNumber(bhi),
    toNumber(ahi) / toNumber(blo),
    toNumber(ahi) / toNumber(bhi),
  ];
  return [makeRational(Math.min(...vals)), makeRational(Math.max(...vals))];
}

export function midpoint(i: RationalInterval): number {
  const [lo, hi] = normalizeInterval(i);
  return (toNumber(lo) + toNumber(hi)) / 2;
}
