# VibeBuild Project Overview

## 1. Project Summary

VibeBuild is an AI-powered web app builder that takes a natural language prompt and generates a runnable React + Vite website project in the browser. It uses AI to interpret user requests, generate code, and render it live via an embedded code editor and preview.

The core value is: let a user describe a website idea, then automatically generate the frontend code and let the user inspect, edit, preview, and download the generated project.

---

## 2. What the project builds

This project builds a low-code / AI-assisted website generation platform with:

- A polished landing page with prompt input and UI suggestions.
- AI prompt enhancement to improve user requests.
- AI code generation that produces a React + Vite app scaffold.
- A workspace page with live code editing and preview.
- File export to ZIP.
- Persists generated files in a real-time backend store.

This is not a static brochure site only; it is a developer tool / generator for rapid frontend prototyping.

---

## 3. Tech stack

### Core Frameworks
- **Next.js 15** for app routing, API routes, and server rendering.
- **React 18** as the UI library.
- **Tailwind CSS** for styling and responsive design.

### Backend / State
- **Convex** for workspace persistence and query/mutation storage.
- **Next.js API routes** for AI endpoints.
- **OpenAI Node SDK** for AI-based prompt enhancement and code generation.

### UI / Editor
- **@codesandbox/sandpack-react** for an embedded live code editor and preview experience.
- **JSZip** for bundling generated project files into a downloadable zip.
- **Lucide React** for icons.

### Utilities
- `axios` for client-side API requests.
- `uuid` / `uuidv4` for unique IDs in some places.
- `tailwind-merge` for className composition.
- `react-markdown` for any markdown rendering if needed.

---

## 4. High-level architecture

### Pages and routing
- `app/page.js` renders the landing page with `Hero`.
- `app/workspace/[id]/page.jsx` renders the workspace page for a generated project.

### Providers
- `app/layout.js` wraps the UI in `ConvexClientProvider` and custom `Provider`.
- `app/provider.jsx` provides `MessagesContext` and theme support.
- `app/ConvexClientProvider.jsx` initializes `ConvexReactClient` using `NEXT_PUBLIC_CONVEX_URL`.

### Components
- `components/custom/Hero.jsx` is the main landing UI with prompt input, enhancement, and workspace creation.
- `components/custom/CodeView.jsx` is the workspace editor + preview experience.
- `components/custom/Header.jsx` renders the project header and branding.

### Data & prompts
- `data/Prompt.jsx` contains prompt templates used for AI chat and code generation.
- `data/Lookup.jsx` provides example suggestions, fallback default files, and dependency mappings.

---

## 5. AI flow / backend request flow

### 5.1 Prompt enhancement

1. User types a prompt on the landing page.
2. If they click enhance, `Hero.jsx` posts to `/api/enhance-prompt`.
3. `app/api/enhance-prompt/route.jsx` calls `enhancePrompt()` in `configs/AiModel.jsx`.
4. `configs/AiModel.jsx` uses OpenAI `chat.completions.create()` to rewrite the prompt clearly.
5. The enhanced prompt is returned to the UI.

### 5.2 Workspace creation

1. User clicks generate in `Hero.jsx`.
2. The app stores the prompt as a `user` message.
3. It calls the Convex mutation `api.workspace.CreateWorkspace`.
4. The app navigates to `/workspace/[workspaceId]`.

### 5.3 Code generation

1. On the workspace page, `CodeView.jsx` listens to `MessagesContext`.
2. When a new `user` message exists, it calls `generateAiCode()`.
3. `generateAiCode()` sends the prompt and schema instructions to `/api/gen-ai-code`.
4. `app/api/gen-ai-code/route.jsx` calls `generateCode()` from `configs/AiModel.jsx`.
5. AI returns a JSON object containing `projectTitle`, `explanation`, and `files`.
6. The workspace maps the returned files into Sandpack format.
7. The generated files are also persisted to Convex using `api.workspace.UpdateFiles`.

---

## 6. Code internals: important files

### `configs/AiModel.jsx`
This file is the AI integration layer:
- `sendChatMessage(prompt)` for generic chat responses.
- `enhancePrompt(prompt)` to rewrite and improve user prompts.
- `generateCode(prompt)` to request a full React + Vite project from OpenAI.
- `cleanJsonResponse(text)` strips markdown fences before parsing JSON.

### `data/Prompt.jsx`
Holds prompt templates and rules used by AI endpoints:
- `CHAT_PROMPT` for chat-style replies.
- `CODE_GEN_PROMPT` for generating full frontend projects.
- `ENHANCE_PROMPT_RULES` for prompt improvement.

### `components/custom/Hero.jsx`
Landing page UX:
- Text area for user prompt input.
- Enhance prompt button.
- Generate button to create a workspace.
- Suggestion cards from `Lookup.SUGGSTIONS`.
- Uses `MessagesContext` and Convex mutation to create the workspace.

### `components/custom/CodeView.jsx`
Workspace editor UX:
- Loads saved files from Convex.
- Uses Sandpack for live editing and preview.
- Calls `/api/gen-ai-code` when a new prompt arrives.
- Saves generated files back into the workspace store.
- Allows ZIP download with JSZip.

### `app/api/ai-chat/route.jsx`
Simple chat endpoint:
- Receives `prompt`.
- Calls `sendChatMessage()` in AI model config.
- Returns generated text.

### `app/api/enhance-prompt/route.jsx`
Prompt enhancement endpoint:
- Receives `prompt`.
- Calls `enhancePrompt()`.
- Returns enhanced prompt text.

