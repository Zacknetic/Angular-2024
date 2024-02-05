import { NgFor } from '@angular/common';
import { Component } from '@angular/core';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  products = ["GPU", "CPU", "Memory", "Motherboard", "Storage", "Power Supply", "Case", "Cooling"]

}
