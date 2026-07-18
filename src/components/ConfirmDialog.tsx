interface ConfirmDialogProps {
  msg: string;
  onConfirm: () => void;
  onCancel: () => void;
}

export function ConfirmDialog({ msg, onConfirm, onCancel }: ConfirmDialogProps) {
  return (
    <>
      <div className="dialogOverlay" onClick={onCancel} />
      <div className="dialog" role="dialog" aria-modal="true">
        <p className="dialogMsg">{msg}</p>
        <div className="dialogBtns">
          <button className="dialogBtn cancel" onClick={onCancel} type="button">取消</button>
          <button className="dialogBtn confirm" onClick={onConfirm} type="button">确定</button>
        </div>
      </div>
    </>
  );
}
