import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service'; // Import du service

@Component({
  selector: 'app-detailed-poste',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './detailed-poste.component.html',
  styleUrl: './detailed-poste.component.css'
})
export class DetailedPosteComponent {
  @Input() message: any; // Message à afficher
  @Output() close = new EventEmitter<void>(); // Événement pour fermer la modal

  newComment: string = ''; // Nouveau commentaire

  constructor(private messageService: MessageService) {} // Injection du service

  addComment(): void {
    if (this.newComment.trim()) {
      this.messageService.addComment(this.message._id, this.newComment).subscribe({
        next: (response) => {
          const name = document.cookie.split('; ').find(row => row.startsWith('name='))?.split('=')[1] || '';
          const avatar = document.cookie.split('; ').find(row => row.startsWith('avatar='))?.split('=')[1] || '';
          
          // Ajouter le commentaire localement avec le nom et l'avatar
          this.message.comments.push({
            ...response.comment,
            commentedByUser: {
              pseudo: name,
              avatar: avatar,
              statut_connexion: true
            }
          });
  
          this.newComment = ''; // Réinitialiser le champ
        },
        error: (error) => {
          console.error('Erreur lors de l\'ajout du commentaire :', error);
        }
      });
    }
  }

  closeModal(): void {
    this.close.emit(); // Émet l'événement pour fermer la modal
  }
}