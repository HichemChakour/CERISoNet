import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private apiUrl = 'https://pedago.univ-avignon.fr:3205/user/'; // Base URL de l'API

  constructor(private http: HttpClient) {}

  // Méthode pour récupérer les messages de l'utilisateur
  getUserMessages(userId: string): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}messages/${userId}`).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des messages :', error);
        return throwError(() => new Error('Impossible de récupérer les messages.'));
      })
    );
  }
}