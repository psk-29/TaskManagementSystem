
// Note: This is a simulated MongoDB service for frontend development.
// In a real application, you would connect to MongoDB Atlas via a backend service.

import { Task } from "@/types/task";
import { User } from "@/types/auth";

// Simulated collections
let tasksCollection: Task[] = [];
let usersCollection: User[] = [];

// Initialize with mock data
const initializeMockData = () => {
  // Import mock tasks from task-service
  import("./task-service").then((taskService) => {
    taskService.TaskService.getTasks().then((tasks) => {
      tasksCollection = [...tasks];
      console.log("MongoDB Service: Initialized tasks collection with mock data");
    });
  });

  // Initialize users collection with a mock user
  usersCollection = [
    {
      id: "1",
      name: "Demo User",
      email: "user@example.com",
      role: "user"
    }
  ];
  console.log("MongoDB Service: Initialized users collection with mock data");
};

// Initialize mock data
initializeMockData();

// Helper function to simulate API delay
const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));

export const MongoDBService = {
  // Task operations
  getTasks: async (): Promise<Task[]> => {
    await delay(800); // Simulate network latency
    console.log("MongoDB Service: Fetching all tasks");
    return [...tasksCollection];
  },

  getTaskById: async (id: string): Promise<Task> => {
    await delay(500);
    const task = tasksCollection.find(task => task.id === id);
    if (!task) {
      console.error("MongoDB Service: Task not found");
      throw new Error('Task not found');
    }
    console.log(`MongoDB Service: Fetched task ${id}`);
    return { ...task };
  },

  createTask: async (taskData: any): Promise<Task> => {
    await delay(1000);
    const newTask: Task = {
      id: Math.random().toString(36).substr(2, 9),
      ...taskData,
      dueDate: taskData.dueDate || null,
      userId: "1", // In a real app, this would come from the authenticated user
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    tasksCollection.push(newTask);
    console.log("MongoDB Service: Created new task");
    return { ...newTask };
  },

  updateTask: async (taskData: any): Promise<Task> => {
    await delay(800);
    const index = tasksCollection.findIndex(task => task.id === taskData.id);
    if (index === -1) {
      console.error("MongoDB Service: Task not found for update");
      throw new Error('Task not found');
    }
    
    const updatedTask = {
      ...tasksCollection[index],
      ...taskData,
      updatedAt: new Date().toISOString()
    };
    
    tasksCollection[index] = updatedTask;
    console.log(`MongoDB Service: Updated task ${taskData.id}`);
    return { ...updatedTask };
  },

  deleteTask: async (id: string): Promise<void> => {
    await delay(700);
    const index = tasksCollection.findIndex(task => task.id === id);
    if (index === -1) {
      console.error("MongoDB Service: Task not found for deletion");
      throw new Error('Task not found');
    }
    tasksCollection.splice(index, 1);
    console.log(`MongoDB Service: Deleted task ${id}`);
  },

  getTasksByStatus: async (status: string): Promise<Task[]> => {
    await delay(600);
    const filteredTasks = tasksCollection.filter(task => task.status === status);
    console.log(`MongoDB Service: Fetched tasks with status ${status}`);
    return [...filteredTasks];
  },

  // User operations
  getUserByEmail: async (email: string): Promise<User | null> => {
    await delay(500);
    const user = usersCollection.find(user => user.email === email);
    console.log(`MongoDB Service: Fetched user with email ${email}`);
    return user ? { ...user } : null;
  },

  createUser: async (userData: any): Promise<User> => {
    await delay(800);
    const newUser: User = {
      id: Math.random().toString(36).substr(2, 9),
      name: userData.name,
      email: userData.email,
      role: "user"
    };
    usersCollection.push(newUser);
    console.log("MongoDB Service: Created new user");
    return { ...newUser };
  }
};

// Add a note to the console about this being a simulated service
console.log("MongoDB Atlas Service initialized (simulation)");
console.log("Note: This is a frontend simulation. For a real MongoDB Atlas connection, you need a backend service.");
