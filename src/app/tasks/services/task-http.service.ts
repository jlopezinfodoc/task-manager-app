import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import {
  TaskResponseDTO,
  TaskListResponseDTO,
  CreateTaskRequestDTO,
  UpdateTaskRequestDTO,
  CompleteTaskRequestDTO
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
    this.baseUrl = this.environmentService.buildApiUrl('todos');
    this.environmentService.log('debug', 'TaskHttpService initialized with baseUrl:', this.baseUrl);
  }

  getTasks(): Observable<TaskResponseDTO[]> {
    return this.http.get<TaskResponseDTO[]>(this.baseUrl);
  }

  getTask(id: number): Observable<TaskResponseDTO> {
    return this.http.get<TaskResponseDTO>(`${this.baseUrl}/${id}`);
  }

  createTask(task: CreateTaskRequestDTO): Observable<TaskResponseDTO> {
    const payload = {
      title: task.title,
      body: task.description,
      userId: 1,
      completed: false
    };
    return this.http.post<TaskResponseDTO>(this.baseUrl, payload);
  }

  updateTask(task: UpdateTaskRequestDTO): Observable<TaskResponseDTO> {
    const payload = {
      id: task.id,
      title: task.title,
      body: task.description,
      userId: 1,
      completed: false
    };
    return this.http.put<TaskResponseDTO>(`${this.baseUrl}/${task.id}`, payload);
  }

  completeTask(request: CompleteTaskRequestDTO): Observable<TaskResponseDTO> {
    const payload = {
      completed: request.completed
    };
    return this.http.patch<TaskResponseDTO>(`${this.baseUrl}/${request.id}`, payload);
  }

  deleteTask(id: number): Observable<void> {
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
