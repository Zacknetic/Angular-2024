import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NgFor } from '@angular/common';
interface JSP {
	userId: string;
	id: string;
	title: string;
	completed: boolean;
}

@Component({
	selector: 'app-product',
	standalone: true,
	imports: [NgFor],
	templateUrl: './product.component.html',
	styleUrl: './product.component.css',
})
export class ProductComponent {
	public todos: JSP[] = [];

	constructor(private http: HttpClient) {
		this.http
			.get<JSP[]>('https://jsonplaceholder.typicode.com/todos')
			.subscribe((data) => {
				this.todos = data;
			});
	}
	ngOnInit() {}
}
