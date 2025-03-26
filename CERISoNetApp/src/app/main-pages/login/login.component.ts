import { Component, OnInit, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule], 
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  schemas: [CUSTOM_ELEMENTS_SCHEMA] 
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
    const sessionCookie = document.cookie.split('; ')
      .find(row => row.startsWith('session='))?.split('=')[1] ?? '';

    this.authService.getSession(sessionCookie).subscribe({
      next: session => {
        console.log('Utilisateur connecté :', session.username);
        this.router.navigate(['/']); 
      },
      error: () => {
        console.warn('Session invalide, redirection vers /connexion');
      }
    });
  }
  //envoie de la requette pour connexion
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        response => {
            document.cookie = `userId=${response.userId}; SameSite=Strict`;
            document.cookie = `lastLoginDate=${response.lastConnexion ?? null}; SameSite=Strict`;
            document.cookie = `session=${response.session}; SameSite=Strict`; 
            document.cookie = `name=${response.pseudo}; SameSite=Strict`;
            document.cookie = `avatar=${response.avatar}; SameSite=Strict`;
            this.router.navigate(['']); 
        }
      );
    }
  }

}