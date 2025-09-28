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
import { NotificationService } from '../../core/services';

@Injectable({
  providedIn: 'root'
})
export class TaskBusinessService {

  constructor(
    private taskHttpService: TaskHttpService,
    private notificationService: NotificationService
  ) { }

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
      this.notificationService.showLoading('Creando tarea...');

      const createRequest: CreateTaskRequestDTO = {
        title: taskForm.title,
        description: taskForm.description
      };

      const response = await firstValueFrom(this.taskHttpService.createTask(createRequest));

      if (!response.success || !response.data) {
        this.notificationService.close();
        this.notificationService.error('Error al crear tarea', response.message || 'No se pudo crear la tarea');
        throw new Error(response.message || 'Failed to create task');
      }

      this.notificationService.close();
      this.notificationService.toastSuccess('¡Tarea creada exitosamente!');

      // Crear un objeto Task mock con los datos que tenemos
      // En lugar de hacer un GET adicional que puede fallar
      const newTask: Task = {
        id: response.data.id,
        title: taskForm.title,
        description: taskForm.description || '',
        completed: false,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      return newTask;
    } catch (error) {
      this.notificationService.close();
      console.error('Error creating task:', error);

      if (error instanceof Error && !error.message.includes('Failed to create task')) {
        this.notificationService.error('Error inesperado', 'Ocurrió un error al crear la tarea. Por favor, intenta nuevamente.');
      }

      throw error;
    }
  }

  /**
   * Actualiza una tarea existente
   */
  async updateTask(id: number, taskForm: TaskForm, currentTask?: Task): Promise<Task> {
    try {
      this.notificationService.showLoading('Actualizando tarea...');

      const updateRequest: UpdateTaskRequestDTO = {
        title: taskForm.title,
        description: taskForm.description,
        isCompleted: currentTask?.completed ?? false // Mantener estado actual o false por defecto
      };

      const response = await firstValueFrom(this.taskHttpService.updateTask(id, updateRequest));

      if (!response.success || !response.data) {
        this.notificationService.close();
        this.notificationService.error('Error al actualizar tarea', response.message || 'No se pudo actualizar la tarea');
        throw new Error(response.message || 'Failed to update task');
      }

      const updatedTask = this.mapTaskResponseToTask(response.data);

      this.notificationService.close();
      this.notificationService.toastSuccess('¡Tarea actualizada exitosamente!');

      return updatedTask;
    } catch (error) {
      this.notificationService.close();
      console.error('Error updating task:', error);

      if (error instanceof Error && !error.message.includes('Failed to update task')) {
        this.notificationService.error('Error inesperado', 'Ocurrió un error al actualizar la tarea. Por favor, intenta nuevamente.');
      }

      throw error;
    }
  }

  /**
   * Marca una tarea como completada
   */
  async completeTask(id: number): Promise<Task> {
    try {
      const response = await firstValueFrom(this.taskHttpService.completeTask(id));

      if (!response.success || !response.data) {
        if (response.statusCode === 409) {
          this.notificationService.warning('Tarea ya completada', 'Esta tarea ya se encuentra marcada como completada.');
        } else {
          this.notificationService.error('Error al completar tarea', response.message || 'No se pudo marcar la tarea como completada');
        }
        throw new Error(response.message || 'Failed to complete task');
      }

      const completedTask = this.mapTaskResponseToTask(response.data);
      this.notificationService.toastSuccess('¡Tarea completada!');

      return completedTask;
    } catch (error) {
      console.error('Error completing task:', error);

      if (error instanceof Error && !error.message.includes('Failed to complete task') && !error.message.includes('already completed')) {
        this.notificationService.error('Error inesperado', 'Ocurrió un error al completar la tarea. Por favor, intenta nuevamente.');
      }

      throw error;
    }
  }

  /**
   * Elimina una tarea con confirmación
   */
  async deleteTaskWithConfirmation(id: number, taskTitle: string): Promise<boolean> {
    try {
      const result = await this.notificationService.confirmDelete(`la tarea "${taskTitle}"`);

      if (result.isConfirmed) {
        await this.deleteTask(id);
        return true;
      }

      return false;
    } catch (error) {
      console.error('Error in delete confirmation:', error);
      throw error;
    }
  }

  /**
   * Elimina una tarea
   */
  async deleteTask(id: number): Promise<void> {
    try {
      this.notificationService.showLoading('Eliminando tarea...');

      const response = await firstValueFrom(this.taskHttpService.deleteTask(id));

      if (!response.success) {
        this.notificationService.close();
        this.notificationService.error('Error al eliminar tarea', response.message || 'No se pudo eliminar la tarea');
        throw new Error(response.message || 'Failed to delete task');
      }

      this.notificationService.close();
      this.notificationService.toastSuccess('¡Tarea eliminada exitosamente!');
    } catch (error) {
      this.notificationService.close();
      console.error('Error deleting task:', error);

      if (error instanceof Error && !error.message.includes('Failed to delete task')) {
        this.notificationService.error('Error inesperado', 'Ocurrió un error al eliminar la tarea. Por favor, intenta nuevamente.');
      }

      throw error;
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
