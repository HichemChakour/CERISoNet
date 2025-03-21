import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { BandeauComponent } from "../../components/bandeau/bandeau.component";

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  @Output() loginResult = new EventEmitter<{ message: string, isSuccess: boolean }>();
  message: any;
  isSuccess: any;
  messageId: any;

  constructor(private fb: FormBuilder, private http: HttpClient) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      this.http.post('https://pedago.univ-avignon.fr:3205/login', this.loginForm.value).subscribe(
        response => {
          this.loginResult.emit({ message: 'Login successful', isSuccess: true });
          console.log('Login successful', response);
        },
        error => {
          this.loginResult.emit({ message: 'Login failed', isSuccess: false });
          console.error('Login failed', error);
        }
      );
    }
  }
}