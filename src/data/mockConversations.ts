import { MY_ID } from '../constants';
import type { Conversation } from '../types';

export const mockConversations: Conversation[] = [
  {
    id: '1',
    name: '小王',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=小王&backgroundColor=ff6b6b',
    lastMsg: '好的 那到时候见',
    lastTime: new Date(Date.now() - 1_200_000),
    unread: 0,
    messages: [
      { id: '1-1', content: '大家晚上好', senderId: 'user1', timestamp: new Date(Date.now() - 27 * 60 * 60 * 1_000), status: 'read' },
      { id: '1-2', content: '晚上好', senderId: MY_ID, timestamp: new Date(Date.now() - 26.5 * 60 * 60 * 1_000), status: 'read' },
      { id: '1-3', content: '今天吃什么', senderId: 'user1', timestamp: new Date(Date.now() - 50 * 60 * 1_000), status: 'read' },
      { id: '1-4', content: '火锅怎么样', senderId: MY_ID, timestamp: new Date(Date.now() - 45 * 60 * 1_000), status: 'read' },
      { id: '1-5', content: '可以啊 门口那家 这次我想早点到，顺便把上次说的那份资料也带给你。', senderId: 'user1', timestamp: new Date(Date.now() - 40 * 60 * 1_000), status: 'read' },
      { id: '1-6', content: '几点集合', senderId: MY_ID, timestamp: new Date(Date.now() - 35 * 60 * 1_000), status: 'read' },
      { id: '1-7', content: '七点吧', senderId: 'user1', timestamp: new Date(Date.now() - 30 * 60 * 1_000), status: 'read' },
      { id: '1-8', content: '好的 那到时候见', senderId: 'user1', timestamp: new Date(Date.now() - 20 * 60 * 1_000), status: 'read' },
    ],
  },
  {
    id: '2',
    name: '小红',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=小红&backgroundColor=4ecdc4',
    lastMsg: '明天见',
    lastTime: new Date(Date.now() - 2 * 60 * 60 * 1_000),
    unread: 2,
    messages: [
      { id: '2-1', content: '在吗', senderId: 'user2', timestamp: new Date(Date.now() - 3 * 60 * 60 * 1_000), status: 'read' },
      { id: '2-2', content: '在的 怎么了', senderId: MY_ID, timestamp: new Date(Date.now() - 2.97 * 60 * 60 * 1_000), status: 'read' },
      { id: '2-3', content: '借我100块钱', senderId: 'user2', timestamp: new Date(Date.now() - 2.94 * 60 * 60 * 1_000), status: 'read' },
      { id: '2-4', content: '...', senderId: MY_ID, timestamp: new Date(Date.now() - 2.91 * 60 * 60 * 1_000), status: 'read' },
      { id: '2-5', content: '开玩笑的啦', senderId: 'user2', timestamp: new Date(Date.now() - 2.1 * 60 * 60 * 1_000), status: 'read' },
      { id: '2-6', content: '明天见', senderId: 'user2', timestamp: new Date(Date.now() - 2 * 60 * 60 * 1_000), status: 'read' },
    ],
  },
  {
    id: '3',
    name: '老张',
    avatar: 'https://api.dicebear.com/7.x/initials/svg?seed=老张&backgroundColor=ffe66d',
    lastMsg: '周末有空吗',
    lastTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1_000),
    unread: 0,
    messages: [
      { id: '3-1', content: '最近忙吗', senderId: 'user3', timestamp: new Date(Date.now() - 2.2 * 24 * 60 * 60 * 1_000), status: 'read' },
      { id: '3-2', content: '还好 怎么了', senderId: MY_ID, timestamp: new Date(Date.now() - 2.15 * 24 * 60 * 60 * 1_000), status: 'read' },
      { id: '3-3', content: '周末有空吗', senderId: 'user3', timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1_000), status: 'read' },
    ],
  },
];
