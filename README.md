# CIDBot — CI/CD Chatbot

> **HERE AND NOW AI** — *AI is Good*
> [hereandnowai.com](https://hereandnowai.com)

A frontend-only **React + TypeScript** chatbot that answers CI/CD questions using the
**`gemma-4-31b-it`** model through the Google AI Studio (Generative Language) API.
No backend, no server — the browser talks to the API directly.

---

## ✨ Features

- Focused CI/CD assistant: pipelines, GitHub Actions, GitLab CI, Jenkins, Docker, deploys, rollbacks, IaC
- Full conversation history sent on every turn, so follow-up questions keep context
- Starter prompt chips, typing indicator, inline error banner, one-click new chat
- Zero UI dependencies beyond React — plain CSS, dark theme
- Deployment-ready: reads the API key from an env var, so a CI pipeline can inject it at build time

## 🚀 Quick start

```bash
npm install
cp .env.example .env.local   # then paste your key
npm run dev
```

Get an API key at [aistudio.google.com/apikey](https://aistudio.google.com/apikey).

## Tests

Run the project's automated validation checks:

```bash
npm test
```

This runs the linter and a production TypeScript/Vite build.

## ⚙️ Environment variables

| Variable | Purpose | Default |
| --- | --- | --- |
| `VITE_GOOGLE_AI_API_KEY` | Google AI Studio key | *(required)* |
| `VITE_GEMMA_MODEL` | Model id | `gemma-4-31b-it` |

## ☁️ Deployment (added during class)

This repository intentionally ships **without** a CI/CD workflow — the pipeline is
built live as a classroom demonstration.

When the workflow is added, it will build the app and publish it to GitHub Pages,
reading the API key from a repository secret at build time:

1. **Settings → Secrets and variables → Actions → New repository secret**
   Name: `VITE_GOOGLE_AI_API_KEY`, value: your key.
2. **Settings → Pages → Source: GitHub Actions**.
3. Push to `main`.

[`vite.config.ts`](vite.config.ts) already reads a `BASE_PATH` env var so the build
works under `https://<user>.github.io/<repo>/` without further changes.

> ⚠️ **Security note:** because this is a frontend-only app, the key is compiled into
> the JavaScript bundle at build time and is readable by anyone who opens the deployed
> site. A GitHub secret keeps it out of the repo, not out of the browser. Restrict the
> key in Google Cloud (HTTP referrer + Generative Language API only), or add a small
> proxy if it needs to stay private.

## 🧱 Project structure

```
src/
├── lib/gemma.ts          API call, CI/CD system prompt, history mapping
├── components/
│   ├── ChatMessage.tsx   message bubble
│   └── ChatInput.tsx     composer (Enter sends, Shift+Enter newline)
├── App.tsx               chat state, send loop, error handling
└── types.ts              Message / Role types
```

**Note on the system prompt:** Gemma models on the Google AI Studio API do not accept a
`systemInstruction` field, so the CI/CD persona is prepended to the first user turn
instead — see [`src/lib/gemma.ts`](src/lib/gemma.ts).

## 🛠️ Tech stack

React 19 · TypeScript · Vite · Google AI Studio (Gemma)

## 📄 License

[MIT](LICENSE) © HERE AND NOW AI

---

<div align="center">

**HERE AND NOW AI** — *AI is Good*
[hereandnowai.com](https://hereandnowai.com) · [github.com/hereandnowai](https://github.com/hereandnowai)

</div>
