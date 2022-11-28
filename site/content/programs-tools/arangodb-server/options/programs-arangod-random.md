---
fileID: programs-arangod-random
title: ArangoDB Server Random Options
weight: 305
description: 
layout: default
---
## Random Number Generator

`random.generator`

Defines the type of random number generator to use.

The argument is an integer which sets the manner in which
random numbers are generated.

- `1`: a pseudorandom number generator using an implication of the
  Mersenne Twister MT19937 algorithm
- `2`: use a blocking random (or pseudorandom) number generator
- `3`: use the non-blocking random (or pseudorandom) number generator supplied
  by the operating system
- `4`: a combination of the blocking random number generator and the
  Mersenne Twister (not available on Windows)
- `5`: use WinCrypt (Windows only)
