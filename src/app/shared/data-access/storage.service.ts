import {inject, Injectable, InjectionToken, PLATFORM_ID} from '@angular/core';
import {Observable, of} from "rxjs";
import {Customer} from "../interfaces";

// https://angularstart.com/standard/modules/angular-quicklists/11/
export const LOCAL_STORAGE = new InjectionToken<Storage>(
  'window local storage object',
  {
    providedIn: 'root',
    factory: () => {
      return inject(PLATFORM_ID) === 'browser'
        ? window.localStorage
        : ({} as Storage)
    }
  }
);

@Injectable({
  providedIn: 'root'
})
// Responsibility: Handle interactions with local storage
export class StorageService {

  public storage = inject(LOCAL_STORAGE);

  // --- Customer
  public loadCustomers(): Observable<Customer[]> {
    const customers = this.storage.getItem('customers');
    return of(customers
      ? (JSON.parse(customers) as Customer[])
      : []
    );
  }

  public saveCustomers(customers: Customer[]): void {
    this.storage.setItem('customers', JSON.stringify(customers));
  }
}
