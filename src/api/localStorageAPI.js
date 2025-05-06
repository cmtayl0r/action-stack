/*
  ROLE: Low-level data access logic (CRUD to localStorage)
  Acts like a backend API for the app.
  This represents a simple localStorage API for generic CRUD operations.
  We separate the API Layer from the UI and use hooks to manage React logic.
  This allows us to easily switch to a real API in the future if needed.
*/

export function makeStorageAPI(keyName) {
  // Utilities to handle localStorage
  const load = () => JSON.parse(localStorage.getItem(keyName)) || [];
  const save = (data) => localStorage.setItem(keyName, JSON.stringify(data));
  const generateId = () => crypto.randomUUID();

  return {
    // 1️⃣ Load all items
    getAll: async () => load(),

    // 2️⃣ Load item by ID
    getById: async (id) => {
      const items = load();
      const item = items.find((i) => i.id === id);
      if (!item) throw new Error(`${keyName} item ${id} not found`);
      return item;
    },

    // 3️⃣ Create a new item
    create: async (data, defaults = {}) => {
      const newItem = {
        id: generateId(),
        createdAt: new Date().toISOString(),
        ...defaults, // Default values for new items
        ...data, // User-provided data
      };
      const items = load();
      save([...items, newItem]);
      return newItem;
    },

    // 4️⃣ Update an existing item
    update: async (id, updates) => {
      const items = load();
      const updated = items.map((i) =>
        i.id === id ? { ...i, ...updates } : i
      );
      save(updated);
      return updated.find((i) => i.id === id);
    },

    // 5️⃣ Remove an item
    remove: async (id) => {
      const items = load();
      save(items.filter((i) => i.id !== id));
    },

    // 6️⃣ Find multiple items based on a predicate
    // A function that returns true for items we want to find
    // Example: findMany(item => item.name === 'example')
    // This is a higher-order function that takes a predicate function
    // and returns a new function that can be called with the predicate.
    findMany: async (predicate) => {
      return load().filter(predicate);
    },

    // 7️⃣ Remove multiple items based on a predicate
    // Example: removeMany(item => item.completed)
    // This is a higher-order function that takes a predicate function
    // and returns a new function that can be called with the predicate.
    // This allows us to remove multiple items in one go.
    removeMany: async (predicate) => {
      const items = load();
      const filtered = items.filter((item) => !predicate(item));
      save(filtered);
    },
  };
}
