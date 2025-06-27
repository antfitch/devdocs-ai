---
tags:
  - api-reference
  - endpoints
  - quantum-computing
---
# API Reference

This section provides a detailed reference for all available API endpoints.

## /v1/compute

This endpoint allows you to submit a quantum circuit for computation.

**Method:** `POST`

**Body:**
```json
{
  "circuit": "...",
  "shots": 1024
}
```

The `circuit` parameter should be a string representation of your quantum circuit in QASM format. The `shots` parameter specifies how many times to run the circuit.