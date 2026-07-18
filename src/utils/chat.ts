import { MY_ID, RECALL_WINDOW_MS } from '../constants';
import type { Conversation, Msg } from '../types';

export function genId(): string {
  return Date.now().toString() + Math.random().toString(36).slice(2);
}

export function timeFormat(date: Date): string {
  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
}

function isSameDay(left: Date, right: Date): boolean {
  return left.getFullYear() === right.getFullYear()
    && left.getMonth() === right.getMonth()
    && left.getDate() === right.getDate();
}

export function formatLastTime(date: Date, now = new Date()): string {
  const diff = now.getTime() - date.getTime();
  if (diff < 60_000) return '刚刚';
  if (diff < 60 * 60 * 1_000) return `${Math.floor(diff / 60_000)}分钟前`;
  if (isSameDay(date, now)) return timeFormat(date);
  return `${date.getMonth() + 1}/${date.getDate()}`;
}

export function canRecall(timestamp: Date, now = Date.now()): boolean {
  return now - timestamp.getTime() < RECALL_WINDOW_MS;
}

export function formatDateDivider(date: Date, now = new Date()): string {
  if (isSameDay(date, now)) return '今天';

  const yesterday = new Date(now);
  yesterday.setDate(now.getDate() - 1);
  if (isSameDay(date, yesterday)) return '昨天';

  return `${date.getFullYear()}年${date.getMonth() + 1}月${date.getDate()}日`;
}

export function shouldShowDateDivider(messages: Msg[], index: number): boolean {
  if (index === 0) return true;
  return !isSameDay(messages[index - 1].timestamp, messages[index].timestamp);
}

function getConversationPreview(messages: Msg[]): Pick<Conversation, 'lastMsg' | 'lastTime'> {
  const lastMessage = messages[messages.length - 1];
  if (!lastMessage) {
    return {
      lastMsg: '',
      lastTime: undefined,
    };
  }

  if (lastMessage.recalled) {
    return {
      lastMsg: lastMessage.senderId === MY_ID ? '你撤回了一条消息' : '对方撤回了一条消息',
      lastTime: lastMessage.timestamp,
    };
  }

  return {
    lastMsg: lastMessage.content,
    lastTime: lastMessage.timestamp,
  };
}

export function deleteMessages(conversations: Conversation[], convId: string, msgIds: string[]): Conversation[] {
  return conversations.map((conversation) => {
    if (conversation.id !== convId) return conversation;

    const messages = conversation.messages.filter((message) => !msgIds.includes(message.id));
    return {
      ...conversation,
      ...getConversationPreview(messages),
      messages,
    };
  });
}

export function recallMessages(conversations: Conversation[], convId: string, msgIds: string[]): Conversation[] {
  return conversations.map((conversation) => {
    if (conversation.id !== convId) return conversation;

    const messages: Msg[] = conversation.messages.map((message) => {
      if (!msgIds.includes(message.id)) return message;
      return {
        ...message,
        recalled: true,
        recallText: message.content,
        content: '',
        status: 'read' as const,
      };
    });

    return {
      ...conversation,
      ...getConversationPreview(messages),
      messages,
    };
  });
}
