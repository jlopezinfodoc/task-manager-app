import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { EnvironmentInfoComponent } from './core/components/environment-info.component';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, EnvironmentInfoComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'task-manager-app';
}
