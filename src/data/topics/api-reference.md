---
tags:
  - api-reference
  - endpoints
  - quantum-computing
---
# API Reference

This section provides a detailed reference for all available API endpoints.

## POST /v1/compute
tags: POST, compute, v1, endpoints

This endpoint allows you to submit a quantum circuit for computation.

**Method:** `POST`

**Body:**
```json
{
  "circuit": "...",
  "shots": 1024
}
```

## GET /v1/jobs/{jobId}
tags: GET, jobs, v1, status

Retrieve the status of a previously submitted job.

**Method:** `GET`

**Parameters:**
- `jobId` (string): The unique identifier for the job.

## POST /v1/jobs/{jobId}/cancel
tags: POST, jobs, v1, cancel

Cancel a job that is currently running.

**Method:** `POST`

**Parameters:**
- `jobId` (string): The unique identifier for the job.

## GET /v1/jobs/{jobId}/results
tags: GET, jobs, v1, results

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

## GET /v1/backends
tags: GET, backends, v1, list

Get a list of all available quantum computer backends.

**Method:** `GET`

## GET /v1/backends/{backendId}
tags: GET, backends, v1, details

Retrieve detailed information about a specific quantum backend, including its topology and gate set.

**Method:** `GET`

**Parameters:**
- `backendId` (string): The identifier for the backend.

## POST /v1/experiments
tags: POST, experiments, v1, create

Create a new experiment to group related jobs.

**Method:** `POST`

**Body:**
```json
{
  "name": "My Bell State Experiment",
  "description": "An experiment to test entanglement."
}
```

## GET /v1/experiments/{experimentId}
tags: GET, experiments, v1, details

Get details for a specific experiment.

**Method:** `GET`

**Parameters:**
- `experimentId` (string): The unique identifier for the experiment.

## PUT /v1/experiments/{experimentId}
tags: PUT, experiments, v1, update

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

## DELETE /v1/experiments/{experimentId}
tags: DELETE, experiments, v1, remove

Delete a specific experiment.

**Method:** `DELETE`

**Parameters:**
- `experimentId` (string): The unique identifier for the experiment.

## GET /v1/algorithms
tags: GET, algorithms, v1, list

List all supported quantum algorithms.

**Method:** `GET`
