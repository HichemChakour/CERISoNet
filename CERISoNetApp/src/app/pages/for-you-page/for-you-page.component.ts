import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';
import { PosteComponent } from '../../components/poste/poste.component';
import { DetailedPosteComponent } from '../../components/detailed-poste/detailed-poste.component';

@Component({
  selector: 'app-for-you-page',
  standalone: true,
  imports: [CommonModule, PosteComponent, DetailedPosteComponent],
  templateUrl: './for-you-page.component.html',
  styleUrl: './for-you-page.component.css'
})
export class ForYouPageComponent implements OnInit {
  messages: any[] = []; // Tous les messages
  currentPage: number = 1; // Page actuelle
  pageSize: number = 10; // Nombre de messages par page
  Math = Math; // Expose l'objet Math pour le template
  selectedMessage: any = null;

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.messageService.getMessages().subscribe({
      next: (data) => {
        this.messages = data;
      },
      error: (err) => {
        console.error('Erreur lors de la récupération des messages :', err);
      }
    });
  }

  // Méthode pour changer de page
  changePage(page: number): void {
    this.currentPage = page;
    const contentElement = document.querySelector('.content');
    if (contentElement) {
      contentElement.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }

  openDetailedPoste(message: any): void {
    this.selectedMessage = message; // Stocke le message sélectionné
  }

  closeDetailedPoste(): void {
    this.selectedMessage = null; // Réinitialise le message sélectionné
  }

  // Méthode pour récupérer les messages de la page actuelle
  get paginatedMessages(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.messages.slice(startIndex, endIndex);
  }
}