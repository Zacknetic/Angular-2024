import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductComponent } from './product/product.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
	{ path: '', component: HomeComponent, pathMatch: 'full' },
	{ path: 'home', component: HomeComponent },
    { path: 'product', canActivate:[AuthGuard], component: ProductComponent },
	{ path: 'product/:id', canActivate:[AuthGuard], component: ProductComponent },
];
