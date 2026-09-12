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

let nativeStorage: typeof webStorage | null = null;
try {
  // AsyncStorage is async but zustand persist handles Promise-based storage
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  nativeStorage = {
    getItem: (name: string): string | null => {
      // Return null synchronously; zustand persist will hydrate when the Promise resolves
      AsyncStorage.getItem(name).then((v: string | null) => {
        if (v !== null) syncCache[name] = v;
      }).catch(() => {});
      return syncCache[name] ?? null;
    },
    setItem: (name: string, value: string): void => {
      syncCache[name] = value;
      AsyncStorage.setItem(name, value).catch(() => {});
    },
    removeItem: (name: string): void => {
      delete syncCache[name];
      AsyncStorage.removeItem(name).catch(() => {});
    },
  };
} catch {
  // AsyncStorage not installed — use in-memory fallback
}

const syncCache: Record<string, string> = {};

if (!isWeb && nativeStorage) {
  const keys = ['krust-favorites', 'krust-customer', 'krust-orders', 'krust-cart'];
  const AsyncStorage = require('@react-native-async-storage/async-storage').default;
  keys.forEach((key) => {
    AsyncStorage.getItem(key).then((val: string | null) => {
      if (val !== null) syncCache[key] = val;
    }).catch(() => {});
  });
}

export const persistentStorage = isWeb
  ? webStorage
  : nativeStorage ?? fallbackStorage;
