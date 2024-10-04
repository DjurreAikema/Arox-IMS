import {computed, effect, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {AddCustomer, Customer, EditCustomer, RemoveCustomer} from "../../shared/interfaces";
import {StorageService} from "../../shared/data-access/storage.service";
import {catchError, exhaustMap, map, merge, Observable, of, retry, Subject} from "rxjs";
import {connect} from "ngxtension/connect";
import {ApplicationService} from "../../application/data-access/application.service";
import {environment} from "../../../environments/environment";
import {HttpClient} from "@angular/common/http";

// State interface
export interface CustomerState {
  customers: Customer[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class CustomerService {

  private http: HttpClient = inject(HttpClient);
  private storageService: StorageService = inject(StorageService);
  private applicationService: ApplicationService = inject(ApplicationService);

  // --- State (state is initialized with default values here)
  private state: WritableSignal<CustomerState> = signal<CustomerState>({
    customers: [],
    loaded: false,
    error: null
  });

  // --- Selectors (the rest of the application can access the data in this service via these selectors)
  public customers: Signal<Customer[]> = computed(() => this.state().customers);
  public loaded: Signal<boolean> = computed(() => this.state().loaded);

  // --- Sources (the state gets updated when these sources get a new value, the rest of the application can use these sources to alter the data in the state)
  public customers$: Observable<Customer[]> = this.loadCustomers().pipe(
    retry(3),
    catchError((err) => {
      this.error$.next(err.message);
      return of([]);
    }),
  );

  public add$: Subject<AddCustomer> = new Subject<AddCustomer>();
  public edit$: Subject<EditCustomer> = new Subject<EditCustomer>();
  public remove$: Subject<RemoveCustomer> = this.applicationService.customerRemoved$;

  private error$: Subject<string> = new Subject<string>();

  // --- Reducers (reducers subscribe to the sources and update the actual state)
  constructor() {
    const nextState$ = merge(
      // customers$ reducer, update state when customers loaded
      this.customers$.pipe(map((customers) => ({
        customers: customers,
        loaded: true
      }))),

      // add$ reducer
      this.add$.pipe(
        exhaustMap((customer) =>
          this.addNewCustomer(customer).pipe(
            // Update the state
            map((newCustomer) => ({
              customers: [...this.customers(), newCustomer]
            })),
            catchError((error) => of({error: error.message}))
          )
        )
      ),

      // edit$ reducer
      this.edit$.pipe(
        exhaustMap((update) =>
          this.editCustomer(update).pipe(
            // Update the state
            map((updatedCustomer) => ({
              customers: this.customers().map((customer) =>
                customer.id === updatedCustomer.id ? updatedCustomer : customer
              )
            })),
            catchError((error) => of({error: error.message}))
          )
        )
      ),

      // remove$ reducer
      this.remove$.pipe(
        exhaustMap((id) =>
          this.removeCustomer(id).pipe(
            // Update the state
            map(() => ({
              customers: this.customers().filter((customer) => customer.id !== id)
            })),
            catchError((error) => of({error: error.message}))
          )
        )
      ),

      // Update error state
      this.error$.pipe(map((error) => ({error}))),
    );

    connect(this.state)
      .with(nextState$);

    // Effect to save customers to local storage when in DemoMode
    if (environment.demoMode) {
      // Save customers to local storage whenever customers change
      effect(() => {
        this.storageService.saveCustomers(this.customers());
      });
    }
  }

  // --- Functions (these functions are used exclusively inside this state)
  private loadCustomers(): Observable<Customer[]> {
    if (environment.demoMode) {
      return this.storageService.loadCustomers();
    }

    return this.http.get<Customer[]>(`${environment.apiUrl}/customers`);
  }

  private addNewCustomer(customer: AddCustomer): Observable<Customer> {
    if (environment.demoMode) {
      return this.storageService.addCustomer(this.addIdToCustomer(customer));
    }

    return this.http.post<Customer>(`${environment.apiUrl}/customers`, customer);
  }

  private editCustomer(update: EditCustomer): Observable<Customer> {
    if (environment.demoMode) {
      return this.storageService.editCustomer(update);
    }

    return this.http.put<Customer>(`${environment.apiUrl}/customers/${update.id}`, update.data);
  }

  private removeCustomer(id: number): Observable<void> {
    if (environment.demoMode) {
      return this.storageService.removeCustomer(id);
    }

    return this.http.delete<void>(`${environment.apiUrl}/customers/${id}`);
  }

  // Local storage only
  private addIdToCustomer(customer: AddCustomer): Customer {
    const id = this.generateId();
    return {
      id,
      ...customer
    };
  }

  private generateId(): number {
    return this.customers().length > 0 ? Math.max(...this.customers().map(c => c.id)) + 1 : 1;
  }
}
