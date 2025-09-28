import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Task, TaskFilter } from '../../models';
import { TaskBusinessService } from '../../business';
import { TaskListComponent, TaskFilterComponent } from '../presentational';
import { TaskFilterRequestDTO } from '../../dtos';

@Component({
  selector: 'app-task-list-container',
  standalone: true,
  imports: [CommonModule, TaskListComponent, TaskFilterComponent],
  template: `
    <div class="container-fluid py-4">
      <div class="row">
        <div class="col-12">
          <div class="d-flex justify-content-between align-items-center mb-4">
            <h2 class="mb-0">
              <i class="bi bi-list-task"></i>
              Task Manager
            </h2>
            <button type="button" class="btn btn-success" (click)="navigateToCreate()">
              <i class="bi bi-plus-circle"></i>
              New Task
            </button>
          </div>

          <!-- Filtros -->
          <app-task-filter
            (filtersChanged)="onFiltersChanged($event)">
          </app-task-filter>

          <app-task-list
            [tasks]="filteredTasks"
            [loading]="loading"
            [error]="error"
            [filter]="filter"
            (filterChange)="onFilterChange($event)"
            (toggleComplete)="onToggleComplete($event)"
            (edit)="navigateToEdit($event)"
            (delete)="onDeleteTask($event)"
            (createNew)="navigateToCreate()"
            (retry)="loadTasks(currentApiFilters)">
          </app-task-list>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .container-fluid {
      max-width: 1400px;
    }
  `]
})
export class TaskListContainerComponent implements OnInit {
  tasks: Task[] = [];
  filteredTasks: Task[] = [];
  loading = false;
  error: string | null = null;
  filter: TaskFilter = {};
  currentApiFilters: TaskFilterRequestDTO = {};

  constructor(
    private taskBusinessService: TaskBusinessService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadTasks();
  }

  async loadTasks(apiFilters?: TaskFilterRequestDTO): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      this.tasks = await this.taskBusinessService.getTasks(apiFilters);
      this.applyFilters();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'An unexpected error occurred';
      console.error('Error loading tasks:', error);
    } finally {
      this.loading = false;
    }
  }

  /**
   * Maneja cambios en los filtros de la API
   */
  onFiltersChanged(apiFilters: TaskFilterRequestDTO): void {
    this.currentApiFilters = apiFilters;
    this.loadTasks(apiFilters);
  }

  onFilterChange(newFilter: TaskFilter): void {
    this.filter = { ...newFilter };
    this.applyFilters();
  }

  async onToggleComplete(taskId: number): Promise<void> {
    try {
      const task = this.tasks.find(t => t.id === taskId);
      if (!task) return;

      // Solo se puede completar una tarea, no se puede "descompletar" según la API
      if (task.completed) {
        console.warn('Task is already completed and cannot be uncompleted');
        return;
      }

      const updatedTask = await this.taskBusinessService.completeTask(taskId);

      // Update the task in the local array
      const index = this.tasks.findIndex(t => t.id === taskId);
      if (index >= 0) {
        this.tasks[index] = updatedTask;
        this.applyFilters();
      }
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to update task';
      console.error('Error toggling task completion:', error);
    }
  }

  async onDeleteTask(taskId: number): Promise<void> {
    if (!confirm('Are you sure you want to delete this task?')) {
      return;
    }

    try {
      await this.taskBusinessService.deleteTask(taskId);

      // Remove the task from the local array
      this.tasks = this.tasks.filter(t => t.id !== taskId);
      this.applyFilters();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to delete task';
      console.error('Error deleting task:', error);
    }
  }

  navigateToCreate(): void {
    this.router.navigate(['/tasks/create']);
  }

  navigateToEdit(taskId: number): void {
    this.router.navigate(['/tasks/edit', taskId]);
  }

  private applyFilters(): void {
    let filtered = [...this.tasks];

    // Apply completion filter
    if (this.filter.completed !== undefined) {
      filtered = this.taskBusinessService.filterTasks(filtered, this.filter.completed);
    }

    // Apply search filter
    if (this.filter.search) {
      filtered = this.taskBusinessService.searchTasks(filtered, this.filter.search);
    }

    this.filteredTasks = filtered;
  }
}
