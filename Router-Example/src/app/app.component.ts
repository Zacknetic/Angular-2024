import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileService } from './profile.service';
import { ProductComponent } from './product/product.component';
import { KeyboardComponent } from './keyboard/keyboard.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, KeyboardComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [ProfileService]
})
export class AppComponent {
  title = 'Router-Example';
}
