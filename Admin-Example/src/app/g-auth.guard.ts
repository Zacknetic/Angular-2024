import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

export class gAuthGuard {
  constructor() { }

  static canActivate (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    return false;
  }
  
}
