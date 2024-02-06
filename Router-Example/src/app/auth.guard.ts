import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthorizationService } from './authorization.service';
@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(private authorizationService: AuthorizationService) {}
  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean | UrlTree {
    return this.authorizationService.isAuthorized();
  }
}
