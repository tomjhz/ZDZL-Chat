import { act, fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import App from './App';

describe('App interactions', () => {
  beforeEach(() => {
    Object.defineProperty(window, 'innerWidth', { configurable: true, value: 1200 });
    Object.defineProperty(window, 'innerHeight', { configurable: true, value: 900 });
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockResolvedValue(undefined),
      },
    });
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('sends a message and clears the input', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('说点什么...');
    await user.type(input, '新的消息');
    await user.click(screen.getByRole('button', { name: '发送' }));

    expect(screen.getAllByText('新的消息')).toHaveLength(2);
    expect(input).toHaveValue('');
  });

  it('updates message status from sending to sent to read', async () => {
    vi.useFakeTimers();
    const { container } = render(<App />);

    const input = screen.getByPlaceholderText('说点什么...');
    fireEvent.change(input, { target: { value: '状态流转消息' } });
    fireEvent.click(screen.getByRole('button', { name: '发送' }));

    const getLastStatusText = () => {
      const statuses = container.querySelectorAll('.msgStatus');
      return statuses[statuses.length - 1]?.textContent;
    };

    expect(getLastStatusText()).toBe('...');

    act(() => {
      vi.advanceTimersByTime(500);
    });
    expect(getLastStatusText()).toBe('✓');

    act(() => {
      vi.advanceTimersByTime(1_500);
    });
    expect(getLastStatusText()).toBe('✓✓');
  });

  it('recalls an own message and supports re-editing', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.type(screen.getByPlaceholderText('说点什么...'), '临时撤回消息');
    await user.click(screen.getByRole('button', { name: '发送' }));

    fireEvent.contextMenu(screen.getAllByText('临时撤回消息')[1]);
    await user.click(screen.getByRole('button', { name: '撤回' }));
    await user.click(screen.getByRole('button', { name: '确定' }));

    expect(screen.getAllByText('你撤回了一条消息')).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: '重新编辑' }));
    expect(screen.getByPlaceholderText('说点什么...')).toHaveValue('临时撤回消息');
  });

  it('copies a message and shows an error toast when clipboard fails', async () => {
    const user = userEvent.setup();
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: {
        writeText: vi.fn().mockRejectedValueOnce(new Error('denied')),
      },
    });
    render(<App />);

    fireEvent.contextMenu(screen.getByText('大家晚上好'));
    await user.click(screen.getByRole('button', { name: '复制' }));

    await waitFor(() => {
      expect(screen.getByText('复制失败，请检查浏览器权限')).toBeInTheDocument();
    });
  });

  it('copies a message and shows success feedback', async () => {
    const user = userEvent.setup();
    const writeText = vi.fn().mockResolvedValue(undefined);
    Object.defineProperty(navigator, 'clipboard', {
      configurable: true,
      value: { writeText },
    });
    render(<App />);

    fireEvent.contextMenu(screen.getByText('大家晚上好'));
    await user.click(screen.getByRole('button', { name: '复制' }));

    expect(writeText).toHaveBeenCalledWith('大家晚上好');
    await waitFor(() => {
      expect(screen.getByText('已复制')).toBeInTheDocument();
    });
  });

  it('deletes a single message through the context menu', async () => {
    const user = userEvent.setup();
    render(<App />);

    fireEvent.contextMenu(screen.getByText('火锅怎么样'));
    await user.click(screen.getByRole('button', { name: '删除' }));
    await user.click(screen.getByRole('button', { name: '确定' }));

    expect(screen.queryByText('火锅怎么样')).not.toBeInTheDocument();
  });

  it('deletes selected messages in multi-select mode', async () => {
    const user = userEvent.setup();
    render(<App />);

    await user.click(screen.getByRole('button', { name: '多选' }));
    await user.click(screen.getByRole('button', { name: '选择消息 1-3' }));
    await user.click(screen.getByRole('button', { name: '删除 (1)' }));
    await user.click(screen.getByRole('button', { name: '确定' }));

    expect(screen.queryByText('今天吃什么')).not.toBeInTheDocument();
  });

  it('switches conversation and exits multi-select mode', async () => {
    const user = userEvent.setup();
    const { container } = render(<App />);

    await user.click(screen.getByRole('button', { name: '多选' }));
    expect(screen.getAllByRole('button', { name: '取消' })).toHaveLength(2);

    await user.click(screen.getByRole('button', { name: '打开会话 小红' }));

    expect(container.querySelector('.chatHeaderTitle')?.textContent).toBe('小红');
    expect(screen.queryByRole('button', { name: '删除 (0)' })).not.toBeInTheDocument();
  });

  it('keeps a newline on shift+enter instead of sending', async () => {
    const user = userEvent.setup();
    render(<App />);

    const input = screen.getByPlaceholderText('说点什么...');
    await user.type(input, '第一行');
    await user.keyboard('{Shift>}{Enter}{/Shift}第二行');

    expect(input).toHaveValue('第一行\n第二行');
    expect(screen.queryByText('第一行\n第二行')).not.toBeInTheDocument();
  });
});
