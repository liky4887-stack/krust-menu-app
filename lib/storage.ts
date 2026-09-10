import { Platform } from 'react-native';

const isWeb = Platform.OS === 'web';

const webStorage = {
  getItem: (name: string): string | null => {
    try {
      return localStorage.getItem(name);
    } catch {
      return null;
    }
  },
  setItem: (name: string, value: string): void => {
    try {
      localStorage.setItem(name, value);
    } catch {
      // storage full or unavailable
    }
  },
  removeItem: (name: string): void => {
    try {
      localStorage.removeItem(name);
    } catch {
      // noop
    }
  },
};

const memoryStorage: Record<string, string> = {};

const fallbackStorage = {
  getItem: (name: string): string | null => memoryStorage[name] ?? null,
  setItem: (name: string, value: string): void => {
    memoryStorage[name] = value;
  },
  removeItem: (name: string): void => {
    delete memoryStorage[name];
  },
};

export const persistentStorage = isWeb ? webStorage : fallbackStorage;
