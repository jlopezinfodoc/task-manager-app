import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { TaskHttpService } from '../services';
import { Task, TaskForm } from '../models';
import {
  TaskResponseDTO,
  CreateTaskRequestDTO,
  UpdateTaskRequestDTO,
  CompleteTaskRequestDTO
} from '../dtos';

@Injectable({
  providedIn: 'root'
})
export class TaskBusinessService {

  constructor(private taskHttpService: TaskHttpService) { }

  /**
   * Obtiene todas las tareas y las convierte al modelo de la UI
   */
  async getTasks(): Promise<Task[]> {
    try {
      const tasksDTO = await firstValueFrom(this.taskHttpService.getTasks());
      return this.mapTaskResponseArrayToTaskArray(tasksDTO);
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
      const taskDTO = await firstValueFrom(this.taskHttpService.getTask(id));
      return this.mapTaskResponseToTask(taskDTO);
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

      const taskDTO = await firstValueFrom(this.taskHttpService.createTask(createRequest));
      return this.mapTaskResponseToTask(taskDTO);
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
        id,
        title: taskForm.title,
        description: taskForm.description
      };

      const taskDTO = await firstValueFrom(this.taskHttpService.updateTask(updateRequest));
      return this.mapTaskResponseToTask(taskDTO);
    } catch (error) {
      console.error('Error updating task:', error);
      throw new Error('Failed to update task');
    }
  }

  /**
   * Marca una tarea como completada o no completada
   */
  async toggleTaskCompletion(id: number, completed: boolean): Promise<Task> {
    try {
      const completeRequest: CompleteTaskRequestDTO = {
        id,
        completed
      };

      const taskDTO = await firstValueFrom(this.taskHttpService.completeTask(completeRequest));
      return this.mapTaskResponseToTask(taskDTO);
    } catch (error) {
      console.error('Error toggling task completion:', error);
      throw new Error('Failed to update task status');
    }
  }

  /**
   * Elimina una tarea
   */
  async deleteTask(id: number): Promise<void> {
    try {
      await firstValueFrom(this.taskHttpService.deleteTask(id));
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
      description: (dto as any).body || dto.description || '', // JSONPlaceholder usa 'body'
      completed: dto.completed,
      createdAt: dto.createdAt ? new Date(dto.createdAt) : new Date(),
      updatedAt: dto.updatedAt ? new Date(dto.updatedAt) : new Date()
    };
  }

  private mapTaskResponseArrayToTaskArray(dtos: TaskResponseDTO[]): Task[] {
    return dtos.map(dto => this.mapTaskResponseToTask(dto));
  }
}
