import { test, expect, request } from '@playwright/test';

test.beforeEach(async ({ page }) => {
  const api = await request.newContext();
  await api.delete('http://localhost:5082/api/test/reset');
  await page.goto('/');
});

test('should display the todo list heading', async ({ page }) => {
  await expect(page.getByRole('heading', { name: 'Todo List' })).toBeVisible();
});

test('should show empty state message when there are no todos', async ({ page }) => {
  await expect(page.getByText('No todos yet. Add one above!')).toBeVisible();
});

test('should add a new todo', async ({ page }) => {
  await page.getByPlaceholder('Add a new task...').fill('Buy groceries');
  await page.getByRole('button', { name: 'Add' }).click();

  await expect(page.getByText('Buy groceries')).toBeVisible();
});

test('should add a todo by pressing Enter', async ({ page }) => {
  await page.getByPlaceholder('Add a new task...').fill('Press enter task');
  await page.getByPlaceholder('Add a new task...').press('Enter');

  await expect(page.getByText('Press enter task')).toBeVisible();
});

test('should clear the input after adding a todo', async ({ page }) => {
  const input = page.getByPlaceholder('Add a new task...');
  await input.fill('Some task');
  await page.getByRole('button', { name: 'Add' }).click();

  await expect(input).toHaveValue('');
});

test('should delete a todo', async ({ page }) => {
  await page.getByPlaceholder('Add a new task...').fill('Task to delete');
  await page.getByRole('button', { name: 'Add' }).click();
  await expect(page.getByText('Task to delete')).toBeVisible();

  await page.getByRole('button', { name: 'Delete' }).click();

  await expect(page.getByText('Task to delete')).not.toBeVisible();
});

test('should keep other todos when one is deleted', async ({ page }) => {
  const input = page.getByPlaceholder('Add a new task...');
  await input.fill('Keep me');
  await input.press('Enter');
  await expect(page.getByText('Keep me')).toBeVisible();

  await input.fill('Delete me');
  await input.press('Enter');

  await expect(page.getByText('Delete me')).toBeVisible();
  await page.locator('li', { hasText: 'Delete me' }).getByRole('button', { name: 'Delete' }).click();

  await expect(page.getByText('Keep me')).toBeVisible();
  await expect(page.getByText('Delete me')).not.toBeVisible();
});

test('should disable the Add button when input is empty', async ({ page }) => {
  await expect(page.getByRole('button', { name: 'Add' })).toBeDisabled();
});
