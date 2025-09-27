import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { Task, TaskForm } from '../../models';
import { TaskBusinessService } from '../../business';
import { TaskFormComponent } from '../presentational/task-form.component';

@Component({
  selector: 'app-task-edit-container',
  standalone: true,
  imports: [CommonModule, TaskFormComponent],
  template: `
    <div class="container py-4">
      <div class="row justify-content-center">
        <div class="col-lg-8 col-xl-6">
          <div class="mb-4">
            <nav aria-label="breadcrumb">
              <ol class="breadcrumb">
                <li class="breadcrumb-item">
                  <a href="javascript:void(0)" (click)="navigateToList()" class="text-decoration-none">
                    <i class="bi bi-list-task"></i> Tasks
                  </a>
                </li>
                <li class="breadcrumb-item active" aria-current="page">
                  Edit Task {{ taskId ? '#' + taskId : '' }}
                </li>
              </ol>
            </nav>
          </div>

          <!-- Loading state for initial task fetch -->
          <div *ngIf="loadingTask" class="text-center py-5">
            <div class="spinner-border text-primary" role="status">
              <span class="visually-hidden">Loading task...</span>
            </div>
            <p class="mt-2">Loading task details...</p>
          </div>

          <!-- Error state for task fetch -->
          <div *ngIf="taskFetchError" class="alert alert-danger" role="alert">
            <i class="bi bi-exclamation-triangle"></i>
            {{ taskFetchError }}
            <button type="button" class="btn btn-outline-danger btn-sm ms-2" (click)="loadTask()">
              <i class="bi bi-arrow-clockwise"></i> Retry
            </button>
          </div>

          <!-- Task Form -->
          <app-task-form
            *ngIf="!loadingTask && !taskFetchError"
            [task]="task"
            [loading]="loading"
            [error]="error"
            (submit)="onUpdateTask($event)"
            (cancel)="navigateToList()">
          </app-task-form>
        </div>
      </div>
    </div>
  `
})
export class TaskEditContainerComponent implements OnInit {
  taskId: number | null = null;
  task: Task | null = null;
  loadingTask = false;
  taskFetchError: string | null = null;
  loading = false;
  error: string | null = null;

  constructor(
    private taskBusinessService: TaskBusinessService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.route.params.subscribe(params => {
      const id = params['id'];
      if (id && !isNaN(+id)) {
        this.taskId = +id;
        this.loadTask();
      } else {
        this.taskFetchError = 'Invalid task ID';
      }
    });
  }

  async loadTask(): Promise<void> {
    if (!this.taskId) return;

    this.loadingTask = true;
    this.taskFetchError = null;

    try {
      this.task = await this.taskBusinessService.getTask(this.taskId);
    } catch (error) {
      this.taskFetchError = error instanceof Error ? error.message : 'Failed to load task';
      console.error('Error loading task:', error);
    } finally {
      this.loadingTask = false;
    }
  }

  async onUpdateTask(taskForm: TaskForm): Promise<void> {
    if (!this.taskId) return;

    this.loading = true;
    this.error = null;

    try {
      await this.taskBusinessService.updateTask(this.taskId, taskForm);
      this.navigateToList();
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to update task';
      console.error('Error updating task:', error);
    } finally {
      this.loading = false;
    }
  }

  navigateToList(): void {
    this.router.navigate(['/tasks']);
  }
}
