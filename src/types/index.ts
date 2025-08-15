export type Action = {
  id: string;
  title: string;
  completed: boolean;
  priority: "low" | "medium" | "high";
  createdAt: string;
  stackId?: string;
};

export type ActionsContextType = {
  actions: Action[];
  addAction: (
    title: string,
    priority: "low" | "medium" | "high",
    stackId: string
  ) => void;
  removeAction: (id: string) => void;
  updateAction: (id: string, updatedData: Partial<Action>) => void;
  toggleComplete: (id: string) => void;
  getCompletedCount: () => number;
  getIncompleteCount: () => number;
};

export type Stack = {
  id: string;
  name: string;
};

export type StacksContextType = {
  stacks: Stack[];
  addStack: (stack: Partial<Stack>) => Promise<Stack>;
};

export type ToastContextType = {
  success: (message: string) => void;
  error: (message: string) => void;
};

export type AppContextType = {
  state: {
    sidebarOpen: boolean;
  };
  toggleSidebar: () => void;
};
