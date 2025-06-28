---
tags:
  - how-to
---
# How to Use Grover's Algorithm

This guide provides a high-level overview of how you might structure a call to a pre-packaged Grover's algorithm function.

## 1. Defining the Oracle
Grover's algorithm requires an "oracle" function that identifies the solution. For this example, we assume the API allows you to provide a "marked item" that it uses to build the oracle internally.

```javascript
// We want to find the item '101' in a 3-qubit search space.
const searchSpaceSize = 3; // 2^3 = 8 items
const markedItem = '101';
```

## 2. Constructing the Grover Job
The `client.runAlgorithm()` method abstracts away the circuit construction. You specify the algorithm name and its parameters.

```javascript
const groverJob = {
  algorithm: 'grover',
  params: {
    searchSpaceSize: searchSpaceSize,
    markedItem: markedItem,
  },
  backend: 'quantum_computer_beta',
  shots: 100,
};
```

## 3. Running the Search
Executing the job will run Grover's algorithm and should return the marked item with high probability.

```javascript
async function findItem() {
  try {
    const result = await client.runAlgorithm(groverJob);
    // The result with the highest count should be our marked item
    const foundItem = Object.keys(result.counts).reduce((a, b) => result.counts[a] > result.counts[b] ? a : b);

    console.log(`Grover's algorithm found: ${foundItem}`);
    console.log(`Is it correct? ${foundItem === markedItem}`);
  } catch (error) {
    console.error('Grover search failed:', error);
  }
}

findItem();
```
