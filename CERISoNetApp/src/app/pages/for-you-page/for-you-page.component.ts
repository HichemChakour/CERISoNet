import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageService } from '../../services/message.service';
import { PosteComponent } from '../../components/poste/poste.component';

@Component({
  selector: 'app-for-you-page',
  standalone: true,
  imports: [CommonModule, PosteComponent],
  templateUrl: './for-you-page.component.html',
  styleUrl: './for-you-page.component.css'
})
export class ForYouPageComponent implements OnInit {
  messages: any[] = []; // Tous les messages
  currentPage: number = 1; // Page actuelle
  pageSize: number = 5; // Nombre de messages par page
  Math = Math; // Expose l'objet Math pour le template

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
  }

  // Méthode pour récupérer les messages de la page actuelle
  get paginatedMessages(): any[] {
    const startIndex = (this.currentPage - 1) * this.pageSize;
    const endIndex = startIndex + this.pageSize;
    return this.messages.slice(startIndex, endIndex);
  }
}