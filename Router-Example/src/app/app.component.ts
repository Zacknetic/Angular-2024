import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ProfileService } from './profile.service';
import { ProductComponent } from './product/product.component';
import { KeyboardComponent } from './keyboard/keyboard.component';
import { CaptureComponent } from './capture/capture.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, KeyboardComponent, CaptureComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  providers: [ProfileService]
})
export class AppComponent {
  title = 'Router-Example';
}
