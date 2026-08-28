import type { Message } from '../types';

interface Props {
  message: Message;
}

const BOT_AVATAR = 'https://raw.githubusercontent.com/hereandnowai/images/refs/heads/main/logos/caramel-face.jpeg';

export default function ChatMessage({ message }: Props) {
  const isUser = message.role === 'user';

  return (
    <div className={`msg msg--${message.role}`}>
      <span className="msg__who">
        {!isUser && <img className="msg__avatar" src={BOT_AVATAR} alt="" />}
        {isUser ? 'You' : 'CIDBot'}
      </span>
      <div className="msg__bubble">{message.text}</div>
    </div>
  );
}
