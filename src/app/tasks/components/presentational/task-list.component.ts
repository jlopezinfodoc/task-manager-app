import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task, TaskFilter } from '../../models';
import { TaskCardComponent } from './task-card.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule, TaskCardComponent],
  template: `
    <div class="container-fluid">
      <!-- Filter and Search Bar -->
      <div class="row mb-4">
        <div class="col-md-6">
          <div class="btn-group" role="group">
            <input type="radio" class="btn-check" name="filter" id="all"
                   [checked]="filter.completed === undefined"
                   (change)="onFilterChange(undefined)">
            <label class="btn btn-outline-primary" for="all">All ({{ totalTasks }})</label>

            <input type="radio" class="btn-check" name="filter" id="pending"
                   [checked]="filter.completed === false"
                   (change)="onFilterChange(false)">
            <label class="btn btn-outline-warning" for="pending">Pending ({{ pendingCount }})</label>

            <input type="radio" class="btn-check" name="filter" id="completed"
                   [checked]="filter.completed === true"
                   (change)="onFilterChange(true)">
            <label class="btn btn-outline-success" for="completed">Completed ({{ completedCount }})</label>
          </div>
        </div>
        <div class="col-md-6">
          <div class="input-group">
            <input
              type="text"
              class="form-control"
              placeholder="Search tasks..."
              [value]="filter.search || ''"
              (input)="onSearchChange($event)">
            <button class="btn btn-outline-secondary" type="button" (click)="onClearSearch()">
              <i class="bi bi-x-circle"></i>
            </button>
          </div>
        </div>
      </div>

      <!-- Loading State - Elegant Spinner -->
      <div *ngIf="loading" class="text-center py-5 loading-container">
        <div class="loading-animation">
          <div class="spinner-grow text-primary" role="status" style="width: 3rem; height: 3rem;">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="spinner-grow text-success" role="status" style="width: 3rem; height: 3rem; animation-delay: 0.15s;">
            <span class="visually-hidden">Loading...</span>
          </div>
          <div class="spinner-grow text-info" role="status" style="width: 3rem; height: 3rem; animation-delay: 0.3s;">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        <div class="mt-4">
          <h5 class="text-muted">⏳ Cargando tareas...</h5>
          <p class="text-muted mb-0">Obteniendo la información más reciente del servidor</p>
        </div>
      </div>

      <!-- Error State -->
      <div *ngIf="error" class="alert alert-danger" role="alert">
        <i class="bi bi-exclamation-triangle"></i>
        {{ error }}
        <button type="button" class="btn btn-outline-danger btn-sm ms-2" (click)="onRetry()">
          <i class="bi bi-arrow-clockwise"></i> Retry
        </button>
      </div>

      <!-- Empty State -->
      <div *ngIf="!loading && !error && tasks.length === 0" class="text-center py-5">
        <i class="bi bi-inbox display-1 text-muted"></i>
        <h3 class="mt-3 text-muted">No tasks found</h3>
        <p class="text-muted">
          <span *ngIf="filter.search || filter.completed !== undefined">
            Try adjusting your filters or
          </span>
          <a href="javascript:void(0)" (click)="onCreateNew()" class="text-decoration-none">
            create your first task
          </a>
        </p>
      </div>

      <!-- Task List -->
      <div *ngIf="!loading && !error && tasks.length > 0" class="row">
        <div class="col-12">
          <div class="mb-3 d-flex justify-content-between align-items-center">
            <h5 class="mb-0">
              {{ filteredTasksTitle }}
            </h5>
            <button type="button" class="btn btn-success" (click)="onCreateNew()">
              <i class="bi bi-plus-circle"></i> New Task
            </button>
          </div>

          <div class="task-grid">
            <app-task-card
              *ngFor="let task of tasks; trackBy: trackByTaskId"
              [task]="task"
              (toggleComplete)="onToggleComplete($event)"
              (edit)="onEdit($event)"
              (delete)="onDelete($event)">
            </app-task-card>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .task-grid {
      display: grid;
      gap: 1rem;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
    }

    .btn-check:checked + .btn {
      font-weight: bold;
    }

    .loading-container {
      background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);
      border-radius: 15px;
      padding: 3rem 2rem;
      margin: 2rem 0;
      box-shadow: 0 4px 15px rgba(0,0,0,0.1);
      border: 1px solid rgba(0,0,0,0.05);
    }

    .loading-animation {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .loading-animation .spinner-grow {
      animation-duration: 1.5s;
    }

    .loading-container h5 {
      font-weight: 600;
      letter-spacing: 0.5px;
    }

    .loading-container p {
      font-size: 0.9rem;
      opacity: 0.8;
    }

    @media (max-width: 768px) {
      .task-grid {
        grid-template-columns: 1fr;
      }

      .loading-container {
        padding: 2rem 1rem;
        margin: 1rem 0;
      }

      .loading-animation .spinner-grow {
        width: 2rem !important;
        height: 2rem !important;
      }
    }
  `]
})
export class TaskListComponent {
  @Input({ required: true }) tasks: Task[] = [];
  @Input() loading = false;
  @Input() error: string | null = null;
  @Input() filter: TaskFilter = {};

  @Output() filterChange = new EventEmitter<TaskFilter>();
  @Output() toggleComplete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();
  @Output() createNew = new EventEmitter<void>();
  @Output() retry = new EventEmitter<void>();

  get totalTasks(): number {
    return this.tasks.length;
  }

  get pendingCount(): number {
    return this.tasks.filter(task => !task.completed).length;
  }

  get completedCount(): number {
    return this.tasks.filter(task => task.completed).length;
  }

  get filteredTasksTitle(): string {
    if (this.filter.completed === true) {
      return `Completed Tasks (${this.completedCount})`;
    } else if (this.filter.completed === false) {
      return `Pending Tasks (${this.pendingCount})`;
    }
    return `All Tasks (${this.totalTasks})`;
  }

  trackByTaskId(index: number, task: Task): number {
    return task.id || index;
  }

  onFilterChange(completed: boolean | undefined): void {
    this.filterChange.emit({ ...this.filter, completed });
  }

  onSearchChange(event: Event): void {
    const search = (event.target as HTMLInputElement).value;
    this.filterChange.emit({ ...this.filter, search });
  }

  onClearSearch(): void {
    this.filterChange.emit({ ...this.filter, search: '' });
  }

  onToggleComplete(taskId: number): void {
    this.toggleComplete.emit(taskId);
  }

  onEdit(taskId: number): void {
    this.edit.emit(taskId);
  }

  onDelete(taskId: number): void {
    this.delete.emit(taskId);
  }

  onCreateNew(): void {
    this.createNew.emit();
  }

  onRetry(): void {
    this.retry.emit();
  }
}
