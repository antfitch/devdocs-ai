---
tags:
  - concept
  - get-started
---
# Welcome to DevDocs AI

DevDocs AI is an AI-powered content management system. The purpose of DevDocs AI is to provide technical documentation for humans and machines (chatbots, app builders, mpc servers). It brings back the lost artform of the **index**, but in a new AI-loving sort of way.

## Why we need this

How content is consumed is changing rapidly. Who is consuming content is also changing. The number of people using AI chatbots to build things is increasing, and Agentic app builders are spinning up everywhere. These agentic app builders are critical documentation customers, as these agents rely heavily on technical documentation to build apps that run.

## Replace brittle user journeys with customizable ones

For a gazillion years, the tech industry has generally presented product documentation in the same old way. A TOC with a brittle structure that essentially allows one user journey. There is no way to customize that journey and if you're dealing with a massive product like BigQuery, trying to find the content you need is like searching for a needle in a haystack.

It's time to change and we need to change. Let's do something different. Let's lead. Let's create a new system that makes it easier for humans (and machines) to build customized user journeys.

## How to Use This Platform

This platform is built with indexing in mind. Every topic and section in a topic has **tags**. These tags are used as **filters**.

- Humans can use filters to build a custom user journey on a doc site.
- Machines can use tags as a quality metric to narrow an area of focus.

### Build a user journey (humans)

1. Select the type of content to display (how-to, reference, etc).
2. Select the subjects that matter (auth, jobs, etc).
3. Select any additional keywords that matter (post, query, search).
4. Choose your viewing mode (topics, sections, code).

### Build a user journey (machines)

1. (outside of DevDocs AI) Take a user request.
2. Scan topics for tags that match user request.
3. Scan sections for tags that match user request.
4. Ingest only the sections that matter.
5. Create user journey from ingested content.

### AI-powered research features (humans)

Additional tooling is available for our human users in the AI Agent tab.

- Ask a question: Have a question about something in the docs? DevDocs AI will first search through the docs to find the answer and then search outward if an answer is not available.

- Explain selected text: Highlight some text in a document and have DevDocs AI provide a clear explanation.

- Generate code sample: Highlight some text in a document and have DevDocs AI provide a code sample that illustrates the concept.

### Search for things (humans)

Our human users can search using the highly-responsive searchbox on the Search tab or using the Ask a question option in the AI Agent tab.

### No more right pane navigation (humans)

A common feature in technical documentation is a right navigation pane that shows the sections in a document. In DevDocs AI, this has moved into the left navigation pane. When you select a document in the Types section, the TOC will appear under the selected document.

### View a list of topics (humans)

If you set View Mode to Topics and then select categories in Types, you'll get a list of topics in the main window. You can expand a topic to read a summary about it and to see a list of sections inside of it. You can click on the section you want to visit first.

### View a list of sections (humans)

Topics can be very long and sometimes you're just interested in finding sections that matter to you. If you set View Mode to Sections and then select some categories in Types, you'll get just a list of sections in the main window. You can expand a section just to read its contents, and if you really want to see the entire topic, there is a link you can click on to view it.

### View a list of code samples (humans)

Topics can be very long and sometimes you're just interested in finding code samples that matter to you. If you set View Mode to Samples and then select some categories in Types, you'll get a list of sections in the main window that have code samples. You can expand a section just to read its contents, and if you really want to see the entire topic, there is a link you can click on to view it.

### A note on how we could maintain DevDocs AI

Build this app in Firebase Studio was easy. Adding complex features was easy. We should consider adopting this workflow to build content management systems for documentation.