import type { Message } from '../types';

const API_KEY = import.meta.env.VITE_GOOGLE_AI_API_KEY as string | undefined;
const MODEL = (import.meta.env.VITE_GEMMA_MODEL as string | undefined) ?? 'gemma-4-31b-it';

const ENDPOINT = 'https://generativelanguage.googleapis.com/v1beta/models';

/**
 * Gemma models on the Google AI Studio API do NOT accept a `systemInstruction`
 * field, so the persona is prepended to the first user turn instead.
 */
const SYSTEM_PROMPT = `You are CIDBot, a focused assistant for CI/CD questions.
You help with continuous integration and continuous delivery: pipelines, GitHub Actions,
GitLab CI, Jenkins, CircleCI, Docker builds, artifact registries, testing stages,
environments, secrets handling, blue/green and canary deploys, rollbacks, and IaC.

Rules:
- Answer concisely in markdown-free plain text with short paragraphs or dashes.
- Prefer concrete, copy-pasteable config snippets when a config is asked for.
- If a question is unrelated to CI/CD or software delivery, say so in one line and
  offer the closest CI/CD topic you can help with.`;

interface GeminiPart {
  text?: string;
}

interface GeminiResponse {
  candidates?: Array<{
    content?: { parts?: GeminiPart[] };
    finishReason?: string;
  }>;
  promptFeedback?: { blockReason?: string };
  error?: { message?: string };
}

/** Turns local chat history into the `contents` array the API expects. */
function buildContents(history: Message[]) {
  return history.map((message, index) => ({
    role: message.role,
    parts: [
      {
        text: index === 0 ? `${SYSTEM_PROMPT}\n\nUser question: ${message.text}` : message.text,
      },
    ],
  }));
}

export async function askGemma(history: Message[], signal?: AbortSignal): Promise<string> {
  if (!API_KEY) {
    throw new Error('Missing VITE_GOOGLE_AI_API_KEY. Add it to .env.local and restart the dev server.');
  }

  const response = await fetch(`${ENDPOINT}/${MODEL}:generateContent`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-goog-api-key': API_KEY,
    },
    body: JSON.stringify({
      contents: buildContents(history),
      generationConfig: {
        temperature: 0.4,
        maxOutputTokens: 1024,
      },
    }),
    signal,
  });

  const data = (await response.json()) as GeminiResponse;

  if (!response.ok) {
    throw new Error(data.error?.message ?? `Request failed with status ${response.status}`);
  }

  if (data.promptFeedback?.blockReason) {
    throw new Error(`Request was blocked: ${data.promptFeedback.blockReason}`);
  }

  const text = data.candidates?.[0]?.content?.parts?.map((part) => part.text ?? '').join('').trim();

  if (!text) {
    throw new Error('The model returned an empty response.');
  }

  return text;
}

export const activeModel = MODEL;
