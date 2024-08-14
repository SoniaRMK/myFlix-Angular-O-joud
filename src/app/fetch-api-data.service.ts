import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpHeaders,
  HttpErrorResponse,
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class FetchApiDataService {
  apiUrl = 'https://movie-api-joud-a1d184147f81.herokuapp.com';

  constructor(private http: HttpClient) {}

  // Get token from local storage
  private getToken(): string {
    return localStorage.getItem('token') || '';
  }

  // User registration
  public userRegistration(userDetails: any): Observable<any> {
    return this.http
      .post(`${this.apiUrl}/users`, userDetails)
      .pipe(catchError(this.handleError));
  }

  // User login
  public userLogin(userDetails: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, userDetails).pipe(
      tap((response: any) => {
        localStorage.setItem('token', response.token);
      }),
      catchError(this.handleError)
    );
  }

  // Get all movies
  public getAllMovies(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get(`${this.apiUrl}/movies`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Get one movie by title
  public getOneMovie(title: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get(`${this.apiUrl}/movies/title/${title}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Get movies by genre
  public getMoviesByGenre(genre: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get(`${this.apiUrl}/movies/genre/${genre}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Get all users
  public getAllUsers(): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get(`${this.apiUrl}/users`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Get a user by username
  public getUser(username: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .get(`${this.apiUrl}/users/${username}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Add a movie to user's list of favorites
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

  // Update user information
  public updateUser(username: string, userDetails: any): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .put(`${this.apiUrl}/users/${username}`, userDetails, { headers })
      .pipe(catchError(this.handleError));
  }

  // Remove a movie from user's list of favorites
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

  // Delete a user by username
  public deleteUser(username: string): Observable<any> {
    const token = this.getToken();
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);
    return this.http
      .delete(`${this.apiUrl}/users/${username}`, { headers })
      .pipe(catchError(this.handleError));
  }

  // Handle API errors
  private handleError(error: HttpErrorResponse): any {
    console.error(error);
    return throwError(() => new Error(error.message || 'Server error'));
  }
}
