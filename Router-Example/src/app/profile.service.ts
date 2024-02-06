import { Injectable } from '@angular/core';

@Injectable({
	providedIn: 'root',
})
export class ProfileService {
  private isLoggedIn: boolean | undefined;
	constructor() {}

	/**
	 * loggedInStatus
	 * @returns boolean
	 */
	public loggedInStatus(): boolean {
    this.isLoggedIn = true; //TODO - implement a real login
		return this.isLoggedIn;
	}
}
