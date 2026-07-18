import { useEffect, useRef } from 'react';
import { LONG_PRESS_DELAY_MS, MY_AVATAR, MY_ID } from '../constants';
import type { Msg } from '../types';
import { formatDateDivider, timeFormat } from '../utils/chat';

interface MessageBubbleProps {
  msg: Msg;
  convAvatar: string;
  convName: string;
  isMultiMode: boolean;
  selected: boolean;
  showDateDivider: boolean;
  onToggle: () => void;
  onReEdit: (text: string) => void;
  onContextMenu: (position: { x: number; y: number }) => void;
}

export function MessageBubble({
  msg,
  convAvatar,
  convName,
  isMultiMode,
  selected,
  showDateDivider,
  onToggle,
  onReEdit,
  onContextMenu,
}: MessageBubbleProps) {
  const isOwn = msg.senderId === MY_ID;
  const longPressTimer = useRef<number | null>(null);
  const suppressContextMenuRef = useRef(false);

  const clearLongPressTimer = () => {
    if (longPressTimer.current !== null) {
      clearTimeout(longPressTimer.current);
      longPressTimer.current = null;
    }
  };

  const openMenu = (x: number, y: number) => {
    if (msg.recalled || isMultiMode) return;
    onContextMenu({ x, y });
  };

  const handleMouseDown = (event: React.MouseEvent) => {
    if (event.button !== 0 || isMultiMode || msg.recalled) return;
    longPressTimer.current = window.setTimeout(() => {
      openMenu(event.clientX, event.clientY);
    }, LONG_PRESS_DELAY_MS);
  };

  const handleTouchStart = (event: React.TouchEvent) => {
    if (isMultiMode || msg.recalled) return;
    const touch = event.touches[0];
    if (!touch) return;
    longPressTimer.current = window.setTimeout(() => {
      suppressContextMenuRef.current = true;
      openMenu(touch.clientX, touch.clientY);
    }, LONG_PRESS_DELAY_MS);
  };

  const handleBubbleContextMenu = (event: React.MouseEvent) => {
    event.preventDefault();
    if (suppressContextMenuRef.current) {
      suppressContextMenuRef.current = false;
      return;
    }
    openMenu(event.clientX, event.clientY);
  };

  useEffect(() => clearLongPressTimer, []);

  return (
    <>
      {showDateDivider && (
        <div className="dateDivider">
          <span className="dateDividerText">{formatDateDivider(msg.timestamp)}</span>
        </div>
      )}

      <div className={`messageItem ${isOwn ? 'own' : ''} ${msg.recalled ? 'recalled' : ''}`}>
        {isMultiMode && !msg.recalled && (
          <button
            className={`selectCircle ${selected ? 'selected' : ''}`}
            onClick={onToggle}
            type="button"
            aria-pressed={selected}
            aria-label={`选择消息 ${msg.id}`}
          >
            {selected ? '✓' : ''}
          </button>
        )}

        {!isOwn && <img src={convAvatar} alt="" className="msgAvatar" />}

        <div className="msgContent">
          {!isOwn && !msg.recalled && <div className="senderName">{convName}</div>}

          {msg.recalled ? (
            <div className="recallTip">
              <span>{isOwn ? '你撤回了一条消息' : '对方撤回了一条消息'}</span>
              {isOwn && (
                <button className="recallLink" onClick={() => onReEdit(msg.recallText || '')} type="button">
                  重新编辑
                </button>
              )}
            </div>
          ) : (
            <div
              className={`messageBubble ${isOwn ? 'own' : ''}`}
              onContextMenu={handleBubbleContextMenu}
              onMouseDown={handleMouseDown}
              onMouseUp={clearLongPressTimer}
              onMouseLeave={clearLongPressTimer}
              onTouchStart={handleTouchStart}
              onTouchEnd={clearLongPressTimer}
              onTouchCancel={clearLongPressTimer}
            >
              <div className="messageText">{msg.content}</div>
              <div className="msgMeta">
                <span className="msgTime">{timeFormat(msg.timestamp)}</span>
                {isOwn && (
                  <span className={`msgStatus ${msg.status === 'read' ? 'read' : ''}`}>
                    {msg.status === 'sending' ? '...' : msg.status === 'sent' ? '✓' : '✓✓'}
                  </span>
                )}
              </div>
            </div>
          )}
        </div>

        {isOwn && !msg.recalled && <img src={MY_AVATAR} alt="" className="msgAvatar own" />}
      </div>
    </>
  );
}
