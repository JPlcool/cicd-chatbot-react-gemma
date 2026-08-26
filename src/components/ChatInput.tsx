import { useState, type FormEvent, type KeyboardEvent } from 'react';

interface Props {
  disabled: boolean;
  onSend: (text: string) => void;
}

export default function ChatInput({ disabled, onSend }: Props) {
  const [value, setValue] = useState('');

  function submit(event: FormEvent) {
    event.preventDefault();
    const text = value.trim();
    if (!text || disabled) return;
    onSend(text);
    setValue('');
  }

  // Enter sends, Shift+Enter adds a newline.
  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === 'Enter' && !event.shiftKey) {
      submit(event);
    }
  }

  return (
    <form className="composer" onSubmit={submit}>
      <textarea
        className="composer__input"
        placeholder="Ask about pipelines, deploys, GitHub Actions…"
        rows={1}
        value={value}
        disabled={disabled}
        onChange={(event) => setValue(event.target.value)}
        onKeyDown={handleKeyDown}
      />
      <button className="composer__send" type="submit" disabled={disabled || !value.trim()}>
        Send
      </button>
    </form>
  );
}
