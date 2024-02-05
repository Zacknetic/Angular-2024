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
  // products = ["GPU", "CPU", "Memory", "Motherboard", "Storage", "Power Supply", "Case", "Cooling"]
  employees= [
    {
      name: "John",
      employeeId: "123",
      department: "IT"
    },
    {
      name: "Jane",
      employeeId: "124",
      department: "HR"
    },
    {
      name: "Jim",
      employeeId: "125",
      department: "Finance"
    }
  ]

}
