import { Component, OnInit } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from './services/auth.service';
import { BandeauComponent } from "./bandeau/bandeau.component";

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
  constructor(private authService: AuthService, private router: Router) {}

  //verification si connecter pour redirection
  ngOnInit() {
    const sessionCookie = document.cookie.split('; ')
      .find(row => row.startsWith('session='))?.split('=')[1] ?? '';

    this.authService.getSession(sessionCookie).subscribe({
      next: session => {
        console.log('Utilisateur connecté :', session.username);
        this.authService.setUser(session);
        this.router.navigate(['/home']); 
      },
      error: () => {
        console.warn('Session invalide, redirection vers /connexion');
        this.router.navigate(['/connexion']); 
      }
    });
  }

  //afficher le bandeau
  showNotification(message: string, isSuccess: boolean): void {
    this.message = message;
    this.isSuccess = isSuccess;
    this.messageId++;
  }
}
