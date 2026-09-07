const storage = new Map<string, string>();

export default {
  clear: async () => {
    storage.clear();
  },
  getItem: async (key: string) => storage.get(key) ?? null,
  removeItem: async (key: string) => {
    storage.delete(key);
  },
  setItem: async (key: string, value: string) => {
    storage.set(key, value);
  },
};
