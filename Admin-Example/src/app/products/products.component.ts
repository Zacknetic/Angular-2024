import { NgFor } from '@angular/common';
import { Component } from '@angular/core';
import { NgxPaginationModule } from 'ngx-pagination'; // At the top of your module
import { getRandomNumbers } from '../../assets/utils/randomNumbers';
import { ClassifyPipe } from '../classify.pipe';


@Component({
  selector: 'app-products',
  standalone: true,
  imports: [NgFor, NgxPaginationModule, ClassifyPipe],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css'
})
export class ProductsComponent {
  // products = ["GPU", "CPU", "Memory", "Motherboard", "Storage", "Power Supply", "Case", "Cooling"]
  employees = [
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

  randomNumbers = <[]>getRandomNumbers().sort((a, b) => a - b);
  itemsPerPage: number = 10;
  currentPage: number = 1;

  pageChanged(event: any) {
    this.currentPage = event;
  }

}
