import { Routes } from '@angular/router';
import { AdminComponent } from './admin/admin.component';
import { HomeComponent } from './home/home.component';
import { LoginComponent } from './login/login.component';
import { GAuthGuard } from './g-auth.guard';
import { ProductsComponent } from './products/products.component';

export const routes: Routes = [
    { path: '', redirectTo: 'home', pathMatch: 'full' },
    { path: 'home', component: HomeComponent },
    { path: 'products', component: ProductsComponent },
    { path: 'admin', component: AdminComponent, canActivate: [GAuthGuard] },
    { path: 'login', component: LoginComponent }
   
];
