import { Component, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TaskFilterRequestDTO } from '../../dtos';

@Component({
  selector: 'app-task-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="card mb-4">
      <div class="card-header">
        <h6 class="mb-0">
          <i class="bi bi-funnel"></i>
          Filtros
        </h6>
      </div>
      <div class="card-body">
        <div class="row g-3">
          <!-- Filtro por estado -->
          <div class="col-md-3">
            <label for="statusFilter" class="form-label">Estado</label>
            <select
              id="statusFilter"
              class="form-select"
              [(ngModel)]="filters.isCompleted"
              (change)="onFilterChange()">
              <option [ngValue]="undefined">Todas</option>
              <option [ngValue]="false">Pendientes</option>
              <option [ngValue]="true">Completadas</option>
            </select>
          </div>

          <!-- Filtro por título -->
          <div class="col-md-3">
            <label for="titleFilter" class="form-label">Título</label>
            <input
              type="text"
              id="titleFilter"
              class="form-control"
              placeholder="Buscar por título..."
              [(ngModel)]="filters.title"
              (input)="onFilterChange()" />
          </div>

          <!-- Filtro por fecha desde -->
          <div class="col-md-3">
            <label for="dateFromFilter" class="form-label">Desde</label>
            <input
              type="date"
              id="dateFromFilter"
              class="form-control"
              [(ngModel)]="filters.createdFrom"
              (change)="onFilterChange()" />
          </div>

          <!-- Filtro por fecha hasta -->
          <div class="col-md-3">
            <label for="dateToFilter" class="form-label">Hasta</label>
            <input
              type="date"
              id="dateToFilter"
              class="form-control"
              [(ngModel)]="filters.createdTo"
              (change)="onFilterChange()" />
          </div>
        </div>

        <div class="row mt-3">
          <div class="col-12">
            <button
              type="button"
              class="btn btn-outline-secondary btn-sm me-2"
              (click)="clearFilters()">
              <i class="bi bi-x-circle"></i>
              Limpiar Filtros
            </button>
            <button
              type="button"
              class="btn btn-primary btn-sm"
              (click)="applyFilters()">
              <i class="bi bi-search"></i>
              Aplicar Filtros
            </button>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .card-header {
      background-color: #f8f9fa;
      border-bottom: 1px solid #dee2e6;
    }

    .form-label {
      font-weight: 500;
      color: #495057;
    }

    .btn-sm {
      padding: 0.25rem 0.5rem;
      font-size: 0.875rem;
    }
  `]
})
export class TaskFilterComponent implements OnInit {
  @Output() filtersChanged = new EventEmitter<TaskFilterRequestDTO>();

  filters: TaskFilterRequestDTO = {
    isCompleted: undefined,
    title: '',
    createdFrom: '',
    createdTo: '',
    pageNumber: 1,
    pageSize: 10
  };

  ngOnInit(): void {
    // Emitir filtros iniciales
    this.filtersChanged.emit(this.filters);
  }

  onFilterChange(): void {
    // Auto-aplicar filtros cuando cambian (excepto para el input de texto que puede ser muy frecuente)
    if (this.filters.title && this.filters.title.length > 0) {
      // Debounce para el filtro de título
      return;
    }
    this.applyFilters();
  }

  applyFilters(): void {
    // Limpiar filtros vacíos
    const cleanFilters: TaskFilterRequestDTO = {
      pageNumber: this.filters.pageNumber,
      pageSize: this.filters.pageSize
    };

    if (this.filters.isCompleted !== undefined) {
      cleanFilters.isCompleted = this.filters.isCompleted;
    }

    if (this.filters.title && this.filters.title.trim()) {
      cleanFilters.title = this.filters.title.trim();
    }

    if (this.filters.createdFrom) {
      cleanFilters.createdFrom = this.filters.createdFrom + 'T00:00:00Z';
    }

    if (this.filters.createdTo) {
      cleanFilters.createdTo = this.filters.createdTo + 'T23:59:59Z';
    }

    this.filtersChanged.emit(cleanFilters);
  }

  clearFilters(): void {
    this.filters = {
      isCompleted: undefined,
      title: '',
      createdFrom: '',
      createdTo: '',
      pageNumber: 1,
      pageSize: 10
    };
    this.applyFilters();
  }
}
