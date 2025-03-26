import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, catchError, map ,throwError } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private userSubject = new BehaviorSubject<any>(null);
  public user$ = this.userSubject.asObservable();

  constructor(private http: HttpClient) {}

  //envoie de la requette login
  login(credentials: any) {
    return this.http.post<{ 
      message: string,
      userId: number,
      pseudo: string,
      firstName: string,
      lastName: string,
      session : string,
      lastConnexion :any,
      avatar :String }>('https://pedago.univ-avignon.fr:3205/login', credentials, { withCredentials: true });
  }

  //voir il est connecté
  getSession(sessionId: string): Observable<{ username: string }> {
    if (!sessionId) return throwError(() => new Error("Session vide")); 

    return this.http.get<{ username?: string; message?: string }>(
      `https://pedago.univ-avignon.fr:3205/session?sessionId=${sessionId}`,
      { withCredentials: true }
    ).pipe(
      map(response => {
        if (response.message) {
          throw new Error(response.message); 
        }
        return response as { username: string };
      }),
      catchError(err => throwError(() => new Error(err.message || "Erreur inconnue")))
    );
  }

  setUser(user: any) {
    this.userSubject.next(user);
  }

  //deconction
  logout(): Observable<void> {
    const sessionCookie = document.cookie.split('; ').find(row => row.startsWith('session='))?.split('=')[1];
    return this.http.post<void>('https://pedago.univ-avignon.fr:3205/logout', { session : sessionCookie }, { withCredentials: true });
  }
}