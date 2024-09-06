import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatDialogRef } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

/**
 * Component for the user login form.
 * Allows users to input their credentials and log in.
 */
@Component({
  selector: 'app-user-login-form',
  standalone: true,
  templateUrl: './user-login-form.component.html',
  styleUrls: ['./user-login-form.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
  ],
})
export class UserLoginFormComponent implements OnInit {
  /**
   * Holds the user's input data for login.
   * @type {{ Username: string; Password: string; }}
   */
  @Input() userData = {
    Username: '',
    Password: '',
  };

  /**
   * Constructor for UserLoginFormComponent.
   * Injects necessary services for API data fetching, dialog management, snackbar notifications, and routing.
   *
   * @param fetchApiData Service for fetching data from the API.
   * @param dialogRef Reference to the dialog containing this component.
   * @param snackBar Service for displaying snack-bar notifications.
   * @param router Router for navigating to different routes.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserLoginFormComponent>,
    public snackBar: MatSnackBar,
    private router: Router
  ) {}

  /**
   * Angular lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void {}

  /**
   * Logs in the user by sending the login data to the API.
   * On successful login, stores the user data and token in local storage,
   * closes the dialog, shows a success notification, and navigates to the movies page.
   * If login fails, shows a failure notification.
   */
  loginUser(): void {
    this.fetchApiData.userLogin(this.userData).subscribe(
      (result) => {
        localStorage.setItem('user', JSON.stringify(result.user));
        localStorage.setItem('token', result.token);
        this.dialogRef.close();
        this.snackBar.open('User login successful', 'OK', {
          duration: 2000,
        });
        this.router.navigate(['movies']);
      },
      (error) => {
        this.snackBar.open('User login failed', 'OK', {
          duration: 2000,
        });
      }
    );
  }
}
