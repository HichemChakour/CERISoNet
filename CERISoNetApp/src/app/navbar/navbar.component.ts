import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { AppComponent } from '../app.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  name: string;

  constructor(private authService: AuthService, private router: Router, private app: AppComponent) {
      this.name = document.cookie.split('; ').find(row => row.startsWith('name='))?.split('=')[1] || '';
  }
  //deconnxion 
  logout() {
    this.authService.logout().subscribe(
      response => {
        this.app.showNotification(response.message, true);
        this.router.navigate(['/connexion']); 
      },
      error => {
        const errorMessage = error.error?.message || 'Identifiants invalides';
        this.app.showNotification(errorMessage, false);
      }
    );
  }
}
