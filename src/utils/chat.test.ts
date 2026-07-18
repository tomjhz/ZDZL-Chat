import { describe, expect, it } from 'vitest';
import { MY_ID } from '../constants';
import type { Conversation } from '../types';
import {
  canRecall,
  deleteMessages,
  formatDateDivider,
  recallMessages,
  shouldShowDateDivider,
} from './chat';

const baseConversation: Conversation = {
  id: 'conv-1',
  name: '测试',
  avatar: 'avatar',
  lastMsg: '最后一条',
  lastTime: new Date('2026-07-16T10:05:00.000Z'),
  unread: 0,
  messages: [
    {
      id: 'm1',
      content: '昨天消息',
      senderId: 'user-1',
      timestamp: new Date('2026-07-15T23:59:00.000Z'),
      status: 'read',
    },
    {
      id: 'm2',
      content: '当前最后一条',
      senderId: MY_ID,
      timestamp: new Date('2026-07-16T10:05:00.000Z'),
      status: 'sent',
    },
  ],
};

describe('chat utils', () => {
  it('canRecall respects the five-minute window', () => {
    const timestamp = new Date('2026-07-16T10:00:00.000Z').getTime();
    expect(canRecall(new Date(timestamp), timestamp + 4 * 60 * 1000)).toBe(true);
    expect(canRecall(new Date(timestamp), timestamp + 5 * 60 * 1000)).toBe(false);
  });

  it('shouldShowDateDivider only opens a divider for the first message or date changes', () => {
    const messages = [
      {
        id: 'd1',
        content: '同一天第一条',
        senderId: 'user-1',
        timestamp: new Date('2026-07-16T00:10:00+12:00'),
        status: 'read' as const,
      },
      {
        id: 'd2',
        content: '同一天第二条',
        senderId: MY_ID,
        timestamp: new Date('2026-07-16T18:20:00+12:00'),
        status: 'read' as const,
      },
      {
        id: 'd3',
        content: '第二天',
        senderId: MY_ID,
        timestamp: new Date('2026-07-17T08:00:00+12:00'),
        status: 'read' as const,
      },
    ];
    expect(shouldShowDateDivider(messages, 0)).toBe(true);
    expect(shouldShowDateDivider(messages, 1)).toBe(false);
    expect(shouldShowDateDivider(messages, 2)).toBe(true);
  });

  it('formats day dividers for today, yesterday, and older dates', () => {
    const now = new Date('2026-07-16T12:00:00+12:00');
    expect(formatDateDivider(new Date('2026-07-16T08:00:00+12:00'), now)).toBe('今天');
    expect(formatDateDivider(new Date('2026-07-15T08:00:00+12:00'), now)).toBe('昨天');
    expect(formatDateDivider(new Date('2026-07-10T08:00:00+12:00'), now)).toBe('2026年7月10日');
  });

  it('deleteMessages refreshes the conversation preview', () => {
    const next = deleteMessages([baseConversation], 'conv-1', ['m2']);
    expect(next[0].messages).toHaveLength(1);
    expect(next[0].lastMsg).toBe('昨天消息');
    expect(next[0].lastTime?.toISOString()).toBe('2026-07-15T23:59:00.000Z');
  });

  it('recallMessages marks messages recalled and updates preview text', () => {
    const next = recallMessages([baseConversation], 'conv-1', ['m2']);
    expect(next[0].messages[1].recalled).toBe(true);
    expect(next[0].messages[1].recallText).toBe('当前最后一条');
    expect(next[0].lastMsg).toBe('你撤回了一条消息');
  });
});
