import './components/MessageList/index.css';
import { ContextMenu } from './components/ContextMenu';
import { ConfirmDialog } from './components/ConfirmDialog';
import { MessageBubble } from './components/MessageBubble';
import { SelectModeBar } from './components/SelectModeBar';
import { MY_ID } from './constants';
import { useChatState } from './hooks/useChatState';
import { canRecall, formatLastTime, shouldShowDateDivider } from './utils/chat';

export default function App() {
  const {
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
    setContextMenu,
    setInput,
    setIsMultiMode,
    setSelectedIds,
    toggleSelect,
  } = useChatState();

  return (
    <div className="container">
      <aside className="sidebar">
        <div className="sidebarHeader">
          <div className="sidebarHeaderTitle">微信消息</div>
          <div className="sidebarHeaderMeta">{convs.length} 个会话</div>
        </div>

        <div className="conversationList">
          {convs.map((conv) => (
            <button
              key={conv.id}
              className={`conversation ${conv.id === activeId ? 'active' : ''}`}
              onClick={() => handleSelectConversation(conv.id)}
              type="button"
              aria-pressed={conv.id === activeId}
              aria-label={`打开会话 ${conv.name}`}
            >
              <div className="avatarWrap">
                <img src={conv.avatar} alt="" className="avatar" />
                {conv.unread > 0 && <div className="unreadBadge">{conv.unread}</div>}
              </div>

              <div className="convInfo">
                <div className="convMeta">
                  <span className="convName" style={{ fontWeight: conv.unread > 0 ? 'bold' : 'normal' }}>{conv.name}</span>
                  <span className="convTime">{conv.lastTime ? formatLastTime(conv.lastTime) : ''}</span>
                </div>
                <div className="convLastMsg">{conv.lastMsg}</div>
              </div>
            </button>
          ))}
        </div>
      </aside>

      <main className="chatArea">
        <div className="chatHeader">
          <div className="headerLeft">
            <div className="chatHeaderTitle">{activeConv?.name || '聊天'}</div>
            <div className="chatHeaderMeta">消息记录</div>
          </div>

          {isMultiMode ? (
            <button className="headerRight actionLink cancel" onClick={cancelMultiMode} type="button">取消</button>
          ) : (
            <button
              className="headerRight actionLink select"
              onClick={() => { setIsMultiMode(true); setSelectedIds([]); }}
              type="button"
            >
              多选
            </button>
          )}
        </div>

        <div ref={listRef} className="messageList" style={{ paddingBottom: isMultiMode ? '120px' : undefined }}>
          {activeConv?.messages.map((msg, index, messages) => (
            <MessageBubble
              key={msg.id}
              msg={msg}
              convAvatar={activeConv.avatar}
              convName={activeConv.name}
              isMultiMode={isMultiMode}
              selected={selectedIds.includes(msg.id)}
              showDateDivider={shouldShowDateDivider(messages, index)}
              onToggle={() => toggleSelect(msg.id)}
              onReEdit={handleReEdit}
              onContextMenu={(position) => setContextMenu({ x: position.x, y: position.y, msgId: msg.id })}
            />
          ))}

          {activeConv?.messages.length === 0 && <div className="emptyTip">暂无消息</div>}

          {isMultiMode && (
            <SelectModeBar
              count={selectedIds.length}
              onDelete={handleDeleteSelected}
              onCancel={cancelMultiMode}
            />
          )}
        </div>

        <div className="inputBar">
          <textarea
            className="msgInput"
            value={input}
            onChange={(event) => setInput(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === 'Enter' && !event.shiftKey) {
                event.preventDefault();
                handleSend();
              }
            }}
            placeholder="说点什么..."
            rows={1}
          />
          <button className="sendBtn" onClick={handleSend} disabled={!input.trim()} type="button">发送</button>
        </div>
      </main>

      {feedback && <div className="toast">{feedback}</div>}

      {contextMenu && activeConv && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onClose={() => setContextMenu(null)}
          onDelete={handleDelete}
          onCopy={() => { void handleCopy(); }}
          onRecall={handleRecall}
          showRecall={Boolean(
            activeConv.messages.find((message) => message.id === contextMenu.msgId && message.senderId === MY_ID && canRecall(message.timestamp)),
          )}
        />
      )}

      {confirmMsg && confirmAction && (
        <ConfirmDialog msg={confirmMsg} onConfirm={confirmAction} onCancel={resetConfirmDialog} />
      )}
    </div>
  );
}
