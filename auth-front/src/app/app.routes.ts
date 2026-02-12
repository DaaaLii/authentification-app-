import { Routes } from '@angular/router';
import { LoginComponent } from './pages/login/login';
import { RegisterComponent } from './pages/register/register';
import { ProfileComponent } from './pages/profile/profile';
import { TablePaginationExample } from './product-list/product-list';
import { NoauthGuard } from './guards/noauth.guard';
import { authGuard } from './guards/auth.guard';

export const routes: Routes = [
  { path: 'login', canActivate: [NoauthGuard], component: LoginComponent },
  { path: 'register', canActivate: [authGuard], component: RegisterComponent }, 
  { path: 'profile',canActivate: [authGuard], component: ProfileComponent },
  { path: 'productlist',canActivate: [authGuard], component: TablePaginationExample },   
  { path: '', redirectTo: 'login', pathMatch: 'full' },
  


  // Use ** for the wildcard route (not '*') so Angular router matches unknown paths
  { path: '**', redirectTo: 'login', pathMatch: 'full' },
];
