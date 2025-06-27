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

## /v1/jobs/{jobId}

Retrieve the status of a previously submitted job.

**Method:** `GET`

**Parameters:**
- `jobId` (string): The unique identifier for the job.

## /v1/jobs/{jobId}/cancel

Cancel a job that is currently running.

**Method:** `POST`

**Parameters:**
- `jobId` (string): The unique identifier for the job.

## /v1/jobs/{jobId}/results

Fetch the results of a completed job.

**Method:** `GET`

**Parameters:**
- `jobId` (string): The unique identifier for the job.

**Returns:**
```json
{
  "jobId": "...",
  "status": "completed",
  "results": {
    "001": 512,
    "110": 512
  }
}
```

## /v1/backends

Get a list of all available quantum computer backends.

**Method:** `GET`

## /v1/backends/{backendId}

Retrieve detailed information about a specific quantum backend, including its topology and gate set.

**Method:** `GET`

**Parameters:**
- `backendId` (string): The identifier for the backend.

## /v1/experiments

Create a new experiment to group related jobs.

**Method:** `POST`

**Body:**
```json
{
  "name": "My Bell State Experiment",
  "description": "An experiment to test entanglement."
}
```

## /v1/experiments/{experimentId}

Get details for a specific experiment.

**Method:** `GET`

**Parameters:**
- `experimentId` (string): The unique identifier for the experiment.

## /v1/experiments/{experimentId}

Update the details of an existing experiment.

**Method:** `PUT`

**Parameters:**
- `experimentId` (string): The unique identifier for the experiment.

**Body:**
```json
{
  "name": "Updated Experiment Name",
  "description": "Updated description."
}
```

## /v1/experiments/{experimentId}

Delete a specific experiment.

**Method:** `DELETE`

**Parameters:**
- `experimentId` (string): The unique identifier for the experiment.

## /v1/algorithms

List all supported quantum algorithms.

**Method:** `GET`
