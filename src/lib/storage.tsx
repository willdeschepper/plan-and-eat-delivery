import { createMMKV } from 'react-native-mmkv';

export const storage = createMMKV();

export function getItem<T>(key: string): T | null {
  const value = storage.getString(key);
  if (!value)
    return null;
  try {
    const parsed: unknown = JSON.parse(value);
    return (parsed ?? null) as T | null;
  }
  catch (e) {
    console.error(`storage.getItem parse failed for key "${key}"`, e);
    return null;
  }
}

/** @returns false if persist failed (caller may retry or surface error). */
export async function setItem<T>(key: string, value: T): Promise<boolean> {
  try {
    storage.set(key, JSON.stringify(value));
    return true;
  }
  catch (e) {
    console.error(`storage.setItem failed for key "${key}"`, e);
    return false;
  }
}

export async function removeItem(key: string): Promise<void> {
  try {
    storage.remove(key);
  }
  catch (e) {
    console.error(`storage.removeItem failed for key "${key}"`, e);
  }
}
