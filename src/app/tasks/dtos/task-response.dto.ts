// Estructura de respuesta de la API según documentación
export interface ApiResponse<T> {
  data: T | null;               // Datos solicitados o null en caso de error
  statusCode: number;           // Código de estado HTTP
  message: string;              // Mensaje descriptivo
  success: boolean;             // true si statusCode está entre 200-299
}

// DTO para la estructura de una tarea según la API
export interface TaskResponseDTO {
  id: number;
  title: string;
  description: string;
  isCompleted: boolean;         // Nota: la API usa 'isCompleted' no 'completed'
  createdDate: string;          // ISO 8601 string
  completedDate: string | null; // ISO 8601 string o null
}

// DTO para respuesta de creación de tarea
export interface CreateTaskResponseDTO {
  id: number;
  message: string;
}

// DTO para respuesta con lista de tareas (array directo según doc)
export interface TaskListResponseDTO {
  tasks: TaskResponseDTO[];
  total?: number;               // Para paginación futura
  page?: number;                // Para paginación futura
  pageSize?: number;            // Para paginación futura
}

// Tipos de respuestas del API
export type TaskApiResponse = ApiResponse<TaskResponseDTO>;
export type TaskListApiResponse = ApiResponse<TaskResponseDTO[]>;
export type CreateTaskApiResponse = ApiResponse<CreateTaskResponseDTO>;
export type DeleteTaskApiResponse = ApiResponse<boolean>;
