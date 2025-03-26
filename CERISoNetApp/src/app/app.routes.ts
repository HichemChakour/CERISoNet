import { Routes } from '@angular/router';
import { LoginComponent } from './main-pages/login/login.component';
import { AppComponent } from './app.component';
import { AppShellComponent } from './main-pages/app-shell/app-shell.component';

//logique de route 
export const routes: Routes = [
  //app en premier avec login dedans ou appshells
  { path: '', component: AppComponent, children: [
      { path: 'connexion', component: LoginComponent },
      //tout le reste
      { path: '', component: AppShellComponent, children: [
        { path: 'profil', loadComponent: () => import('./pages/home/home.component').then(m => m.HomeComponent) },
        { path: 'fyp', loadComponent: () => import('./pages/for-you-page/for-you-page.component').then(m => m.ForYouPageComponent) },
        { path: 'poste', loadComponent: () => import('./pages/poster/poster.component').then(m => m.PosterComponent) },
        { path: '', redirectTo: 'profil', pathMatch: 'full' }
      ]}
  ]}
];

