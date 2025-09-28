export interface CreateTaskRequestDTO {
  title: string;          // Requerido, máximo 200 caracteres
  description?: string;   // Opcional, máximo 1000 caracteres
}

export interface UpdateTaskRequestDTO {
  title: string;          // Requerido, máximo 200 caracteres
  description?: string;   // Opcional, máximo 1000 caracteres
  isCompleted: boolean;   // Estado de completado
}

export interface CompleteTaskRequestDTO {
  // No necesita cuerpo, solo el ID en la URL
}

export interface TaskFilterRequestDTO {
  isCompleted?: boolean;        // Filtrar por estado
  title?: string;               // Buscar en título
  createdFrom?: string;         // Desde fecha (ISO 8601)
  createdTo?: string;           // Hasta fecha (ISO 8601)
  pageNumber?: number;          // Número de página (default: 1)
  pageSize?: number;            // Elementos por página (default: 10)
}
