---
tags:
  - concept
  - grovers-algorithm
  - quantum-algorithms
---
# Grover's Algorithm

Grover's algorithm is a quantum algorithm for unstructured search that finds with high probability the unique input to a black box function that produces a particular output value. It's often described as a quantum database search algorithm.

## The Quantum Search
Imagine trying to find a specific name in a phone book with a million entries that are not in alphabetical order. Classically, you'd have to check, on average, 500,000 entries. Grover's algorithm can find the name in about 1,000 steps (the square root of one million).

## How It Works: Amplitude Amplification
The algorithm works by repeatedly applying an operation that "amplifies" the amplitude of the desired state while decreasing the amplitudes of all other states. After a certain number of iterations, measuring the qubits will yield the correct state with very high probability.

## Quadratic Speedup
This provides a quadratic speedup over the best possible classical search algorithms. For a list of N items, a classical search takes O(N) time on average, whereas Grover's algorithm can find the item in just O(√N) time.
