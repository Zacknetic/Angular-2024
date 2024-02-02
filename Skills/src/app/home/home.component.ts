import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  customerName: string = "zack";
  customerEmail: string = "";
  customerPhone: string = "";

  constructor() { }

  onSubmit(form: NgForm) {
    console.log(form.value);

    console.log(this.customerName);
  }

  ngOnInit(): void {
      
  }
}
