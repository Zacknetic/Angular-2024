import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
	selector: 'app-product',
	standalone: true,
	imports: [],
	templateUrl: './product.component.html',
	styleUrl: './product.component.css',
})
export class ProductComponent {
	constructor(private route: ActivatedRoute) {}

	ngOnInit() {
		this.route.params.subscribe((params) => {
			console.log(params);
		});
	}
}
