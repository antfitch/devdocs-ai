---
tags:
  - how-to
---
# How to Create a Bell State

A Bell state is a specific state of two entangled qubits. This guide shows how to create one.

## Define the Circuit for Entanglement
tags: bell-state, circuit, entanglement, sample

The simplest Bell state, |Φ+⟩, is created by applying a Hadamard gate to the first qubit and then a CNOT gate with the first qubit as control and the second as target.

```javascript
const bellStateCircuit = `
  // Start with qubits in |00>
  H q[0];     // Apply Hadamard to q[0] -> (|0> + |1>)/sqrt(2)
  CX q[0], q[1]; // Apply CNOT -> (|00> + |11>)/sqrt(2)
`;
```

## Execute the Bell State Circuit
tags: bell-state, execute, circuit, sample

Submit this circuit to a backend. Since this is a foundational experiment, a simulator is often sufficient and faster.

```javascript
const jobConfig = {
  circuit: bellStateCircuit,
  backend: 'local_simulator',
  shots: 1000,
};

const results = await client.compute(jobConfig);
console.log('Bell state circuit results:', results);
```

## Verify the Entangled State
tags: bell-state, entanglement, verification, sample

When you measure the qubits, you should observe the states `00` and `11` with roughly equal probability (around 50% each), and never `01` or `10`. This confirms the entanglement.

```javascript
const outcomes = results.counts;
const totalShots = results.shots;

const p00 = (outcomes['00'] || 0) / totalShots;
const p11 = (outcomes['11'] || 0) / totalShots;

console.log(`Probability of measuring '00': ${p00.toFixed(3)}`);
console.log(`Probability of measuring '11': ${p11.toFixed(3)}`);

if (p00 > 0.4 && p11 > 0.4 && !outcomes['01'] && !outcomes['10']) {
  console.log('Results are consistent with a Bell state!');
}
```
