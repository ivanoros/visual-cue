import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of, throwError } from 'rxjs';
import { catchError, delay, retry } from 'rxjs/operators';
import { Customer } from './customer';

@Injectable({
  providedIn: 'root'
})
export class CustomerService {
    private mockCustomers: Customer[] = [
    { id: '1', name: 'Goldman Sachs', price: 101.25, quantity: 120, status: 'Active' },
    { id: '2', name: 'Morgan Stanley', price: 99.80, quantity: 85, status: 'Active' },
    { id: '3', name: 'JPMorgan', price: 105.10, quantity: 200, status: 'Inactive' }
  ];

  private readonly http = inject(HttpClient);

  private readonly baseUrl = '/api/customers';

  private useMock = true;

  getCustomers(): Observable<Customer[]> {
    if (this.useMock) {
      return of(this.generateMock()).pipe(delay(500));
    }

    return this.http.get<Customer[]>('/api/customers');
  }

  private generateMock(): Customer[] {
    return this.mockCustomers.map(c => ({
      ...c,
      //price: +(c.price + (Math.random() - 0.5)).toFixed(2),
      price: +(c.price + (Math.random() - 0.5) * 0.8).toFixed(2),
      quantity: c.quantity + Math.floor((Math.random() - 0.5) * 20)
    }));
  }

  getCustomer(id: string): Observable<Customer> {
    // return this.http.get<Customer>(`${this.baseUrl}/${id}`).pipe(
    //   retry(2),
    //   catchError(this.handleError)
    // );
        // simulate changing values every refresh
    const random = Math.random();

    const updated = {
      ...this.mockCustomers[0],
      price: +(this.mockCustomers[0].price + (Math.random() - 0.5) * 0.8).toFixed(2),
      quantity: this.mockCustomers[0].quantity + Math.floor((random - 0.5) * 10)
    };

    return of(updated).pipe(delay(300));
  }

  // getCustomers(): Observable<Customer[]> {
  //   // return this.http.get<Customer[]>(this.baseUrl).pipe(
  //   //   retry(2), // retry transient failures
  //   //   catchError(this.handleError)
  //   // );
  //   return of(this.mockCustomers).pipe(
  //     delay(500) // simulate network latency
  //   );    
  // }

  // getCustomers(): Observable<Customer[]> {
  //   const updated = this.mockCustomers.map(c => ({
  //     ...c,
  //     price: +(c.price + (Math.random() - 0.5)).toFixed(2),
  //     quantity: c.quantity + Math.floor((Math.random() - 0.5) * 20)
  //   }));

  //   return of(updated).pipe(delay(500));
  // }

  private handleError(error: unknown) {
    console.error('CustomerService error:', error);
    return throwError(() => error);
  }
}