import { Component, Input, OnInit } from '@angular/core';
import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatDividerModule } from '@angular/material/divider';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { MovieCardComponent } from '../movie-card/movie-card.component';

/**
 * Component for displaying and updating user profile information,
 * as well as managing the user's favorite movies.
 */
@Component({
  selector: 'app-user-profile',
  standalone: true,
  templateUrl: './user-profile.component.html',
  styleUrls: ['./user-profile.component.scss'],
  imports: [
    CommonModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    FormsModule,
    MatIconModule,
    MatDividerModule,
    MovieCardComponent,
  ],
})
export class UserProfileComponent implements OnInit {
  /**
   * Object to store user data for updating profile.
   * Initialized with default values.
   */
  @Input() userData = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
    FavoriteMovies: [],
  };

  /** Current user information loaded from local storage. */
  currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  /** List of user's favorite movies. */
  FavMovies: any[] = this.currentUser.FavoriteMovies || [];
  /** Holds user details fetched from the API. */
  user: any = {};
  /** List of all movies. */
  movies: any[] = [];

  /**
   * Constructor for UserProfileComponent. Injects necessary services.
   * @param fetchApiData Service for fetching data from the API.
   * @param snackBar Service for displaying snack-bar notifications.
   * @param router Service for navigation.
   * @param dialog Service for dialog operations.
   */
  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog
  ) {}

  /**
   * Angular lifecycle hook that is called after data-bound properties are initialized.
   * Fetches user profile and favorite movies.
   */
  ngOnInit(): void {
    this.getUserProfile();
    this.getFavMovies();
  }

  /**
   * Fetches the user's profile data from the API and updates local userData.
   */
  getUserProfile(): void {
    const username = this.currentUser.Username;
    this.fetchApiData.getUser(username).subscribe((user: any) => {
      this.user = user;
      this.userData.Username = user.Username;
      this.userData.Email = user.Email;
      this.userData.Birthday = user.Birthday;
      this.FavMovies = user.FavoriteMovies || [];
      this.fetchApiData.getAllMovies().subscribe((response) => {
        this.FavMovies = response.filter((movie: any) =>
          this.FavMovies.includes(movie._id)
        );
      });
    });
  }

  /**
   * Updates the user's profile information with the provided data.
   */
  updateUserProfile(): void {
    const username = this.currentUser.Username;
    this.fetchApiData
      .updateUser(username, this.userData)
      .subscribe((result) => {
        console.log('Updated user info!');
        localStorage.setItem('user', JSON.stringify(result));
        this.snackBar.open('User profile updated!', 'OK', {
          duration: 2000,
        });
      });
  }

  /**
   * Deletes the user's profile from the database and clears local storage.
   */
  deleteUserProfile(): void {
    const username = this.currentUser.Username;
    this.fetchApiData.deleteUser(username).subscribe((result) => {
      console.log(result);
      this.router.navigate(['welcome']).then(() => {
        localStorage.clear();
        this.snackBar.open('User profile has been deleted.', 'OK', {
          duration: 2000,
        });
      });
    });
  }

  /**
   * Fetches all movies and filters the user's favorite movies.
   */
  getFavMovies(): void {
    const username = this.currentUser.Username;
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      const movies = resp;
      this.FavMovies = movies.filter((m: any) =>
        this.FavMovies.includes(m._id)
      );
    });
  }

  /**
   * Checks if a movie is in the user's favorite list.
   * @param movie The movie to check.
   * @returns True if the movie is a favorite, false otherwise.
   */
  isFavCheck(movie: any): boolean {
    return this.FavMovies.some((id) => id === movie._id);
  }

  /**
   * Toggles a movie's favorite status.
   * @param movie The movie to toggle.
   */
  toggleFav(movie: any): void {
    const isFavorite = this.isFavCheck(movie);
    if (isFavorite) {
      this.removeFav(movie);
    } else {
      this.addFav(movie);
    }
  }

  /**
   * Adds a movie to the user's favorite list.
   * @param movie The movie to add.
   */
  addFav(movie: any): void {
    const username = this.currentUser.Username;
    this.fetchApiData
      .addFavoriteMovie(username, movie._id)
      .subscribe((resp: any) => {
        console.log(resp);
        this.FavMovies.push(movie._id);
        this.updateLocalStorageFavorites(movie._id, 'add');
        this.snackBar.open('Movie added to Favourites!', 'OK', {
          duration: 2000,
        });
      });
  }

  /**
   * Removes a movie from the user's favorite list.
   * @param movie The movie to remove.
   */
  removeFav(movie: any): void {
    const username = this.currentUser.Username;
    this.fetchApiData
      .removeFavoriteMovie(username, movie._id)
      .subscribe((resp: any) => {
        console.log(resp);
        this.FavMovies = this.FavMovies.filter(
          (id: string) => id !== movie._id
        );
        this.updateLocalStorageFavorites(movie._id, 'remove');
        this.snackBar.open('Movie removed from Favourites.', 'OK', {
          duration: 2000,
        });
      });
  }

  /**
   * Updates the user's favorite movies in local storage based on action.
   * @param movieId The movie ID to update.
   * @param action The action to perform ('add' or 'remove').
   */
  private updateLocalStorageFavorites(
    movieId: string,
    action: 'add' | 'remove'
  ): void {
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (action === 'add') {
      user.FavoriteMovies.push(movieId);
    } else {
      user.FavoriteMovies = user.FavoriteMovies.filter(
        (id: string) => id !== movieId
      );
    }
    localStorage.setItem('user', JSON.stringify(user));
  }
}
