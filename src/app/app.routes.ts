import { Routes } from '@angular/router';
import { LiveCustomersComponent } from './live-customers/live-customers';
import { LiveCustomer } from './live-customer/live-customer';

export const routes: Routes = [
    {
        path: '',
        component: LiveCustomersComponent
    },
    {
        path: 'customer/:id',
        component: LiveCustomer
    }
];
