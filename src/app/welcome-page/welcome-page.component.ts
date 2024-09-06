import { Component, OnInit } from '@angular/core';
import { UserLoginFormComponent } from '../user-login-form/user-login-form.component';
import { UserRegistrationFormComponent } from '../user-registration-form/user-registration-form.component';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';

/**
 * Component for the welcome page.
 * Provides options for user registration, login, and viewing all movies.
 */
@Component({
  selector: 'app-welcome-page',
  templateUrl: './welcome-page.component.html',
  styleUrls: ['./welcome-page.component.scss'],
})
export class WelcomePageComponent implements OnInit {
  /**
   * Constructor for WelcomePageComponent.
   * Injects MatDialog for opening dialogs and Router for navigation.
   *
   * @param dialog Service to handle opening of dialogs.
   * @param router Service for navigation.
   */
  constructor(public dialog: MatDialog, private router: Router) {}

  /**
   * Angular lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void {}

  /**
   * Opens a dialog to display the user registration form.
   * Sets the dialog width to 280px.
   */
  openUserRegistrationDialog(): void {
    this.dialog.open(UserRegistrationFormComponent, {
      width: '280px',
    });
  }

  /**
   * Opens a dialog to display the user login form.
   * Sets the dialog width to 280px.
   */
  openUserLoginDialog(): void {
    this.dialog.open(UserLoginFormComponent, {
      width: '280px',
    });
  }

  /**
   * Navigates to the movies page.
   */
  goToAllMovies(): void {
    this.router.navigate(['/movies']);
  }
}
