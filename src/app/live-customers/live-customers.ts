import { Component, DestroyRef, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { interval, startWith, switchMap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Customer } from '../customer';
import { CustomerService } from '../customer-service';



@Component({
  selector: 'app-live-customers',
  templateUrl: './live-customers.html',
  styleUrl: './live-customers.scss'
})
export class LiveCustomersComponent {
  private destroyRef = inject(DestroyRef);
  private router = inject(Router);

  customers = signal<Customer[]>([]);
  changedCells = signal<Set<string>>(new Set());

  constructor(private customerService: CustomerService) {
    interval(15_000)
      .pipe(
        startWith(0),
        switchMap(() => this.customerService.getCustomers()),
        takeUntilDestroyed(this.destroyRef)
      )
      .subscribe(newCustomers => {
        this.applyRefresh(newCustomers);
      });
  }

  private applyRefresh(newCustomers: Customer[]) {
    const previous = this.customers();
    const previousById = new Map(previous.map(x => [x.id, x]));

    const changed = new Set<string>();

    for (const current of newCustomers) {
      const old = previousById.get(current.id);

      if (!old) continue;

      if (old.price !== current.price) {
        changed.add(this.cellKey(current.id, 'price'));
      }

      if (old.quantity !== current.quantity) {
        changed.add(this.cellKey(current.id, 'quantity'));
      }

      if (old.status !== current.status) {
        changed.add(this.cellKey(current.id, 'status'));
      }
    }

    this.customers.set(newCustomers);
    this.changedCells.set(changed);

    if (changed.size > 0) {
      setTimeout(() => {
        this.changedCells.set(new Set());
      }, 3000);
    }
  }

  isChanged(id: string, field: keyof Customer): boolean {
    return this.changedCells().has(this.cellKey(id, field));
  }

  openCustomer(id: string) {
    window.open(`/customer/${id}`, '_blank');
  }

  private cellKey(id: string, field: string): string {
    return `${id}:${field}`;
  }
}