import { Routes } from '@angular/router';
import { WelcomePageComponent } from './welcome-page/welcome-page.component';
import { MovieCardComponent } from './movie-card/movie-card.component';
import { UserProfileComponent } from './user-profile/user-profile.component';

/**
 * Defines the routes for the Angular application.
 * Each route is associated with a specific component.
 */
export const routes: Routes = [
  /** Route for the welcome page. */
  { path: 'welcome', component: WelcomePageComponent },

  /** Route for displaying all movies. */
  { path: 'movies', component: MovieCardComponent },

  /** Route for displaying the user profile page. */
  { path: 'profile', component: UserProfileComponent },

  /** Default route that redirects to the welcome page. */
  { path: '', redirectTo: 'welcome', pathMatch: 'full' },
];
