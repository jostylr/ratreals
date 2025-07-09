# RatReals

This is an extension of the RatMath library. It uses the rational interval arithmetic of that library to represent reals via an oracle structure.

Specifically, a real number is an object, primarily a function, that, when given a rational interval a:b and a rational fuzziness delta, it will return a pair (0 || 1, c:d) where c:d is a rational interval in a delta-neighborhood of a:b and c:d is guaranteed to contain the real number (it could be c, d, or any number in between). The first entry is 1 if c:d intersects a:b and is 0 if it does not. The oracle can take in other parameters, such as a starting point if it implements Newton's method, for example, and it can give other outputs for being able to do further steps, such as an output of some step in Newton's method. Programmatically, there will be a third input argument and a third output argument that can generally be where all of that extra complexity can be put in.

There are several properties that a function of the above form must satisfy to be an oracle:

- Separation

- Disjointness

- Consistency

- Closed

These should be established. Also, from a practical point of view, the oracles here ought to be limited to those that can actually produce the answer in a finite time. That is, we can only concern ourselves with the computable numbers or, at least, numbers that are computable up to the point that we care about.

This is developed with Bun, but should work in various javascript runtimes.
