import { Component, DestroyRef, inject, signal, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { interval, startWith, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Customer } from '../customer';
import { CustomerService } from '../customer-service';

@Component({
  selector: 'app-live-customer',
  imports: [],
  templateUrl: './live-customer.html',
  styleUrl: './live-customer.scss',
})
export class LiveCustomer implements OnInit {
  private destroyRef = inject(DestroyRef);
  private route = inject(ActivatedRoute);
  private customerService = inject(CustomerService);

  customer = signal<Customer | null>(null);
  changedFields = signal<Set<keyof Customer>>(new Set());

  ngOnInit() {
    const customerId = this.route.snapshot.paramMap.get('id') || '1';

    interval(15_000)
      .pipe(
        startWith(0),
        switchMap(() => this.customerService.getCustomer(customerId)),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(newCustomer => {
        this.applyRefresh(newCustomer);
      });
  }

  private applyRefresh(newCustomer: Customer) {
    const previous = this.customer();

    const changed = new Set<keyof Customer>();

    if (previous) {
      if (previous.price !== newCustomer.price) {
        changed.add('price');
      }

      if (previous.quantity !== newCustomer.quantity) {
        changed.add('quantity');
      }

      if (previous.status !== newCustomer.status) {
        changed.add('status');
      }

      if (previous.name !== newCustomer.name) {
        changed.add('name');
      }
    }

    this.customer.set(newCustomer);
    this.changedFields.set(changed);

    if (changed.size > 0) {
      setTimeout(() => {
        this.changedFields.set(new Set());
      }, 3000);
    }
  }

  isChanged(field: keyof Customer): boolean {
    return this.changedFields().has(field);
  }
}