# Product Requirements Document: DevDocs AI

**Version:** 1.0
**Author:** App Prototyper AI

---

## 1. Introduction

### 1.1. Overview
DevDocs AI is an interactive, AI-enhanced documentation platform designed for developers. It provides a unified interface to browse, search, and understand technical documentation. The core of the experience is an AI assistant that can explain complex concepts, answer questions, and generate relevant code snippets on demand.

### 1.2. Goal
The primary goal of DevDocs AI is to accelerate developer learning and productivity by making documentation more accessible, interactive, and intelligent. It aims to reduce the time developers spend searching for information and trying to decipher complex technical text.

## 2. Target Audience
This platform is intended for software developers, engineers, and data scientists who consume technical documentation to build software, use APIs, or learn new technologies.

## 3. Core Features

### 3.1. Documentation Browser
*   **Layout:** A persistent two-column layout with a navigation sidebar on the left and a content viewer on the right.
*   **Content Source:** Documentation is sourced from local Markdown files located in the `src/data/topics/` directory.
*   **Content Rendering:** The viewer correctly renders standard Markdown syntax, including headings, lists, code blocks, inline code, bold, italics, and blockquotes.
*   **Frontmatter Handling:** Markdown frontmatter (e.g., `tags`) is used for metadata but is not rendered in the user-facing view.

### 3.2. Hierarchical Table of Contents (TOC)
*   **Topic Organization:** The sidebar serves as the TOC, displaying a structured list of topics and subtopics as defined in `src/data/topics.ts`.
*   **Collapsible Sections:** Topics with subtopics are displayed as collapsible sections.
*   **Dynamic Subheadings:** For any topic with more than one `##` heading (H2), these headings are automatically parsed and displayed as a collapsible sub-list under that topic in the TOC. Clicking the topic toggles the visibility of these subheadings.
*   **Interactive Navigation:** Clicking on a topic or subheading in the TOC loads the relevant content or scrolls the view to the corresponding section of the document.
*   **Visual Cues:** Topics can be assigned icons from the `lucide-react` library.

### 3.3. Search Functionality
*   **Unified Search Bar:** A prominent search bar is located at the top of the sidebar.
*   **Live Search:** As the user types, the main content area switches to a search results view, showing all documents that match the query.
*   **Comprehensive Matching:** Search functionality matches against both the title and the full content of the documentation.
*   **Results Display:** Search results are presented as individual cards, each showing the document title, a content snippet, and a "Go to topic" button to navigate directly to that document.

### 3.4. AI Assistant ("AskMe")
The AI assistant is a floating widget located at the bottom-right of the screen. It remains a fixed size and provides contextual, AI-driven help.

*   **Ask a Question:**
    *   A user can click the "Ask" button to open a dialog.
    *   In the dialog, the user can type a question about the documentation.
    *   The AI assistant will use this question to perform a vector search (currently mocked) against the documentation and provide a synthesized answer in a results dialog.
*   **Explain Text:**
    *   When a user highlights any text within the content viewer, the "Explain" button becomes active.
    *   Clicking this button sends the highlighted text to the AI, which returns a simplified explanation of the concept or code.
*   **Generate Code:**
    *   When a user highlights text, the "Make Code" button also becomes active.
    *   Clicking it instructs the AI to generate a functional code snippet based on the context of the highlighted documentation.

## 4. User Interface and Experience (UX)
*   **Clean & Modern UI:** The application uses ShadCN UI components and Tailwind CSS for a modern, clean, and responsive design.
*   **Responsive Design:** The application is usable on both desktop and mobile devices. The sidebar collapses into an off-canvas menu on smaller screens.
*   **Unobstructed Reading:** The main content area has extra padding at the bottom to ensure that content can be scrolled fully into view without being obscured by the fixed "AskMe" assistant.

## 5. Technical Stack
*   **Framework:** Next.js (App Router)
*   **Language:** TypeScript
*   **UI Components:** ShadCN UI
*   **Styling:** Tailwind CSS
*   **AI Integration:** Genkit with Google Gemini
*   **Icons:** `lucide-react`

## 6. Non-Functional Requirements
*   **Performance:** The application should be fast and responsive, with lazy loading and server components where appropriate.
*   **Maintainability:** Code should be clean, well-organized, and follow React best practices.

## 7. Future Considerations
*   **Live Vector Search:** Implement a real vector database and search mechanism to replace the current mocked search function for the "Ask" feature.
*   **Content Management:** Integrate a headless CMS or a more robust system for managing documentation content.
*   **User Accounts & Personalization:** Allow users to save history, bookmark topics, or customize their experience.