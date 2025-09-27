export interface CreateTaskRequestDTO {
  title: string;
  description: string;
}

export interface UpdateTaskRequestDTO {
  id: number;
  title: string;
  description: string;
}

export interface CompleteTaskRequestDTO {
  id: number;
  completed: boolean;
}
