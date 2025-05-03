
import { Task, CreateTaskInput, UpdateTaskInput, TaskStatus } from "@/types/task";

// Mock data for development
const mockTasks: Task[] = [
  {
    id: "1",
    title: "Complete project proposal",
    description: "Write and submit the project proposal for the new client project. Include timeline, budget, and resources needed.",
    dueDate: "2023-06-15",
    priority: "high",
    status: "completed",
    userId: "1",
    createdAt: "2023-06-01T10:00:00Z",
    updatedAt: "2023-06-10T16:30:00Z"
  },
  {
    id: "2",
    title: "Schedule team meeting",
    description: "Organize weekly team meeting to discuss project progress and address any blockers.",
    dueDate: "2023-06-10",
    priority: "medium",
    status: "completed",
    userId: "1",
    createdAt: "2023-06-02T09:30:00Z",
    updatedAt: "2023-06-09T14:00:00Z"
  },
  {
    id: "3",
    title: "Research new technologies",
    description: "Research and evaluate new technologies that could improve our development process.",
    dueDate: "2023-06-20",
    priority: "medium",
    status: "inprogress",
    userId: "1",
    createdAt: "2023-06-05T11:15:00Z",
    updatedAt: "2023-06-05T11:15:00Z"
  },
  {
    id: "4",
    title: "Fix login bug",
    description: "Debug and fix the login issue reported by users on the mobile app.",
    dueDate: "2023-06-12",
    priority: "high",
    status: "pending",
    userId: "1",
    createdAt: "2023-06-07T13:45:00Z",
    updatedAt: "2023-06-07T13:45:00Z"
  },
  {
    id: "5",
    title: "Update documentation",
    description: "Update user documentation to reflect recent changes in the application.",
    dueDate: "2023-06-25",
    priority: "low",
    status: "pending",
    userId: "1",
    createdAt: "2023-06-08T15:20:00Z",
    updatedAt: "2023-06-08T15:20:00Z"
  }
];

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const TaskService = {
  // Get all tasks
  getTasks: async (): Promise<Task[]> => {
    await delay(800); // Simulate API delay
    return [...mockTasks];
  },

  // Get task by ID
  getTaskById: async (id: string): Promise<Task> => {
    await delay(500);
    const task = mockTasks.find(task => task.id === id);
    if (!task) {
      throw new Error('Task not found');
    }
    return { ...task };
  },

  // Create a new task
  createTask: async (taskData: CreateTaskInput): Promise<Task> => {
    await delay(1000);
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      ...taskData,
      dueDate: taskData.dueDate || null,
      userId: "1", // In a real app, this would come from the authenticated user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    mockTasks.push(newTask);
    return { ...newTask };
  },

  // Update an existing task
  updateTask: async (taskData: UpdateTaskInput): Promise<Task> => {
    await delay(800);
    const index = mockTasks.findIndex(task => task.id === taskData.id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...mockTasks[index],
      ...taskData,
      updatedAt: new Date().toISOString()
    };
    
    mockTasks[index] = updatedTask;
    return { ...updatedTask };
  },

  // Delete a task
  deleteTask: async (id: string): Promise<void> => {
    await delay(700);
    const index = mockTasks.findIndex(task => task.id === id);
    if (index === -1) {
      throw new Error('Task not found');
    }
    mockTasks.splice(index, 1);
  },

  // Get tasks by status
  getTasksByStatus: async (status: TaskStatus): Promise<Task[]> => {
    await delay(600);
    return mockTasks.filter(task => task.status === status);
  }
};
