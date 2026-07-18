export type Status = 'sending' | 'sent' | 'delivered' | 'read' | 'error';

export interface Msg {
  id: string;
  content: string;
  senderId: string;
  timestamp: Date;
  status: Status;
  recalled?: boolean;
  recallText?: string;
}

export interface Conversation {
  id: string;
  name: string;
  avatar: string;
  lastMsg?: string;
  lastTime?: Date;
  unread: number;
  messages: Msg[];
}
