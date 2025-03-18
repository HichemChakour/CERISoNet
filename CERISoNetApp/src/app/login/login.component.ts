import { Component, OnInit, Output, EventEmitter, CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AppComponent } from '../app.component';
import { AuthService } from '../services/auth.service';
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
  @Output() loginResult = new EventEmitter<{ message: string, isSuccess: boolean }>();

  constructor(
    private fb: FormBuilder, 
    private authService: AuthService,
    private app: AppComponent,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  //envoie de la requette pour connexion
  onSubmit(): void {
    if (this.loginForm.valid) {
      this.authService.login(this.loginForm.value).subscribe(
        response => {
          const lastLoginDate = response.lastConnexion;
          this.loginResult.emit({ message: response.message + " " + lastLoginDate, isSuccess: true });
          //affiche le bandeau
          this.app.showNotification(response.message+ " " + lastLoginDate, true);
          //cookies
            document.cookie = `lastLoginDate=${lastLoginDate ?? null}; SameSite=Strict`;
            document.cookie = `session=${response.session}; SameSite=Strict`; 
            document.cookie = `name=${response.pseudo}; SameSite=Strict`;
            this.router.navigate(['']); 
          
        },
        error => {
          const errorMessage = error.error?.message || 'Identifiants invalides';
          this.loginResult.emit({ message: errorMessage, isSuccess: false });
          //message erreur
          this.app.showNotification(errorMessage, false);
        }
      );
    }
  }

}