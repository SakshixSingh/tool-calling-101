#  AI Agent Web Chat & Summarization Platform

An AI-powered web application built using **Next.js, TypeScript, LangChain, Groq, and Gemini** that intelligently handles user queries through two different AI workflows:

-  **Web-Based AI Chat**
- **Direct AI Summarization**

The platform uses AI agents, routing logic, and web-search tools to generate contextual and real-time responses.

---

#  Features

## 🌐 Web-Based AI Chat
- AI agent with web search capability
- Real-time information retrieval
- Context-aware responses
- Dynamic routing for user queries

##  Direct Summarization
- Fast and clean summarization pipeline
- AI-generated concise summaries
- Optimized response flow

##  AI Agent Capabilities
- Tool calling support
- Web search integration
- LangChain workflows using LCEL
- Intelligent query routing
- Modular architecture

---

#  Tech Stack

| Technology | Purpose |
|---|---|
| Next.js | Full Stack Framework |
| TypeScript | Type Safety |
| LangChain | AI Orchestration |
| LCEL | LangChain Workflow Management |
| Groq API | Fast LLM Inference |
| Gemini API | AI Model Integration |
| shadcn/ui | UI Components |


---

#  Architecture Overview

```bash
                User Query
                     ↓
              Routing Layer
         ┌───────────┴───────────┐
         ↓                       ↓
 Web-Based Chat Path      Direct Summary Path
         ↓                       ↓
 AI Agent + Web Tool       Summarization Chain
         ↓                       ↓
 Contextual Response          Final Summary
```

---

#  Folder Structure

```bash
├── app/
├── components/
├── agents/
├── tools/
├── lib/
├── utils/
├── public/
├── styles/
└── types/
```

---

#  Installation

Clone the repository:

```bash
git clone https://github.com/SakshixSingh/tool-calling-101.git
```

Move into the project directory:

```bash
cd tool-calling-101
```

Install dependencies for frontend and backend:

```bash
# Frontend
cd frontend
npm install

# Backend
cd ../backend
npm install

---

# 🔑 Environment Variables

Create a `.env.local` file:

```env
GROQ_API_KEY=your_groq_api_key

GEMINI_API_KEY=your_gemini_api_key

```

Add additional API keys if using external web-search tools.

---

# Running the Project

## Start Frontend

```bash
cd frontend
npm run dev
```

## Start Backend

```bash
cd backend
npm run dev
```

---

#  AI Workflow

This project uses **LangChain Expression Language (LCEL)** and AI agent workflows for:

- Tool Calling
- Web Retrieval
- Query Routing
- Summarization Pipelines
- Multi-model Integration

---

# UI Highlights

- Modern responsive UI
- Built with **shadcn/ui**
- Clean developer-focused design


---

#  Future Improvements

- Memory-based conversations
- Multi-agent system
- Authentication
- Chat history persistence
- Streaming responses
- Voice interaction support

---


#  Author

## Sakshi Singh
UI/UX Designer • Full Stack Developer • AI Explorer

---

# ⭐ Support

If you liked this project, consider giving it a ⭐ on GitHub.
