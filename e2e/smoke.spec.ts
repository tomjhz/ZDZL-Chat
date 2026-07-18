import { expect, test } from '@playwright/test';

test.describe('chat smoke', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('loads the main page', async ({ page }) => {
    await expect(page.getByText('微信消息')).toBeVisible();
    await expect(page.getByRole('button', { name: '发送' })).toBeVisible();
    await expect(page.getByRole('button', { name: '打开会话 小王' })).toBeVisible();
  });

  test('sends a message', async ({ page }) => {
    const input = page.getByPlaceholder('说点什么...');
    await input.fill('Playwright smoke message');
    await page.getByRole('button', { name: '发送' }).click();

    await expect(input).toHaveValue('');
    await expect(page.locator('.messageText', { hasText: 'Playwright smoke message' })).toHaveCount(1);
  });

  test('opens the context menu on right click', async ({ page }) => {
    await page.locator('.messageBubble', { hasText: '大家晚上好' }).click({ button: 'right' });

    await expect(page.getByRole('button', { name: '复制' })).toBeVisible();
    await expect(page.getByRole('button', { name: '删除' })).toBeVisible();
  });

  test('deletes selected messages in multi-select mode', async ({ page }) => {
    await page.getByRole('button', { name: '多选' }).click();
    await page.getByRole('button', { name: '选择消息 1-3' }).click();
    await page.getByRole('button', { name: '删除 (1)' }).click();
    await page.getByRole('button', { name: '确定' }).click();

    await expect(page.getByText('今天吃什么')).toHaveCount(0);
  });
});
