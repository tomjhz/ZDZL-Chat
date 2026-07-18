interface ContextMenuProps {
  x: number;
  y: number;
  onClose: () => void;
  onDelete: () => void;
  onCopy: () => void;
  onRecall: () => void;
  showRecall: boolean;
}

export function ContextMenu({
  x,
  y,
  onClose,
  onDelete,
  onCopy,
  onRecall,
  showRecall,
}: ContextMenuProps) {
  return (
    <>
      <div className="contextBackdrop" onClick={onClose} />
      <div
        className="contextMenu"
        style={{ left: Math.min(x, window.innerWidth - 160), top: Math.min(y, window.innerHeight - 180) }}
      >
        <button className="contextItem" onClick={() => { onCopy(); onClose(); }} type="button">复制</button>
        {showRecall && (
          <button className="contextItem" onClick={() => { onRecall(); onClose(); }} type="button">撤回</button>
        )}
        <button className="contextItem danger" onClick={() => { onDelete(); onClose(); }} type="button">删除</button>
      </div>
    </>
  );
}
