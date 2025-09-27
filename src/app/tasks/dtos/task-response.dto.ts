export interface TaskResponseDTO {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface TaskListResponseDTO {
  tasks: TaskResponseDTO[];
  total: number;
  page: number;
  pageSize: number;
}
