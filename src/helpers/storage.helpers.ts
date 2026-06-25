import { Theme } from '../components/Toolbar';

const STORAGE_KEY = 'SAVED_URL_KEY';
const THEME_STORAGE_KEY = 'SAVED_THEME_KEY';

const THEME_CYCLE: Theme[] = ['light', 'dark', 'auto'];

export { THEME_CYCLE };

export function isValidHost(value: string): boolean {
  try {
    const prefix = /^https?:\/\//i.test(value) ? '' : 'https://';
    return new URL(prefix + value).hostname.length > 0;
  } catch {
    return false;
  }
}

export async function getSavedCustomHost(): Promise<string> {
  try {
    const result = await chrome.storage.sync.get(STORAGE_KEY);
    const value = result[STORAGE_KEY];
    return typeof value === 'string' && value ? value : '';
  } catch {
    return '';
  }
}

export async function saveCustomHost(host: string): Promise<void> {
  try {
    if (host) {
      await chrome.storage.sync.set({ [STORAGE_KEY]: host });
    } else {
      await chrome.storage.sync.remove(STORAGE_KEY);
    }
  } catch {
    // storage unavailable (e.g. during dev outside extension context)
  }
}

export async function getSavedTheme(): Promise<Theme> {
  try {
    const result = await chrome.storage.sync.get(THEME_STORAGE_KEY);
    const value = result[THEME_STORAGE_KEY];
    return THEME_CYCLE.includes(value) ? value : 'auto';
  } catch {
    return 'auto';
  }
}

export async function saveTheme(theme: Theme): Promise<void> {
  try {
    await chrome.storage.sync.set({ [THEME_STORAGE_KEY]: theme });
  } catch {
    // storage unavailable outside extension context
  }
}
