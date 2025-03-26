import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UserService } from '../../services/user.service';
import { PosteComponent } from '../../components/poste/poste.component';
import { DetailedPosteComponent } from '../../components/detailed-poste/detailed-poste.component';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, PosteComponent, DetailedPosteComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  currentPage: number = 1; // Page actuelle
  pageSize: number = 10; // Nombre de messages par page
  Math = Math; // Expose l'objet Math pour le template
  selectedMessage: any = null;
  cookies: any = {};
  totalMessages: number = 0;
  totalLikes: number = 0;
  totalComments: number = 0;
  userMessages: any[] = [];

  constructor(private userService: UserService) {}

  ngOnInit(): void {
    this.cookies = this.parseCookies(document.cookie);
    const userId = this.cookies.userId;

    // Récupérer les messages de l'utilisateur
    this.userService.getUserMessages(userId).subscribe({
      next: (data) => {
        this.userMessages = data;
        // claculer le nombre total de messages
        this.totalMessages = this.userMessages.length;
        this.totalLikes = this.userMessages.reduce((acc, message) => acc + message.likes, 0);
        this.totalComments = this.userMessages.reduce((acc, message) => acc + message.comments.length, 0);


      },
      error: (err) => {
        console.error('Erreur lors de la récupération des messages :', err);
      }
    });
  }

  parseCookies(cookieString: string): any {
    return cookieString.split(';').reduce((acc: any, cookie) => {
      const [key, value] = cookie.split('=').map(c => c.trim());
      acc[key] = decodeURIComponent(value);
      return acc;
    }, {});
  }

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
    return this.userMessages.slice(startIndex, endIndex);
  }
}