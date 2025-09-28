import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EnvironmentService } from '../services/environment.service';

@Component({
  selector: 'app-environment-info',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="environment-info" *ngIf="!environmentService.isProduction">
      <div class="badge bg-info text-dark mb-2">
        <i class="bi bi-info-circle"></i>
        {{ environmentService.appName }} v{{ environmentService.version }}
      </div>
      <div class="small text-muted">
        API: {{ environmentService.apiUrl }}
      </div>
    </div>
  `,
  styles: [`
    .environment-info {
      position: fixed;
      top: 10px;
      right: 10px;
      z-index: 1050;
      font-size: 0.8rem;
    }

    .badge {
      display: block;
      margin-bottom: 5px;
    }

    @media (max-width: 768px) {
      .environment-info {
        position: relative;
        top: auto;
        right: auto;
        margin-bottom: 1rem;
      }
    }
  `]
})
export class EnvironmentInfoComponent {
  constructor(public environmentService: EnvironmentService) {}
}
