import { Component, OnInit } from '@angular/core';
import { FormsModule, NgForm } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';

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
  data$: Observable<any>;
  currId = "";
  constructor(private http: HttpClient) {
    this.data$ = this.http.get('http://localhost:3000/customers').pipe(
      tap(console.log),
      shareReplay()
    );
  }

  onSubmit(form: NgForm) {
    this.http.post('http://localhost:3000/customers', form.value).subscribe((response: any) => {
      console.log(response);
      //output the id of the new customer
      console.log(response['id']);
      this.currId = response['id'];
      // console.log(response);
    });

  }

  deleteCustomer() {
    this.http.delete(`http://localhost:3000/customers/${this.currId}`).subscribe((response) => {
      console.log(response);
    });
  }

  ngOnInit(): void {
    this.data$.subscribe((response) => {
      console.log(response);
    });
  }
}
