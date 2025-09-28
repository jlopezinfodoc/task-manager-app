import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TaskHttpService } from '../services';
import { Task, TaskForm } from '../models';
import {
  TaskResponseDTO,
  CreateTaskRequestDTO,
  UpdateTaskRequestDTO,
  TaskFilterRequestDTO,
  ApiResponse
} from '../dtos';

@Injectable({
  providedIn: 'root'
})
export class TaskBusinessService {

  constructor(private taskHttpService: TaskHttpService) { }

  /**
   * Obtiene todas las tareas y las convierte al modelo de la UI
   */
  async getTasks(filters?: TaskFilterRequestDTO): Promise<Task[]> {
    try {
      const response = await firstValueFrom(this.taskHttpService.getTasks(filters));

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to load tasks');
      }

      return this.mapTaskResponseArrayToTaskArray(response.data);
    } catch (error) {
      console.error('Error getting tasks:', error);
      throw new Error('Failed to load tasks');
    }
  }

  /**
   * Obtiene una tarea específica por ID
   */
  async getTask(id: number): Promise<Task> {
    try {
      const response = await firstValueFrom(this.taskHttpService.getTask(id));

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to load task');
      }

      return this.mapTaskResponseToTask(response.data);
    } catch (error) {
      console.error('Error getting task:', error);
      throw new Error('Failed to load task');
    }
  }

  /**
   * Crea una nueva tarea
   */
  async createTask(taskForm: TaskForm): Promise<Task> {
    try {
      const createRequest: CreateTaskRequestDTO = {
        title: taskForm.title,
        description: taskForm.description
      };

      const response = await firstValueFrom(this.taskHttpService.createTask(createRequest));

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to create task');
      }

      // Después de crear, obtenemos la tarea completa
      return await this.getTask(response.data.id);
    } catch (error) {
      console.error('Error creating task:', error);
      throw new Error('Failed to create task');
    }
  }

  /**
   * Actualiza una tarea existente
   */
  async updateTask(id: number, taskForm: TaskForm): Promise<Task> {
    try {
      const updateRequest: UpdateTaskRequestDTO = {
        title: taskForm.title,
        description: taskForm.description,
        isCompleted: false // Valor por defecto, se puede ajustar
      };

      const response = await firstValueFrom(this.taskHttpService.updateTask(id, updateRequest));

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to update task');
      }

      return this.mapTaskResponseToTask(response.data);
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  }

  /**
   * Marca una tarea como completada
   */
  async completeTask(id: number): Promise<Task> {
    try {
      const response = await firstValueFrom(this.taskHttpService.completeTask(id));

      if (!response.success || !response.data) {
        throw new Error(response.message || 'Failed to complete task');
      }

      return this.mapTaskResponseToTask(response.data);
    } catch (error) {
      console.error('Error completing task:', error);
      throw new Error('Failed to complete task');
    }
  }

  /**
   * Elimina una tarea
   */
  async deleteTask(id: number): Promise<void> {
    try {
      const response = await firstValueFrom(this.taskHttpService.deleteTask(id));

      if (!response.success) {
        throw new Error(response.message || 'Failed to delete task');
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      throw new Error('Failed to delete task');
    }
  }

  /**
   * Filtra tareas por estado de completado
   */
  filterTasks(tasks: Task[], completed?: boolean): Task[] {
    if (completed === undefined) {
      return tasks;
    }
    return tasks.filter(task => task.completed === completed);
  }

  /**
   * Busca tareas por título o descripción
   */
  searchTasks(tasks: Task[], searchTerm: string): Task[] {
    if (!searchTerm.trim()) {
      return tasks;
    }

    const term = searchTerm.toLowerCase();
    return tasks.filter(task =>
      task.title.toLowerCase().includes(term) ||
      task.description.toLowerCase().includes(term)
    );
  }

  // Métodos privados para mapear DTOs a modelos de UI
  private mapTaskResponseToTask(dto: TaskResponseDTO): Task {
    return {
      id: dto.id,
      title: dto.title,
      description: dto.description || '',
      completed: dto.isCompleted,
      createdAt: dto.createdDate ? new Date(dto.createdDate) : new Date(),
      updatedAt: dto.completedDate ? new Date(dto.completedDate) : new Date()
    };
  }

  private mapTaskResponseArrayToTaskArray(dtos: TaskResponseDTO[]): Task[] {
    return dtos.map(dto => this.mapTaskResponseToTask(dto));
  }
}
