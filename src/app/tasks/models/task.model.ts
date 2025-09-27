export interface Task {
  id?: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface TaskForm {
  title: string;
  description: string;
}

export interface TaskFilter {
  completed?: boolean;
  search?: string;
}

export interface TaskListState {
  tasks: Task[];
  loading: boolean;
  error: string | null;
  filter: TaskFilter;
}
