// filepath: /home/nas-wks01/users/uapv2202051/Donnees_itinerantes_depuis_serveur_pedagogique/CERISoNet/CERISoNetApp/src/app/services/message.service.ts
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class MessageService {
  private apiUrl = 'https://pedago.univ-avignon.fr:3205/messages'; // URL de l'API

  constructor(private http: HttpClient) {}

  getMessages(): Observable<any[]> {
    return this.http.get<any[]>(this.apiUrl).pipe(
      catchError((error) => {
        console.error('Erreur lors de la récupération des messages :', error);
        return throwError(() => new Error('Impossible de récupérer les messages.'));
      })
    );
  }
}