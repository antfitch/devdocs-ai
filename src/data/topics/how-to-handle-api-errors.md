---
tags:
  - how-to
---
# How to Handle API Errors

Proper error handling is crucial for building robust applications. The API client will throw an error for failed requests.

## Use Try...Catch Blocks
tags: errors, api, try-catch

Always wrap your API calls in a `try...catch` block to gracefully handle any potential failures, such as network issues or invalid inputs.

```javascript
async function riskyOperation() {
  try {
    const results = await client.compute({ circuit: 'INVALID_CIRCUIT' });
    console.log('Success:', results);
  } catch (error) {
    console.error('An error occurred!');
    // The error object contains useful information
    console.error(`Error name: ${error.name}, Message: ${error.message}`);
  }
}
```

## Inspect Error Codes
tags: errors, api, error-codes

The error object returned by the client may include a `statusCode` and a `code` property from the API, which can help you handle different types of errors programmatically.

```javascript
try {
  await client.getJobStatus('job-id-that-does-not-exist');
} catch (error) {
  if (error.statusCode === 404) {
    console.log('Job not found. It may have expired or the ID is incorrect.');
  } else if (error.statusCode === 401) {
    console.error('Authentication failed. Check your API key.');
  } else {
    console.error(`An unexpected error occurred: ${error.message}`);
  }
}
```

## Implement Retry Logic
tags: errors, api, retry-logic

For transient errors (like a 503 Service Unavailable), you might want to implement a simple retry mechanism with an exponential backoff.

```javascript
async function requestWithRetry(jobConfig, retries = 3, delay = 1000) {
  for (let i = 0; i < retries; i++) {
    try {
      return await client.compute(jobConfig);
    } catch (error) {
      if (error.statusCode >= 500 && i < retries - 1) {
        console.log(`Server error, retrying in ${delay / 1000}s...`);
        await new Promise(res => setTimeout(res, delay));
        delay *= 2; // Exponential backoff
      } else {
        throw error; // Re-throw the error if it's not a server error or retries are exhausted
      }
    }
  }
}
```