### `app/api/gen-ai-code/route.jsx`
Code generation endpoint:
- Receives `prompt`.
- Calls `generateCode()`.
- Validates the returned object contains files.
- Returns the generated project JSON.

---

## 7. UI / UX flow

### Landing page
- Simple hero UI with a prompt editor.
- Buttons for enhancing the prompt and generating code.
- Example suggestions to inspire user input.

### Workspace page
- Two tabs: `code` and `preview`.
- `SandpackFileExplorer` displays generated files.
- `SandpackCodeEditor` allows direct editing.
- `SandpackPreview` shows the live running app.
- Download button exports the current workspace as a ZIP.

### Live update loop
- The user’s prompt triggers AI generation.
- Response is parsed and mapped into files.
- Sandpack rebuilds automatically.
- The backend saves the latest workspace state.

---

## 8. Database / persistence

The app uses **Convex** to persist workspace data. The flow is:
- `CreateWorkspace` stores the initial prompt/message list.
- `GetWorkspace` fetches the saved project file structure.
- `UpdateFiles` writes generated code back to the workspace.

This lets users leave the page and return to the same generated workspace.

---

## 9. Strengths of this project

- **AI-first workflow:** natural-language input drives code generation.
- **Live editing + preview:** users can immediately see generated frontend output.
- **Full-stack Next.js:** combines frontend React UI and backend AI routes.
- **Real-time persistence:** Convex stores generated workspaces.
- **Downloadable export:** user can take generated files offline.

---

## 10. Potential interview explanation flow

### Start with the problem statement
- "This project is an AI-assisted website generator. It lets users describe a website in natural language and automatically generates a runnable React + Vite project."

### Then explain the architecture
- "It is built with Next.js for frontend routing and backend API routes."
- "AI calls are handled in server-side API routes so the OpenAI key can stay secure."
- "Convex is used to save workspaces and generated files." 
- "Sandpack provides an in-browser code editor and preview." 

### Describe the user journey
1. User writes a prompt on the hero screen.
2. The prompt can be improved by `/api/enhance-prompt`.
3. The app creates a workspace and navigates to `/workspace/[id]`.
4. The workspace page triggers `/api/gen-ai-code` using current messages.
5. AI returns files; the editor displays them.
6. User can edit live and download a ZIP.

### Mention the main implementation challenges
- Ensuring AI returns valid JSON.
- Mapping AI-generated JSON into Sandpack file structures.
- Persisting generated workspace state.
- Building a stable UI experience around asynchronous AI responses.

### Finish with what you learned or would improve
- "I learned how to combine AI output with live editor tooling."  
- "A next improvement would be stronger validation for AI-generated JSON and more robust fallback handling."  
- "I could also add user authentication and workspace history." 

---

## 11. Interview questions likely to come up

### Architecture / stack
- Why did you choose Next.js for this project?
- Why use Convex instead of Firebase or Supabase?
- Why use Sandpack for the code editor?
- What is the difference between server routes and client components here?

### AI / backend
- How does the AI prompt flow work?
- How do you ensure the AI returns valid code instead of plain text?
- How do you handle bad or malformed AI output?
- How do you keep the API key secure?

### UI / frontend
- How does `MessagesContext` work?
- How does the live preview update after generation?
- Why did you use Tailwind CSS?
- How are prompts enhanced before generation?

### Scaling / improvements
- What would you add to make code generation more reliable?
- How would you support user authentication?
- How would you handle larger generated app projects?
- What would you do if the AI returned a broken file structure?

---

## 12. How to present this in an interview

### Elevator pitch
"VibeBuild is a Next.js app that turns natural language website ideas into actual frontend code. The user enters a prompt, AI generates a React + Vite project, and the app renders it inside a live editor with preview and download support."

### Key points to highlight
- Secure server-side AI integration.
- Real-time code editor and preview.
- Workflow from prompt -> AI -> generated files -> persistence.
- Practical use of modern tech: Next.js, Tailwind, OpenAI, Convex, Sandpack.

### Demo script
1. Show the landing page.
2. Enter a prompt and enhance it.
3. Generate workspace.
4. Show the generated code files and preview.
5. Download the project as ZIP.
6. Mention backend routes and persistence.

---

## 13. File responsibilities summary

- `app/page.js` — landing page container.
- `components/custom/Hero.jsx` — prompt entry, prompt enhancement, workspace creation.
- `components/custom/CodeView.jsx` — live code editor, preview, file download.
- `app/layout.js` — global wrapper with Convex provider and theme provider.
- `app/provider.jsx` — app-level context for message state and theme.
- `app/api/ai-chat/route.jsx` — generic AI chat endpoint.
- `app/api/enhance-prompt/route.jsx` — prompt improvement endpoint.
- `app/api/gen-ai-code/route.jsx` — code generation endpoint.
- `configs/AiModel.jsx` — OpenAI integration and response parsing.
- `data/Prompt.jsx` — AI prompt rules and schema requirements.
- `data/Lookup.jsx` — prompt suggestions, default starter file templates, dependency map.

---

## 14. Closing summary

VibeBuild is essentially a proof-of-concept AI dev tool: it demonstrates how to connect a modern frontend IDE-like UI with AI-generated code and a backend persistence layer. The implementation combines AI prompt handling, dynamic file generation, live editing, and downloadable export.

This document should help you explain both the end-user experience and the technical implementation cleanly.
