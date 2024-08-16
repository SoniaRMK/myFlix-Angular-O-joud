import { Component, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user-profile',
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
  ],
  providers: [MatSnackBar],
})
export class UserProfileComponent implements OnInit {
  user: any = {}; // Initialize the user property

  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.getUserProfile();
  }

  getUserProfile(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user && user.Username) {
      this.fetchApiData.getUser(user.Username).subscribe({
        next: (response: any) => {
          this.user = response;
          console.log(this.user);
        },
        error: (err) => {
          console.error('Error fetching user profile:', err);
          this.snackBar.open('Error fetching user profile', 'OK', {
            duration: 3000,
          });
        },
      });
    } else {
      console.error('No username found in localStorage');
      this.snackBar.open('No username found in localStorage', 'OK', {
        duration: 3000,
      });
    }
  }

  editProfile(): void {
    // Logic to edit profile
    console.log('Profile editing is not implemented yet');
  }

  deleteProfile(): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    if (user && user.Username) {
      this.fetchApiData.deleteUser(user.Username).subscribe({
        next: () => {
          this.snackBar.open('Profile deleted successfully', 'OK', {
            duration: 3000,
          });
          localStorage.clear();
          this.router.navigate(['/welcome']);
        },
        error: (err) => {
          console.error('Error deleting user profile:', err);
          this.snackBar.open('Error deleting profile', 'OK', {
            duration: 3000,
          });
        },
      });
    } else {
      console.error('No username found in localStorage');
      this.snackBar.open('No username found in localStorage', 'OK', {
        duration: 3000,
      });
    }
  }
}
