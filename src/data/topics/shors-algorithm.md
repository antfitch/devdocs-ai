---
tags:
  - concept
  - shors-algorithm
  - quantum-algorithms
---
# Shor's Algorithm

Shor's algorithm is a quantum computer algorithm for integer factorization. It was developed in 1994 by the American mathematician Peter Shor and is arguably the most famous quantum algorithm.

## The Quantum Fourier Transform
The core of Shor's algorithm is the quantum Fourier transform, which is used to find the period of a specific function. Finding this period is the key to determining the factors of a large number. The quantum Fourier transform is exponentially faster than its classical counterpart.

## Breaking Classical Cryptography
On a quantum computer, to factor an integer N, Shor's algorithm runs in polynomial time. This means the time taken is polynomial in log N, the size of the integer given as input. This is exponentially faster than the best-known classical factoring algorithm.

## Real-World Implications
This has significant implications for cryptography. Many modern encryption systems, like RSA, rely on the fact that it is computationally infeasible for classical computers to factor very large numbers. A sufficiently large quantum computer running Shor's algorithm could break this encryption.
