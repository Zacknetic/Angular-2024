import { Component, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-product',
  standalone: true,
  imports: [],
  templateUrl: './product.component.html',
  styleUrl: './product.component.css'
})
export class ProductComponent {

  constructor() { }
  // @Input()
  // p_title!: string;

  @Output() c_newProductEvent = new EventEmitter<string>();

  addProduct(value: string) {
    this.c_newProductEvent.emit(value);
  }
}
