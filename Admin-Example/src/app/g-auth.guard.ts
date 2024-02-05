import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { Injectable } from '@angular/core';
import { SAuthService } from './s-auth.service';

@Injectable({
  providedIn: 'root'
})
export class GAuthGuard {
  constructor(private authService: SAuthService) {
  }

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return this.authService.getToken();
  }

}
