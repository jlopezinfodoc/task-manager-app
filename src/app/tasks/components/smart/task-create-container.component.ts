import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TaskForm } from '../../models';
import { TaskBusinessService } from '../../business';
import { TaskFormComponent } from '../presentational/task-form.component';

@Component({
  selector: 'app-task-create-container',
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
                <li class="breadcrumb-item active" aria-current="page">Create New Task</li>
              </ol>
            </nav>
          </div>

          <app-task-form
            [loading]="loading"
            [error]="error"
            (submit)="onCreateTask($event)"
            (cancel)="navigateToList()">
          </app-task-form>
        </div>
      </div>
    </div>
  `
})
export class TaskCreateContainerComponent {
  loading = false;
  error: string | null = null;

  constructor(
    private taskBusinessService: TaskBusinessService,
    private router: Router
  ) {}

  async onCreateTask(taskForm: TaskForm): Promise<void> {
    this.loading = true;
    this.error = null;

    try {
      await this.taskBusinessService.createTask(taskForm);
      this.navigateToList();
    } catch (error) {
      // Los errores ya se manejan en el business service con SweetAlert2
      console.error('Error creating task:', error);
    } finally {
      this.loading = false;
    }
  }

  navigateToList(): void {
    this.router.navigate(['/tasks']);
  }
}
