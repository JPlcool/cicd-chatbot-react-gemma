import type { Message } from '../types';

interface Props {
  message: Message;
}

export default function ChatMessage({ message }: Props) {
  return (
    <div className={`msg msg--${message.role}`}>
      <span className="msg__who">{message.role === 'user' ? 'You' : 'CIDBot'}</span>
      <div className="msg__bubble">{message.text}</div>
    </div>
  );
}
