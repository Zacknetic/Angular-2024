import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileService } from './profile.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [ProfileService]
})
export class AppComponent {
  title = 'Router-Example';
}
