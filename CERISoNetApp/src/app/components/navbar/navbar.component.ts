import { Component, Output, EventEmitter } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { AppComponent } from '../../app.component';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})

export class NavbarComponent {
  name: string;
  avatar: string;


  constructor(private authService: AuthService, private router: Router, private app: AppComponent) {
      this.name = document.cookie.split('; ').find(row => row.startsWith('name='))?.split('=')[1] || '';
      this.avatar = document.cookie.split('; ').find(row => row.startsWith('avatar='))?.split('=')[1] || '';
  }
  //deconnxion 
  logout() {
    this.authService.logout().subscribe({
      next: () => {
        this.router.navigate(['/connexion']);
      }
    });
  }

  navigateToProfile() {
    this.router.navigate(['/profil']);
  }

  navigateToFyp() {
    this.router.navigate(['/fyp']);
  }

  navigateToPoste() {
    this.router.navigate(['/poste']);
  }

  navigateMyPostes() {
    this.router.navigate(['/my-postes']);
  }
}
