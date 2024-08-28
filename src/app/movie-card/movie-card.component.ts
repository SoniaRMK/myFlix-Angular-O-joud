import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { FetchApiDataService } from '../fetch-api-data.service';
import { MatIconModule } from '@angular/material/icon';
import { MatDialogModule } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-movie-card',
  templateUrl: './movie-card.component.html',
  styleUrls: ['./movie-card.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatDialogModule,
  ],
})
export class MovieCardComponent implements OnInit {
  movies: any[] = [];
  FavMovies: any[] = [];

  constructor(
    private fetchApiData: FetchApiDataService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.getMovies();
    this.getFavoriteMovies(); // Initialize favorite movies
  }

  getMovies(): void {
    this.fetchApiData.getAllMovies().subscribe({
      next: (results: any) => {
        this.movies = results;
        console.log(this.movies);
      },
      error: (err) => {
        console.error('Error fetching movies:', err);
        alert('Failed to load movies. Please try again later.');
      },
    });
  }

  getFavoriteMovies(): void {
    const username = JSON.parse(localStorage.getItem('user') || '{}').Username;
    this.fetchApiData.getUser(username).subscribe((user: any) => {
      this.FavMovies = user.FavoriteMovies || [];
      console.log('Favorite movies:', this.FavMovies);
    });
  }

  showGenre(genreName: string): void {
    this.snackBar.open(`Genre: ${genreName}`, 'OK', { duration: 2000 });
  }

  showDirector(directorName: string): void {
    this.snackBar.open(`Director: ${directorName}`, 'OK', { duration: 2000 });
  }

  showDetail(movie: any): void {
    this.snackBar.open(`Synopsis: ${movie.Description}`, 'OK', {
      duration: 4000,
    });
  }

  isFavCheck(movie: any): boolean {
    return this.FavMovies.some((id) => id === movie._id);
  }

  toggleFav(movie: any): void {
    const isFavorite = this.isFavCheck(movie);
    console.log(`Toggling favorite status for ${movie.Title}: ${isFavorite}`);

    if (isFavorite) {
      this.removeFav(movie);
    } else {
      this.addFav(movie);
    }
  }

  addFav(movie: any): void {
    const username = JSON.parse(localStorage.getItem('user') || '{}').Username;
    console.log(`Adding ${movie.Title} to favorites for user ${username}`);

    this.fetchApiData.addFavoriteMovie(username, movie._id).subscribe({
      next: (resp: any) => {
        console.log(`Successfully added ${movie.Title} to favorites`, resp);
        this.FavMovies.push(movie._id);
        this.snackBar.open('Movie added to Favourites!', 'OK', {
          duration: 2000,
        });

        // Update local storage directly
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.FavoriteMovies.push(movie._id);
        localStorage.setItem('user', JSON.stringify(user));
      },
      error: (err: any) => {
        console.error(`Error adding ${movie.Title} to favorites`, err);
        if (err.error) {
          console.error('Error details:', err.error); // Log error details
        }
        this.snackBar.open(
          'Failed to add movie to Favourites. Please check the console for more details.',
          'OK',
          {
            duration: 2000,
          }
        );
      },
    });
  }

  removeFav(movie: any): void {
    const username = JSON.parse(localStorage.getItem('user') || '{}').Username;
    console.log(`Removing ${movie.Title} from favorites for user ${username}`);

    this.fetchApiData.removeFavoriteMovie(username, movie._id).subscribe({
      next: (resp: any) => {
        console.log(`Successfully removed ${movie.Title} from favorites`, resp);
        this.FavMovies = this.FavMovies.filter(
          (id: string) => id !== movie._id
        );
        this.snackBar.open('Movie removed from Favourites.', 'OK', {
          duration: 2000,
        });

        // Update local storage directly
        const user = JSON.parse(localStorage.getItem('user') || '{}');
        user.FavoriteMovies = user.FavoriteMovies.filter(
          (id: string) => id !== movie._id
        );
        localStorage.setItem('user', JSON.stringify(user));
      },
      error: (err: any) => {
        console.error(`Error removing ${movie.Title} from favorites`, err);
        this.snackBar.open('Failed to remove movie from Favourites.', 'OK', {
          duration: 2000,
        });
      },
    });
  }
}
