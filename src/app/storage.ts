/* eslint-disable @typescript-eslint/no-explicit-any */
const win = typeof window !== "undefined" ? (window as any) : null;

const storage = {
  async get(key: string): Promise<{ value: string } | null> {
    if (win?.storage) {
      return win.storage.get(key);
    }
    const v = typeof localStorage !== "undefined" ? localStorage.getItem(key) : null;
    return v ? { value: v } : null;
  },
  async set(key: string, value: string): Promise<void> {
    if (win?.storage) {
      return win.storage.set(key, value);
    }
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(key, value);
    }
  },
};

export default storage;
