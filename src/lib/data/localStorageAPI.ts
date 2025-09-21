/*
  ROLE: Low-level data access logic (CRUD to localStorage)
  Acts like a backend API for the app.
  This represents a simple localStorage API for generic CRUD operations.
  We separate the API Layer from the UI and use hooks to manage React logic.
  This allows us to easily switch to a real API in the future if needed.
*/

interface StorageItem {
  id: string;
  createdAt: string;
}

export function makeStorageAPI<T extends StorageItem>(keyName: string) {
  const load = (): T[] => JSON.parse(localStorage.getItem(keyName) || "[]");
  const save = (data: T[]) =>
    localStorage.setItem(keyName, JSON.stringify(data));
  const generateId = (): string => crypto.randomUUID();

  return {
    getAll: async (): Promise<T[]> => load(),

    getById: async (id: string): Promise<T> => {
      const items = load();
      const item = items.find((i) => i.id === id);
      if (!item) throw new Error(`${keyName} item ${id} not found`);
      return item;
    },

    create: async (
      data: Omit<T, "id" | "createdAt">,
      defaults: Partial<T> = {}
    ): Promise<T> => {
      const newItem = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        ...defaults,
        ...data,
      } as T;
      const items = load();
      save([...items, newItem]);
      return newItem;
    },

    update: async (id: string, updates: Partial<T>): Promise<T> => {
      const items = load();
      const updated = items.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      );
      save(updated);
      const item = updated.find((i) => i.id === id);
      if (!item) throw new Error(`${keyName} item ${id} not found`);
      return item;
    },

    remove: async (id: string): Promise<void> => {
      const items = load();
      save(items.filter((i) => i.id !== id));
    },

    findMany: async (predicate: (item: T) => boolean): Promise<T[]> => {
      return load().filter(predicate);
    },

    removeMany: async (predicate: (item: T) => boolean): Promise<void> => {
      const items = load();
      const filtered = items.filter((item) => !predicate(item));
      save(filtered);
    },
  };
}
