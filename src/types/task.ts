
export type TaskPriority = "low" | "medium" | "high";
export type TaskStatus = "pending" | "inprogress" | "completed" | "canceled";

export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string | null;
  priority: TaskPriority;
  status: TaskStatus;
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateTaskInput {
  title: string;
  description: string;
  dueDate?: string | null;
  priority: TaskPriority;
  status: TaskStatus;
}

export interface UpdateTaskInput extends Partial<CreateTaskInput> {
  id: string;
}
