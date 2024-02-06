import { Component } from '@angular/core';
import { ProfileService } from '../profile.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent {
  public isLoggedIn: boolean = false;
  constructor(private profile: ProfileService) {}

  ngOnInit() {
    this.isLoggedIn = this.profile.loggedInStatus();
  }

}
