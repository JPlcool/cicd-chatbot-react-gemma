import { useEffect, useRef, useState } from 'react';
import ChatInput from './components/ChatInput';
import ChatMessage from './components/ChatMessage';
import { activeModel, askGemma } from './lib/gemma';
import type { Message } from './types';
import './App.css';

const SUGGESTIONS = [
  'Write a GitHub Actions workflow that runs tests on every PR',
  'How do I cache node_modules between CI runs?',
  'Explain blue/green vs canary deployment',
  'How should I store deploy secrets safely?',
];

function newId() {
  return Math.random().toString(36).slice(2);
}

export default function App() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  async function send(text: string) {
    const history = [...messages, { id: newId(), role: 'user' as const, text }];
    setMessages(history);
    setLoading(true);
    setError(null);

    try {
      const reply = await askGemma(history);
      setMessages([...history, { id: newId(), role: 'model', text: reply }]);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="app">
      <header className="header">
        <div>
          <h1 className="header__title">CIDBot</h1>
          <p className="header__subtitle">A CI/CD assistant powered by {activeModel}</p>
        </div>
        {messages.length > 0 && (
          <button className="header__reset" onClick={() => { setMessages([]); setError(null); }}>
            New chat
          </button>
        )}
      </header>

      <main className="thread">
        {messages.length === 0 && !loading && (
          <div className="empty">
            <p className="empty__lead">Ask me anything about building, testing, and shipping software.</p>
            <div className="empty__chips">
              {SUGGESTIONS.map((suggestion) => (
                <button key={suggestion} className="chip" onClick={() => send(suggestion)}>
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        )}

        {messages.map((message) => (
          <ChatMessage key={message.id} message={message} />
        ))}

        {loading && (
          <div className="msg msg--model">
            <span className="msg__who">CIDBot</span>
            <div className="msg__bubble msg__bubble--typing">
              <span /><span /><span />
            </div>
          </div>
        )}

        {error && <p className="error">{error}</p>}
        <div ref={bottomRef} />
      </main>

      <ChatInput disabled={loading} onSend={send} />
    </div>
  );
}
