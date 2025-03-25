// Types for tasks
export interface Task {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: string;
  completedAt: string | null;
  category: string;
}

// Local storage key
const TASKS_KEY = "digital-tasbih-tasks";

// Default tasks
const defaultTasks: Task[] = [
  {
    id: 1,
    title: "Complete morning dhikr",
    description: "33x Subhanallah, 33x Alhamdulillah, 34x Allahu Akbar",
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
    category: "dhikr",
  },
  {
    id: 2,
    title: "Read Surah Al-Kahf",
    description: "Read Surah Al-Kahf on Friday",
    completed: false,
    createdAt: new Date().toISOString(),
    completedAt: null,
    category: "quran",
  },
];

// Get all tasks from local storage
export const getTasks = (): Task[] => {
  try {
    const tasksJson = localStorage.getItem(TASKS_KEY);
    if (tasksJson) {
      return JSON.parse(tasksJson);
    }
    // If no tasks, return defaults and save them
    localStorage.setItem(TASKS_KEY, JSON.stringify(defaultTasks));
    return defaultTasks;
  } catch (error) {
    console.error("Error getting tasks:", error);
    return defaultTasks;
  }
};

// Save task to local storage
export const saveTask = (task: Task): Task[] => {
  try {
    const tasks = getTasks();

    // Check if task already exists
    const existingIndex = tasks.findIndex((t) => t.id === task.id);

    if (existingIndex >= 0) {
      // Update existing task
      tasks[existingIndex] = task;
    } else {
      // Add new task with a new ID
      const newId = Math.max(0, ...tasks.map((t) => t.id)) + 1;
      tasks.push({
        ...task,
        id: newId,
        createdAt: new Date().toISOString(),
      });
    }

    localStorage.setItem(TASKS_KEY, JSON.stringify(tasks));
    return tasks;
  } catch (error) {
    console.error("Error saving task:", error);
    return getTasks();
  }
};

// Delete a task
export const deleteTask = (id: number): Task[] => {
  try {
    const tasks = getTasks();
    const updatedTasks = tasks.filter((t) => t.id !== id);
    localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    return updatedTasks;
  } catch (error) {
    console.error("Error deleting task:", error);
    return getTasks();
  }
};

// Toggle task completion status
export const toggleTaskCompletion = (id: number): Task[] => {
  try {
    const tasks = getTasks();
    const updatedTasks = tasks.map((task) => {
      if (task.id === id) {
        const completed = !task.completed;
        return {
          ...task,
          completed,
          completedAt: completed ? new Date().toISOString() : null,
        };
      }
      return task;
    });

    localStorage.setItem(TASKS_KEY, JSON.stringify(updatedTasks));
    return updatedTasks;
  } catch (error) {
    console.error("Error toggling task completion:", error);
    return getTasks();
  }
};

// Get tasks by category
export const getTasksByCategory = (category: string): Task[] => {
  try {
    const tasks = getTasks();
    return tasks.filter((task) => task.category === category);
  } catch (error) {
    console.error("Error getting tasks by category:", error);
    return [];
  }
};

// Get completed tasks
export const getCompletedTasks = (): Task[] => {
  try {
    const tasks = getTasks();
    return tasks.filter((task) => task.completed);
  } catch (error) {
    console.error("Error getting completed tasks:", error);
    return [];
  }
};

// Get incomplete tasks
export const getIncompleteTasks = (): Task[] => {
  try {
    const tasks = getTasks();
    return tasks.filter((task) => !task.completed);
  } catch (error) {
    console.error("Error getting incomplete tasks:", error);
    return [];
  }
};
