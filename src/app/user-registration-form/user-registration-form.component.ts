import { Component, OnInit, Input } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

/**
 * Component for user registration form.
 * Allows users to register by providing username, password, email, and birthday.
 */
@Component({
  selector: 'app-user-registration-form',
  standalone: true,
  templateUrl: './user-registration-form.component.html',
  styleUrls: ['./user-registration-form.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    FormsModule,
  ],
})
export class UserRegistrationFormComponent implements OnInit {
  /**
   * Object to store user input data for registration.
   * Contains properties: Username, Password, Email, and Birthday.
   */
  @Input() userData = { Username: '', Password: '', Email: '', Birthday: '' };

  /**
   * Constructor for UserRegistrationFormComponent.
   * Injects services for API data fetching, dialog reference, and snackbar notifications.
   *
   * @param fetchApiData Service to handle API data fetching.
   * @param dialogRef Reference to the dialog containing this component.
   * @param snackBar Service to display notifications.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public dialogRef: MatDialogRef<UserRegistrationFormComponent>,
    public snackBar: MatSnackBar
  ) {}

  /**
   * Angular lifecycle hook that is called after data-bound properties are initialized.
   */
  ngOnInit(): void {}

  /**
   * Registers a new user by sending the user data to the backend service.
   * Closes the dialog and displays a success notification if registration is successful.
   * Displays an error notification if registration fails.
   */
  registerUser(): void {
    this.fetchApiData.userRegistration(this.userData).subscribe({
      next: (result) => {
        this.dialogRef.close();
        this.snackBar.open('Registration successful!', 'OK', {
          duration: 2000,
        });
      },
      error: (error) => {
        this.snackBar.open('Registration failed: ' + error.message, 'OK', {
          duration: 2000,
        });
      },
    });
  }
}
