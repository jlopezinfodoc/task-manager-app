import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Task } from '../../models';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="card mb-3" [class.border-success]="task.completed">
      <div class="card-body">
        <div class="d-flex justify-content-between align-items-start">
          <div class="flex-grow-1">
            <h5 class="card-title" [class.text-decoration-line-through]="task.completed">
              {{ task.title }}
            </h5>
            <p class="card-text" [class.text-muted]="task.completed">
              {{ task.description }}
            </p>
            <small class="text-muted">
              Created: {{ task.createdAt | date:'short' }}
            </small>
          </div>
          <div class="btn-group" role="group">
            <button
              type="button"
              class="btn btn-sm"
              [class.btn-success]="task.completed"
              [class.btn-outline-success]="!task.completed"
              (click)="onToggleComplete()"
              [title]="task.completed ? 'Mark as incomplete' : 'Mark as complete'">
              <i class="bi" [class.bi-check-circle-fill]="task.completed" [class.bi-circle]="!task.completed"></i>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-primary"
              (click)="onEdit()"
              title="Edit task">
              <i class="bi bi-pencil"></i>
            </button>
            <button
              type="button"
              class="btn btn-sm btn-outline-danger"
              (click)="onDelete()"
              title="Delete task">
              <i class="bi bi-trash"></i>
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card {
      transition: all 0.2s ease-in-out;
    }

    .card:hover {
      box-shadow: 0 4px 8px rgba(0,0,0,0.1);
    }

    .btn-group .btn {
      margin-left: 2px;
    }
  `]
})
export class TaskCardComponent {
  @Input({ required: true }) task!: Task;

  @Output() toggleComplete = new EventEmitter<number>();
  @Output() edit = new EventEmitter<number>();
  @Output() delete = new EventEmitter<number>();

  onToggleComplete(): void {
    if (this.task.id) {
      this.toggleComplete.emit(this.task.id);
    }
  }

  onEdit(): void {
    if (this.task.id) {
      this.edit.emit(this.task.id);
    }
  }

  onDelete(): void {
    if (this.task.id) {
      this.delete.emit(this.task.id);
    }
  }
}
