import { fireEvent, render, screen } from '@testing-library/react';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { MY_ID } from '../constants';
import type { Msg } from '../types';
import { MessageBubble } from './MessageBubble';

const incomingMessage: Msg = {
  id: 'incoming-1',
  content: '来自朋友的消息',
  senderId: 'user-1',
  timestamp: new Date('2026-07-16T09:30:00.000Z'),
  status: 'read',
};

describe('MessageBubble', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('opens the context menu on right click and via long press', () => {
    const onContextMenu = vi.fn();
    const { container } = render(
      <MessageBubble
        msg={incomingMessage}
        convAvatar="avatar"
        convName="朋友"
        isMultiMode={false}
        selected={false}
        showDateDivider
        onToggle={vi.fn()}
        onReEdit={vi.fn()}
        onContextMenu={onContextMenu}
      />,
    );

    expect(screen.getByText('朋友')).toBeInTheDocument();
    expect(container.querySelector('.dateDividerText')).toBeTruthy();

    const bubble = container.querySelector('.messageBubble')!;
    fireEvent.contextMenu(bubble, { clientX: 120, clientY: 180 });
    expect(onContextMenu).toHaveBeenCalledWith({ x: 120, y: 180 });

    fireEvent.touchStart(bubble, {
      touches: [{ clientX: 32, clientY: 48 }],
    });
    vi.advanceTimersByTime(500);
    expect(onContextMenu).toHaveBeenCalledWith({ x: 32, y: 48 });

    fireEvent.contextMenu(bubble, { clientX: 10, clientY: 10 });
    expect(onContextMenu).toHaveBeenCalledTimes(2);
  });

  it('supports selection and recalled-message re-edit', () => {
    const onToggle = vi.fn();
    const onReEdit = vi.fn();

    const { rerender } = render(
      <MessageBubble
        msg={incomingMessage}
        convAvatar="avatar"
        convName="朋友"
        isMultiMode
        selected
        showDateDivider={false}
        onToggle={onToggle}
        onReEdit={vi.fn()}
        onContextMenu={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '选择消息 incoming-1' }));
    expect(onToggle).toHaveBeenCalledTimes(1);

    rerender(
      <MessageBubble
        msg={{
          id: 'own-recalled',
          content: '原始消息',
          senderId: MY_ID,
          timestamp: new Date('2026-07-16T09:35:00.000Z'),
          status: 'read',
          recalled: true,
          recallText: '可重新编辑的内容',
        }}
        convAvatar="avatar"
        convName="我"
        isMultiMode={false}
        selected={false}
        showDateDivider={false}
        onToggle={vi.fn()}
        onReEdit={onReEdit}
        onContextMenu={vi.fn()}
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '重新编辑' }));
    expect(onReEdit).toHaveBeenCalledWith('可重新编辑的内容');
    expect(screen.getByText('你撤回了一条消息')).toBeInTheDocument();
  });

  it('does not open the menu for recalled or multi-select messages', () => {
    const onContextMenu = vi.fn();
    const { container, rerender } = render(
      <MessageBubble
        msg={incomingMessage}
        convAvatar="avatar"
        convName="朋友"
        isMultiMode
        selected={false}
        showDateDivider={false}
        onToggle={vi.fn()}
        onReEdit={vi.fn()}
        onContextMenu={onContextMenu}
      />,
    );

    fireEvent.contextMenu(container.querySelector('.messageBubble')!, { clientX: 5, clientY: 6 });
    expect(onContextMenu).not.toHaveBeenCalled();

    rerender(
      <MessageBubble
        msg={{ ...incomingMessage, recalled: true }}
        convAvatar="avatar"
        convName="朋友"
        isMultiMode={false}
        selected={false}
        showDateDivider={false}
        onToggle={vi.fn()}
        onReEdit={vi.fn()}
        onContextMenu={onContextMenu}
      />,
    );

    expect(container.querySelector('.messageBubble')).toBeNull();
  });
});
