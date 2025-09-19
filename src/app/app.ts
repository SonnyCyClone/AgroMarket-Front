import { Component, signal } from '@angular/core';
import { AppShellComponent } from './layout/app-shell/app-shell.component';
import { ToastContainerComponent } from './shared/toast-container/toast-container.component';

@Component({
  selector: 'app-root',
  imports: [AppShellComponent, ToastContainerComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('AgroMarket-Front');
}
