import { deleteCaddyConfigById } from './caddy-basics';

export async function deleteAllCaddyConfigById(id: string, path = ''): Promise<void> {
  try {
    await deleteCaddyConfigById(id, path);
  } catch {
    return;
  }
  await deleteAllCaddyConfigById(id, path);
}
