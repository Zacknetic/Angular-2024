import { Injectable } from '@angular/core';
import {
	ActivatedRouteSnapshot,
	RouterStateSnapshot,
	UrlTree,
} from '@angular/router';
import { AuthorizationService } from './authorization.service';
import { ProfileService } from './profile.service';

@Injectable({
	providedIn: 'root',
})
export class AuthGuard {
	constructor(
		private authorizationService: AuthorizationService,
		private profile: ProfileService
	) {}
	canActivate(
		route: ActivatedRouteSnapshot,
		state: RouterStateSnapshot
	): boolean | UrlTree {
		return this.profile.loggedInStatus();
	}
}
