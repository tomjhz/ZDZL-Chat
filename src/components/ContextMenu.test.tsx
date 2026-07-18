import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { ContextMenu } from './ContextMenu';

describe('ContextMenu', () => {
  it('renders actions and closes after copy or delete', () => {
    const onClose = vi.fn();
    const onCopy = vi.fn();
    const onDelete = vi.fn();
    const onRecall = vi.fn();

    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 200 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 220 });

    const { container } = render(
      <ContextMenu
        x={190}
        y={210}
        onClose={onClose}
        onCopy={onCopy}
        onDelete={onDelete}
        onRecall={onRecall}
        showRecall={false}
      />,
    );

    expect(screen.queryByRole('button', { name: '撤回' })).not.toBeInTheDocument();

    fireEvent.click(screen.getByRole('button', { name: '复制' }));
    expect(onCopy).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);

    fireEvent.click(screen.getByRole('button', { name: '删除' }));
    expect(onDelete).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(2);

    fireEvent.click(container.querySelector('.contextBackdrop')!);
    expect(onClose).toHaveBeenCalledTimes(3);
  });

  it('renders recall action when recall is allowed', () => {
    const onClose = vi.fn();
    const onRecall = vi.fn();

    render(
      <ContextMenu
        x={40}
        y={50}
        onClose={onClose}
        onCopy={vi.fn()}
        onDelete={vi.fn()}
        onRecall={onRecall}
        showRecall
      />,
    );

    fireEvent.click(screen.getByRole('button', { name: '撤回' }));
    expect(onRecall).toHaveBeenCalledTimes(1);
    expect(onClose).toHaveBeenCalledTimes(1);
  });
});
