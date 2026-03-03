import { useState } from 'react';
import { ArrowLeft, Send } from 'lucide-react';
import CategoryBadge from '@/components/CategoryBadge';
import type { Category } from '@/lib/constants';

interface Chat {
  id: string;
  username: string;
  category: Category;
  lastMessage: string;
  time: string;
  unread: boolean;
}

const DUMMY_CHATS: Chat[] = [
  { id: '1', username: 'arjun_k', category: 'urgent', lastMessage: "I'm near Whitefield, can bring fuel!", time: '2m', unread: true },
  { id: '2', username: 'priya_m', category: 'carpool', lastMessage: "Yes I'm heading that way at 9:15", time: '8m', unread: false },
  { id: '3', username: 'sneha_r', category: 'emergency', lastMessage: 'Found him near the park!', time: '15m', unread: true },
];

interface Message {
  id: string;
  text: string;
  isMine: boolean;
  time: string;
}

export default function ChatList() {
  const [activeChat, setActiveChat] = useState<Chat | null>(null);
  const [newMsg, setNewMsg] = useState('');
  const [messages, setMessages] = useState<Message[]>([
    { id: '1', text: 'Hey, I saw your request. I can help!', isMine: true, time: '2:30 PM' },
    { id: '2', text: 'Oh amazing! Where are you right now?', isMine: false, time: '2:31 PM' },
    { id: '3', text: "I'm about 400m from the Whitefield signal. Be there in 5 mins.", isMine: true, time: '2:32 PM' },
  ]);

  const handleSend = () => {
    if (!newMsg.trim()) return;
    setMessages([...messages, { id: Date.now().toString(), text: newMsg, isMine: true, time: 'now' }]);
    setNewMsg('');
  };

  if (activeChat) {
    return (
      <div className="flex min-h-screen flex-col pb-20">
        {/* Chat Header */}
        <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl px-4 py-3">
          <div className="flex items-center gap-3">
            <button onClick={() => setActiveChat(null)} className="text-muted-foreground">
              <ArrowLeft className="h-5 w-5" />
            </button>
            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/20 text-sm font-bold text-primary">
              {activeChat.username.charAt(0).toUpperCase()}
            </div>
            <div>
              <span className="text-sm font-semibold">{activeChat.username}</span>
              <div className="flex items-center gap-1">
                <CategoryBadge category={activeChat.category} />
              </div>
            </div>
          </div>
        </header>

        {/* Request Banner */}
        <div className="mx-4 mt-3 rounded-lg border border-primary/20 bg-primary/5 px-3 py-2 text-xs text-foreground/80">
          🚨 <span className="font-medium">Original request:</span> Ran out of fuel near Whitefield signal...
        </div>

        {/* Messages */}
        <div className="flex-1 space-y-3 px-4 pt-4">
          {messages.map((msg) => (
            <div key={msg.id} className={`flex ${msg.isMine ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[75%] rounded-2xl px-3.5 py-2 text-sm ${
                msg.isMine
                  ? 'bg-primary text-primary-foreground rounded-br-md'
                  : 'bg-card text-foreground rounded-bl-md'
              }`}>
                <p>{msg.text}</p>
                <span className={`mt-1 block text-[10px] ${msg.isMine ? 'text-primary-foreground/60' : 'text-muted-foreground'}`}>
                  {msg.time}
                </span>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="sticky bottom-20 border-t border-border bg-background px-4 py-3">
          <div className="flex gap-2">
            <input
              value={newMsg}
              onChange={(e) => setNewMsg(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              placeholder="Type a message..."
              className="flex-1 rounded-xl border border-border bg-card px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none"
            />
            <button
              onClick={handleSend}
              className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary text-primary-foreground"
            >
              <Send className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen pb-24">
      <header className="sticky top-0 z-40 border-b border-border bg-background/90 backdrop-blur-xl px-4 py-3">
        <h1 className="font-heading text-lg font-bold">Chats</h1>
      </header>
      <div className="mx-auto max-w-md">
        {DUMMY_CHATS.map((chat) => (
          <button
            key={chat.id}
            onClick={() => setActiveChat(chat)}
            className="flex w-full items-center gap-3 border-b border-border px-4 py-3.5 text-left transition-colors hover:bg-card"
          >
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/20 font-heading text-sm font-bold text-primary">
              {chat.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold">{chat.username}</span>
                <span className="text-[10px] text-muted-foreground">{chat.time}</span>
              </div>
              <div className="flex items-center gap-2">
                <CategoryBadge category={chat.category} />
                <p className="truncate text-xs text-muted-foreground">{chat.lastMessage}</p>
              </div>
            </div>
            {chat.unread && <div className="h-2 w-2 rounded-full bg-primary" />}
          </button>
        ))}
      </div>
    </div>
  );
}
