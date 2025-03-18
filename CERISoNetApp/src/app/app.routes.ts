import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { AppComponent } from './app.component';
import { AppShellComponent } from './app-shell/app-shell.component';

//logique de route 
export const routes: Routes = [
  //app en premier avec login dedans ou appshells
  { path: '', component: AppComponent, children: [
      { path: 'connexion', component: LoginComponent },
      //tout le reste
      { path: '', component: AppShellComponent, children: [
        { path: 'home', loadComponent: () => import('./home/home.component').then(m => m.HomeComponent) },
        { path: '', redirectTo: 'home', pathMatch: 'full' }
      ]}
  ]}
];

