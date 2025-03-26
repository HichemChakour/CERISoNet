import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';
import { PosteComponent } from '../../components/poste/poste.component';
import { DetailedPosteComponent } from '../../components/detailed-poste/detailed-poste.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-for-you-page',
  standalone: true,
  imports: [CommonModule, PosteComponent, DetailedPosteComponent, FormsModule],
  templateUrl: './for-you-page.component.html',
  styleUrl: './for-you-page.component.css'
})
export class ForYouPageComponent implements OnInit {
  messages: any[] = []; // Tous les messages
  currentPage: number = 1; // Page actuelle
  pageSize: number = 10; // Nombre de messages par page
  Math = Math; // Expose l'objet Math pour le template
  selectedMessage: any = null;

  sortCriteria = {
    field: 'date', 
    order: 'asc' 
  };

  availableHashtags: string[] = [];

  // Propriété pour les critères de filtrage
  filterCriteria = {
    hashtags: '', // Hashtag sélectionné
    user: '' // Nom d'utilisateur recherché
  };

  constructor(private messageService: MessageService) {}

  ngOnInit(): void {
    this.messageService.getMessages().subscribe({
      next: (data) => {
        this.messages = data;

        const hashtagsSet = new Set<string>();
        this.messages.forEach(message => {
          if (message.hashtags) {
            message.hashtags.forEach((hashtag: string) => hashtagsSet.add(hashtag));
          }
        });
        this.availableHashtags = Array.from(hashtagsSet);
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

  sortMessages(): void {
    this.messages.sort((a, b) => {
      const fieldA = a[this.sortCriteria.field];
      const fieldB = b[this.sortCriteria.field];

      if (this.sortCriteria.order === 'asc') {
        return fieldA > fieldB ? 1 : fieldA < fieldB ? -1 : 0;
      } else {
        return fieldA < fieldB ? 1 : fieldA > fieldB ? -1 : 0;
      }
    });
  }

  get filteredMessages(): any[] {
    const filtered = this.messages.filter(message => {
      const matchesHashtags = !this.filterCriteria.hashtags || message.hashtags?.includes(this.filterCriteria.hashtags);
      const matchesUser = !this.filterCriteria.user || message.createdByUser?.pseudo?.toLowerCase().includes(this.filterCriteria.user.toLowerCase());
      return  matchesHashtags && matchesUser;
    });

    // Trier les messages filtrés
    this.sortMessages();
    return filtered;
  }

    get paginatedMessages(): any[] {
    const filtered = this.filteredMessages; // Utiliser les messages filtrés
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return filtered.slice(startIndex, endIndex);
  }
}