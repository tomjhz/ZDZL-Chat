interface SelectModeBarProps {
  count: number;
  onDelete: () => void;
  onCancel: () => void;
}

export function SelectModeBar({ count, onDelete, onCancel }: SelectModeBarProps) {
  return (
    <div className="bottomBar">
      <button className="bottomBtn" onClick={onCancel} type="button">取消</button>
      <button
        className={`bottomBtn ${count > 0 ? 'danger' : ''}`}
        onClick={onDelete}
        disabled={count === 0}
        type="button"
      >
        删除{count > 0 ? ` (${count})` : ''}
      </button>
    </div>
  );
}
