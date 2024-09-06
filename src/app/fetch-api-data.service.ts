import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

/**
 * Service for interacting with the movie API.
 * Provides methods for user registration, login, and various movie-related operations.
 */
@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  /** The base URL of the movie API */
  apiUrl = 'https://movie-api-joud-a1d184147f81.herokuapp.com';

  /**
   * Constructor for FetchApiDataService.
   * Injects the HttpClient to perform HTTP requests.
   *
   * @param http The HttpClient used for making HTTP requests.
   */
  constructor(private http: HttpClient) {}

  /**
   * Retrieves the token from local storage.
   * @returns The token string or an empty string if not found.
   */
  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  /**
   * Registers a new user.
   * @param userDetails The user details object containing username, password, email, etc.
   * @returns An Observable containing the response from the API.
   */
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/users`, userDetails)
      .pipe(catchError(this.handleError));
  }

  /**
   * Logs in an existing user.
   * @param userDetails The user details object containing username and password.
   * @returns An Observable containing the response from the API.
   */
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, userDetails).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
      }),
      catchError(this.handleError)
    );
  }

  /**
   * Fetches all movies from the API.
   * @returns An Observable containing the list of all movies.
   */
  public getAllMovies(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get(`${this.apiUrl}/movies`, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches a single movie by its title.
   * @param title The title of the movie.
   * @returns An Observable containing the movie details.
   */
  public getOneMovie(title: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get(`${this.apiUrl}/movies/title/${title}`, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches movies by a specific genre.
   * @param genre The genre of the movies.
   * @returns An Observable containing a list of movies that match the genre.
   */
  public getMoviesByGenre(genre: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get(`${this.apiUrl}/movies/genre/${genre}`, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches all users from the API.
   * @returns An Observable containing the list of all users.
   */
  public getAllUsers(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get(`${this.apiUrl}/users`, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Fetches a user by their username.
   * @param username The username of the user.
   * @returns An Observable containing the user details.
   */
  public getUser(username: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get(`${this.apiUrl}/users/${username}`, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Adds a movie to a user's list of favorite movies.
   * @param username The username of the user.
   * @param movieId The ID of the movie to add to favorites.
   * @returns An Observable containing the response from the API.
   */
  public addFavoriteMovie(username: string, movieId: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .post(
        `${this.apiUrl}/users/${username}/favorites/${movieId}`,
        {},
        { headers }
      )
      .pipe(catchError(this.handleError));
  }

  /**
   * Updates a user's information.
   * @param username The username of the user.
   * @param userDetails The updated user details.
   * @returns An Observable containing the response from the API.
   */
  public updateUser(username: string, userDetails: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .put(`${this.apiUrl}/users/${username}`, userDetails, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Removes a movie from a user's list of favorite movies.
   * @param username The username of the user.
   * @param movieId The ID of the movie to remove from favorites.
   * @returns An Observable containing the response from the API.
   */
  public removeFavoriteMovie(
    username: string,
    movieId: string
  ): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .delete(`${this.apiUrl}/users/${username}/movies/${movieId}`, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Deletes a user by their username.
   * @param username The username of the user to delete.
   * @returns An Observable containing the response from the API.
   */
  public deleteUser(username: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .delete(`${this.apiUrl}/users/${username}`, { headers })
      .pipe(catchError(this.handleError));
  }

  /**
   * Handles errors from API responses.
   * Logs the error to the console and returns an observable with a user-facing error message.
   * @param error The HttpErrorResponse returned by the HTTP client.
   * @returns An Observable that throws an error.
   */
  private handleError(error: HttpErrorResponse): Observable<never> {
    console.error(error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}
