import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { BandeauComponent } from "./components/bandeau/bandeau.component";

@Component({
  selector: 'app-root',
  standalone: true,
  templateUrl: './app.component.html',
  imports: [RouterModule, BandeauComponent]
})
export class AppComponent implements OnInit {
  message: string = '';
  isSuccess: boolean = false;
  messageId: number = 0;
  private socket: WebSocket | null = null;

  constructor(private authService: AuthService, private router: Router) {}

  //verification si connecter pour redirection
  ngOnInit() {
    const sessionCookie = document.cookie.split('; ')
      .find(row => row.startsWith('session='))?.split('=')[1] ?? '';

    this.authService.getSession(sessionCookie).subscribe({
      next: session => {
        console.log('Utilisateur connecté :', session.username);
      },
      error: () => {
        console.warn('Session invalide, redirection vers /connexion');
        this.router.navigate(['/connexion']); 
      }
    });

    this.initWebSocket();
  }

  private initWebSocket(): void {
    this.socket = new WebSocket('https://pedago.univ-avignon.fr:3205'); 

    // Écouter les messages du serveur
    this.socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data.type === 'success') {
        this.showNotification(data.message, true); // Afficher une notification de succès
      } else if (data.type === 'error') {
        this.showNotification(data.message, false); // Afficher une notification d'erreur
      }
    };

    // Gérer la fermeture de la connexion
    this.socket.onclose = () => {
      console.warn('Connexion WebSocket fermée');
    };

    // Gérer les erreurs de connexion
    this.socket.onerror = (error) => {
      console.error('Erreur WebSocket:', error);
    };
  }

  //afficher le bandeau
  showNotification(message: string, isSuccess: boolean): void {
    this.message = message;
    this.isSuccess = isSuccess;
    this.messageId++;
  }
}
