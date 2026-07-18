import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { MESSAGE_READ_DELAY_MS, MESSAGE_SENT_DELAY_MS, MY_ID } from '../constants';
import { mockConversations } from '../data/mockConversations';
import type { Conversation, Msg } from '../types';
import { deleteMessages, genId, recallMessages } from '../utils/chat';

export function useChatState() {
  const [convs, setConvs] = useState<Conversation[]>(mockConversations);
  const [activeId, setActiveId] = useState('1');
  const [input, setInput] = useState('');
  const [feedback, setFeedback] = useState('');
  const [isMultiMode, setIsMultiMode] = useState(false);
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [confirmMsg, setConfirmMsg] = useState('');
  const [confirmAction, setConfirmAction] = useState<(() => void) | null>(null);
  const [contextMenu, setContextMenu] = useState<{ x: number; y: number; msgId: string } | null>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const feedbackTimerRef = useRef<number | null>(null);
  const messageTimerIdsRef = useRef<number[]>([]);

  const activeConv = useMemo(() => convs.find((conversation) => conversation.id === activeId), [convs, activeId]);

  const clearMessageTimers = useCallback(() => {
    messageTimerIdsRef.current.forEach((timerId) => window.clearTimeout(timerId));
    messageTimerIdsRef.current = [];
  }, []);

  const scheduleMessageTimer = useCallback((callback: () => void, delayMs: number) => {
    const timerId = window.setTimeout(() => {
      messageTimerIdsRef.current = messageTimerIdsRef.current.filter((id) => id !== timerId);
      callback();
    }, delayMs);
    messageTimerIdsRef.current.push(timerId);
  }, []);

  const resetConfirmDialog = useCallback(() => {
    setConfirmMsg('');
    setConfirmAction(null);
  }, []);

  const showFeedback = useCallback((message: string) => {
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    setFeedback(message);
    feedbackTimerRef.current = window.setTimeout(() => {
      setFeedback('');
      feedbackTimerRef.current = null;
    }, 1_500);
  }, []);

  const cancelMultiMode = useCallback(() => {
    setIsMultiMode(false);
    setSelectedIds([]);
  }, []);

  const handleSelectConversation = useCallback((nextId: string) => {
    setConvs((prev) => prev.map((conversation) => (
      conversation.id === nextId ? { ...conversation, unread: 0 } : conversation
    )));
    setActiveId(nextId);
    cancelMultiMode();
  }, [cancelMultiMode]);

  const handleSend = useCallback(() => {
    const nextContent = input.trim();
    if (!nextContent || !activeConv) return;

    const msg: Msg = {
      id: genId(),
      content: nextContent,
      senderId: MY_ID,
      timestamp: new Date(),
      status: 'sending',
    };

    setConvs((prev) => prev.map((conversation) => (
      conversation.id === activeId
        ? {
          ...conversation,
          lastMsg: msg.content,
          lastTime: msg.timestamp,
          messages: [...conversation.messages, msg],
        }
        : conversation
    )));

    setInput('');
    const msgId = msg.id;
    const convId = activeId;

    scheduleMessageTimer(() => {
      setConvs((prev) => prev.map((conversation) => (
        conversation.id === convId
          ? {
            ...conversation,
            messages: conversation.messages.map((message) => (
              message.id === msgId ? { ...message, status: 'sent' } : message
            )),
          }
          : conversation
      )));
    }, MESSAGE_SENT_DELAY_MS);

    scheduleMessageTimer(() => {
      setConvs((prev) => prev.map((conversation) => (
        conversation.id === convId
          ? {
            ...conversation,
            messages: conversation.messages.map((message) => (
              message.id === msgId ? { ...message, status: 'read' } : message
            )),
          }
          : conversation
      )));
    }, MESSAGE_READ_DELAY_MS);
  }, [activeConv, activeId, input, scheduleMessageTimer]);

  const toggleSelect = useCallback((msgId: string) => {
    setSelectedIds((prev) => (
      prev.includes(msgId) ? prev.filter((id) => id !== msgId) : [...prev, msgId]
    ));
  }, []);

  const handleCopy = useCallback(async () => {
    if (!contextMenu || !activeConv) return;

    const msg = activeConv.messages.find((message) => message.id === contextMenu.msgId);
    if (!msg) return;

    try {
      await navigator.clipboard.writeText(msg.content);
      showFeedback('已复制');
    } catch {
      showFeedback('复制失败，请检查浏览器权限');
    }
  }, [activeConv, contextMenu, showFeedback]);

  const handleDelete = useCallback(() => {
    if (!contextMenu) return;
    setConfirmMsg('是否删除该消息？');
    setConfirmAction(() => () => {
      setConvs((prev) => deleteMessages(prev, activeId, [contextMenu.msgId]));
      setContextMenu(null);
      resetConfirmDialog();
    });
  }, [activeId, contextMenu, resetConfirmDialog]);

  const handleRecall = useCallback(() => {
    if (!contextMenu) return;
    setConfirmMsg('是否撤回该消息？');
    setConfirmAction(() => () => {
      setConvs((prev) => recallMessages(prev, activeId, [contextMenu.msgId]));
      setContextMenu(null);
      resetConfirmDialog();
    });
  }, [activeId, contextMenu, resetConfirmDialog]);

  const handleDeleteSelected = useCallback(() => {
    setConfirmMsg(`是否删除 ${selectedIds.length} 条消息？`);
    setConfirmAction(() => () => {
      setConvs((prev) => deleteMessages(prev, activeId, selectedIds));
      cancelMultiMode();
      resetConfirmDialog();
    });
  }, [activeId, cancelMultiMode, resetConfirmDialog, selectedIds]);

  const handleReEdit = useCallback((text: string) => {
    setInput(text);
  }, []);

  useEffect(() => {
    if (listRef.current) {
      listRef.current.scrollTop = listRef.current.scrollHeight;
    }
  }, [activeConv?.messages, selectedIds]);

  useEffect(() => () => {
    if (feedbackTimerRef.current !== null) {
      window.clearTimeout(feedbackTimerRef.current);
    }
    clearMessageTimers();
  }, [clearMessageTimers]);

  return {
    activeConv,
    activeId,
    confirmAction,
    confirmMsg,
    contextMenu,
    convs,
    feedback,
    input,
    isMultiMode,
    listRef,
    selectedIds,
    cancelMultiMode,
    handleCopy,
    handleDelete,
    handleDeleteSelected,
    handleReEdit,
    handleRecall,
    handleSelectConversation,
    handleSend,
    resetConfirmDialog,
    setConfirmAction,
    setConfirmMsg,
    setContextMenu,
    setInput,
    setIsMultiMode,
    setSelectedIds,
    toggleSelect,
  };
}
