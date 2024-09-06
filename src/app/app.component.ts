import { Component } from '@angular/core';
import { RouterModule, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NavigationComponent } from './navigation/navigation.component';

/**
 * Root component of the Angular application.
 * Provides the main structure and routing logic for the app.
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true, // Indicates this component is a standalone component
  imports: [RouterModule, CommonModule, NavigationComponent],
})
export class AppComponent {
  /** The title of the application, used for display purposes */
  title = 'myFlix-Angular-client2';

  /**
   * Constructor for AppComponent.
   * Injects the Router service to manage navigation within the app.
   *
   * @param router The Router service for navigation
   */
  constructor(public router: Router) {}
}
