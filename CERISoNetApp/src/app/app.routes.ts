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
        { path: 'home', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
        { path: 'fyp', loadComponent: () => import('./pages/for-you-page/for-you-page.component').then(m => m.ForYouPageComponent) },
        { path: '', redirectTo: 'home', pathMatch: 'full' }
      ]}
  ]}
];

