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
  @Input() userData = {
    Username: '',
    Password: '',
    Email: '',
    Birthday: '',
    FavoriteMovies: [],
  };

  currentUser = JSON.parse(localStorage.getItem('user') || '{}');
  FavMovies: any[] = this.currentUser.FavoriteMovies || [];
  user: any = {};
  movies: any[] = [];

  constructor(
    public fetchApiData: FetchApiDataService,
    public snackBar: MatSnackBar,
    public router: Router,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getUserProfile();
    this.getFavMovies();
  }

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

  getFavMovies(): void {
    const username = this.currentUser.Username;
    this.fetchApiData.getAllMovies().subscribe((resp: any) => {
      const movies = resp;
      this.FavMovies = movies.filter((m: any) =>
        this.FavMovies.includes(m._id)
      );
    });
  }


  isFavCheck(movie: any): boolean {
    return this.FavMovies.some((id) => id === movie._id);
  }

  toggleFav(movie: any): void {
    const isFavorite = this.isFavCheck(movie);
    if (isFavorite) {
      this.removeFav(movie);
    } else {
      this.addFav(movie);
    }
  }

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
