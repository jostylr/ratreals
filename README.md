# RatReals

This is an extension of the RatMath library. It uses the rational interval arithmetic of that library to represent reals via an oracle structure.

Specifically, a real number will be represented as an oracle R, an object which is primarily, that, when given a rational interval a:b and a rational fuzziness delta, it will return a pair (0 || 1, c:d) where c:d is a rational interval in a delta-neighborhood of a:b and c:d is guaranteed to contain the real number (it could be c, d, or any number in between). The first entry is 1 if c:d intersects a:b and is 0 if it does not. The oracle can take in other parameters, such as a starting point if it implements Newton's method, for example, and it can give other outputs for being able to do further steps, such as an output of some step in Newton's method. Programmatically, there will be a third input argument and a third output argument that can generally be where all of that extra complexity can be put in.The output intervals c:d are called prophecies. Any interval that always gets a 1 in response is a Yes interval. Writing R(a:b, delta)=1 means the outputs for those inputs all include 1. If = 0 is written, then that means at least one output is 0.

The intervals of inputs and outputs are inclusive of the endpoints. In particular, a:a is a singleton. The delta neighborhoods, however, are considered exclusive of the endpoints. Also a:b is considered to be an unordered presentation so 1:2 and 2:1 are equally fine ways of representing the set of all rationals between and including 1 and 2.

There are several properties that a function of the above form must satisfy to be an oracle:

- Separation. Given any prophecy c:d and m contained in c:d and a delta > 0, then one of the following holds true: R(c:m, delta) = 1 or R(m:d, delta)=1.

- Disjointness. If c:d is a prophecy and a:b is disjoint from c:d, then there exists a delta such that R(a:b, delta) = 0.

- Consistency. If a:b contains a prophecy of R, then R(a:b) = 1.

- Closed. If for each delta >0, the delta neighborhood (a)_delta contains a prophecy, then for all b, R(a:b) = 1.

From a practical point of view, initiating an oracle should be to give a known Yes interval and be able to use Separation to create smaller intervals. Disjointness and Consistency are just built in. Closed is not really relevant from a computable point of view, it is for proofs. But singletons should definitely be permitted as Yes intervals.

These should be established for any given oracle one is working with. Also, from a practical point of view, the oracles here ought to be limited to those that can actually produce the answer in a finite time. That is, we can only concern ourselves with the computable numbers or, at least, numbers that are computable up to the point that we care about.

This is developed with Bun, but should work in various javascript runtimes.

## Quick Start (sync API)

```ts
import { fromRational } from './src/functions';
import { add, divide } from './src/arithmetic';
import { bisect } from './src/narrowing';
import { makeRational } from './src/ops';

// Create oracles for 2 and 3
const two = fromRational(makeRational(2));
const three = fromRational(makeRational(3));

// Arithmetic behaves like normal math (synchronously)
const five = add(two, three);

// Narrow an interval to target precision
const approx = bisect(five, makeRational(0.001));
// approx is a RationalInterval around 5 with width <= 0.001

// Division semantics:
// - If denominator is known to be 0 at definition -> throws
// - If denominator yes-interval contains 0 at definition -> warns via logger
// - When producing an interval at a given delta, if 0 remains -> throws
```

Note: Internal interval helpers currently use a minimal numeric fallback; they are structured to be replaced by ratmath’s precise interval/rational operations.
