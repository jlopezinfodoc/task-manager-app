import { Component, Input, Output, EventEmitter, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Task, TaskForm } from '../../models';

@Component({
  selector: 'app-task-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="card">
      <div class="card-header">
        <h5 class="card-title mb-0">
          <i class="bi" [class.bi-plus-circle]="!editMode" [class.bi-pencil]="editMode"></i>
          {{ editMode ? 'Edit Task' : 'Create New Task' }}
        </h5>
      </div>
      <div class="card-body">
        <form [formGroup]="taskForm" (ngSubmit)="onSubmit()" novalidate>
          <div class="mb-3">
            <label for="title" class="form-label">Title *</label>
            <input
              type="text"
              id="title"
              class="form-control"
              formControlName="title"
              [class.is-invalid]="titleControl?.invalid && titleControl?.touched"
              placeholder="Enter task title">
            <div class="invalid-feedback" *ngIf="titleControl?.invalid && titleControl?.touched">
              <div *ngIf="titleControl?.errors?.['required']">Title is required</div>
              <div *ngIf="titleControl?.errors?.['minlength']">Title must be at least 3 characters</div>
              <div *ngIf="titleControl?.errors?.['maxlength']">Title cannot exceed 100 characters</div>
            </div>
          </div>

          <div class="mb-3">
            <label for="description" class="form-label">Description</label>
            <textarea
              id="description"
              class="form-control"
              formControlName="description"
              [class.is-invalid]="descriptionControl?.invalid && descriptionControl?.touched"
              rows="4"
              placeholder="Enter task description (optional)">
            </textarea>
            <div class="invalid-feedback" *ngIf="descriptionControl?.invalid && descriptionControl?.touched">
              <div *ngIf="descriptionControl?.errors?.['maxlength']">Description cannot exceed 500 characters</div>
            </div>
          </div>

          <div class="d-flex gap-2 justify-content-end">
            <button
              type="button"
              class="btn btn-secondary"
              (click)="onCancel()"
              [disabled]="loading">
              <i class="bi bi-x-circle"></i>
              Cancel
            </button>
            <button
              type="submit"
              class="btn btn-primary"
              [disabled]="taskForm.invalid || loading">
              <span *ngIf="loading" class="spinner-border spinner-border-sm me-2" role="status"></span>
              <i *ngIf="!loading" class="bi" [class.bi-plus-circle]="!editMode" [class.bi-check-circle]="editMode"></i>
              {{ editMode ? 'Update Task' : 'Create Task' }}
            </button>
          </div>
        </form>
      </div>
    </div>

    <!-- Error Alert -->
    <div *ngIf="error" class="alert alert-danger mt-3" role="alert">
      <i class="bi bi-exclamation-triangle"></i>
      {{ error }}
    </div>
  `,
  styles: [`
    .form-control:focus {
      border-color: #0d6efd;
      box-shadow: 0 0 0 0.2rem rgba(13, 110, 253, 0.25);
    }

    .btn:disabled {
      opacity: 0.6;
    }

    .spinner-border-sm {
      width: 1rem;
      height: 1rem;
    }
  `]
})
export class TaskFormComponent implements OnInit, OnChanges {
  @Input() task: Task | null = null;
  @Input() loading = false;
  @Input() error: string | null = null;

  @Output() submit = new EventEmitter<TaskForm>();
  @Output() cancel = new EventEmitter<void>();

  taskForm!: FormGroup;

  constructor(private fb: FormBuilder) {
    this.initializeForm();
  }

  ngOnInit(): void {
    this.initializeForm();
    this.populateForm();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['task'] && this.taskForm) {
      this.populateForm();
    }
  }

  get editMode(): boolean {
    return this.task !== null && this.task.id !== undefined;
  }

  get titleControl() {
    return this.taskForm.get('title');
  }

  get descriptionControl() {
    return this.taskForm.get('description');
  }

  private initializeForm(): void {
    this.taskForm = this.fb.group({
      title: ['', [
        Validators.required,
        Validators.minLength(3),
        Validators.maxLength(100)
      ]],
      description: ['', [
        Validators.maxLength(500)
      ]]
    });
  }

  private populateForm(): void {
    if (this.task) {
      this.taskForm.patchValue({
        title: this.task.title || '',
        description: this.task.description || ''
      });
    } else {
      this.taskForm.reset();
    }
  }

  onSubmit(): void {
    if (this.taskForm.valid) {
      const formValue = this.taskForm.value;
      const taskForm: TaskForm = {
        title: formValue.title.trim(),
        description: formValue.description?.trim() || ''
      };

      this.submit.emit(taskForm);
    } else {
      // Mark all fields as touched to show validation errors
      Object.keys(this.taskForm.controls).forEach(key => {
        this.taskForm.get(key)?.markAsTouched();
      });
    }
  }

  onCancel(): void {
    this.cancel.emit();
  }
}
