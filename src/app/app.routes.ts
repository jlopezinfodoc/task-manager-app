import { Routes } from '@angular/router';

export const routes: Routes = [
  // Redirect root to tasks
  { path: '', redirectTo: '/tasks', pathMatch: 'full' },

  // Task routes
  {
    path: 'tasks',
    loadComponent: () => import('./tasks/components/smart/task-list-container.component')
      .then(m => m.TaskListContainerComponent)
  },
  {
    path: 'tasks/create',
    loadComponent: () => import('./tasks/components/smart/task-create-container.component')
      .then(m => m.TaskCreateContainerComponent)
  },
  {
    path: 'tasks/edit/:id',
    loadComponent: () => import('./tasks/components/smart/task-edit-container.component')
      .then(m => m.TaskEditContainerComponent)
  },

  // Wildcard route - must be last
  { path: '**', redirectTo: '/tasks' }
];
