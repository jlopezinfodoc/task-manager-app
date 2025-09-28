import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TaskApiResponse,
  TaskListApiResponse,
  CreateTaskApiResponse,
  DeleteTaskApiResponse,
  CreateTaskRequestDTO,
  UpdateTaskRequestDTO,
  CompleteTaskRequestDTO,
  TaskFilterRequestDTO
} from '../dtos';
import { EnvironmentService } from '../../core/services/environment.service';

@Injectable({
  providedIn: 'root'
})
export class TaskHttpService {
  private readonly baseUrl: string;

  constructor(
    private http: HttpClient,
    private environmentService: EnvironmentService
  ) {
    this.baseUrl = this.environmentService.buildApiUrl('api/tasks');
    this.environmentService.log('debug', 'TaskHttpService initialized with baseUrl:', this.baseUrl);
  }

  /**
   * GET /api/tasks - Obtener todas las tareas con filtros opcionales
   */
    getTasks(filters?: TaskFilterRequestDTO): Observable<TaskListApiResponse> {
    let params = new HttpParams();

    if (filters) {
      if (filters.isCompleted !== undefined) {
        params = params.set('isCompleted', filters.isCompleted.toString());
      }
      if (filters.title) {
        params = params.set('title', filters.title);
      }
      if (filters.createdFrom) {
        params = params.set('createdFrom', filters.createdFrom);
      }
      if (filters.createdTo) {
        params = params.set('createdTo', filters.createdTo);
      }
      if (filters.pageNumber) {
        params = params.set('pageNumber', filters.pageNumber.toString());
      }
      if (filters.pageSize) {
        params = params.set('pageSize', filters.pageSize.toString());
      }
    }

    return this.http.get<TaskListApiResponse>(this.baseUrl, { params });
  }

  /**
   * GET /api/tasks/{id} - Obtener tarea por ID
   */
  getTask(id: number): Observable<TaskApiResponse> {
    return this.http.get<TaskApiResponse>(`${this.baseUrl}/${id}`);
  }

  /**
   * POST /api/tasks - Crear nueva tarea
   */
  createTask(task: CreateTaskRequestDTO): Observable<CreateTaskApiResponse> {
    const payload = {
      title: task.title,
      description: task.description || ''
    };
    return this.http.post<CreateTaskApiResponse>(this.baseUrl, payload);
  }

  /**
   * PUT /api/tasks/{id} - Actualizar tarea completa
   */
  updateTask(id: number, task: UpdateTaskRequestDTO): Observable<TaskApiResponse> {
    const payload = {
      title: task.title,
      description: task.description || '',
      isCompleted: task.isCompleted
    };
    return this.http.put<TaskApiResponse>(`${this.baseUrl}/${id}`, payload);
  }

  /**
   * PATCH /api/tasks/{id}/complete - Marcar tarea como completada
   */
  completeTask(id: number): Observable<TaskApiResponse> {
    return this.http.patch<TaskApiResponse>(`${this.baseUrl}/${id}/complete`, {});
  }

  /**
   * DELETE /api/tasks/{id} - Eliminar tarea
   */
  deleteTask(id: number): Observable<DeleteTaskApiResponse> {
    return this.http.delete<DeleteTaskApiResponse>(`${this.baseUrl}/${id}`);
  }
}
