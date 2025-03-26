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

  toggleLike(messageId: number, userId: number): Observable<any> {
    const url = `${this.apiUrl}/like`; // URL de l'API pour liker/unliker
    const body = { messageId, userId }; // Corps de la requête
  
    return this.http.post<any>(url, body).pipe(
      catchError((error) => {
        console.error('Erreur lors de la mise à jour du like :', error);
        return throwError(() => new Error('Impossible de mettre à jour le like.'));
      })
    );
  }

  addComment(messageId: number, text: string): Observable<any> {
    const commentedBy = document.cookie.split('; ').find(row => row.startsWith('userId='))?.split('=')[1];
    const url = `${this.apiUrl}/comment`; // URL de l'API pour ajouter un commentaire
    const body = { messageId, text, commentedBy }; // Corps de la requête
  
    return this.http.post<any>(url, body).pipe(
      catchError((error) => {
        console.error('Erreur lors de l\'ajout du commentaire :', error);
        return throwError(() => new Error('Impossible d\'ajouter le commentaire.'));
      })
    );
  }

    createMessage(messageData: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}/create`, messageData).pipe(
      catchError((error) => {
        console.error('Erreur lors de la création du message :', error);
        return throwError(() => new Error('Impossible de créer le message.'));
      })
    );
  }
}