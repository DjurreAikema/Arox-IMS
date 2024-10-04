import {computed, effect, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {AddCustomer, Customer, EditCustomer, RemoveCustomer} from "../../shared/interfaces";
import {StorageService} from "../../shared/data-access/storage.service";
import {catchError, EMPTY, map, merge, Observable, Subject} from "rxjs";
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
  public add$: Subject<AddCustomer> = new Subject<AddCustomer>();
  public edit$: Subject<EditCustomer> = new Subject<EditCustomer>();
  public remove$: Subject<RemoveCustomer> = this.applicationService.customerRemoved$;

  private error$: Subject<string> = new Subject<string>();
  private customersLoaded$: Observable<Customer[]> = this.storageService.loadCustomers().pipe(
    catchError((err) => {
      this.error$.next(err);
      return EMPTY;
    })
  );

  // --- Reducers (reducers subscribe to the sources and update the actual state)
  constructor() {
    const nextState$ = merge(
      // error$ reducer
      this.error$.pipe(map((error) => ({error}))),

      // customersLoaded$ reducer
      this.customersLoaded$.pipe(
        map((customers) => ({customers, loaded: true}))
      )
    );

    connect(this.state)
      .with(nextState$)

      // add$ reducer
      .with(this.add$, (state, customer) => ({
        customers: [...state.customers, this.addIdToCustomer(customer)],
      }))

      // remove$ reducer
      .with(this.remove$, (state, id) => ({
        customers: state.customers.filter((customer) => customer.id !== id),
      }))

      // edit$ reducer
      .with(this.edit$, (state, update) => ({
        customers: state.customers.map((customer) =>
          customer.id === update.id
            ? {...customer, name: update.data.name}
            : customer
        ),
      }));

    // --- Effects (effects are used to chain certain actions to state updates)
    effect((): void => {
      // this effect saves the customers to local storage every time the state changes
      if (this.loaded()) {
        this.saveCustomers(this.customers());
      }
    });
  }

  // --- Functions (these functions are used exclusively inside this state)
  private addNewCustomer(customer: AddCustomer) {
    return this.http.post<Customer>(`${environment.apiUrl}/customers`, customer).pipe(
      catchError((err) => {
        this.error$.next(err);
        return EMPTY;
      })
    );
  }

  private saveCustomers(customers: Customer[]): void {
    // If DemoMode is enabled, use local storage
    if (environment.demoMode) {
      this.storageService.saveCustomers(customers);
      return;
    }

    // Else use the API
    this.http.post(`${environment.apiUrl}/customers/addOrUpdate`, customers)
      .pipe(
        catchError((err) => {
          // TODO: Handle error
          return EMPTY;
        })
      ).subscribe();
  }

  private addIdToCustomer(customer: AddCustomer) {
    return {
      ...customer,
      id: this.generateId()
    };
  }

  private generateId() {
    return this.customers().reduce((maxId, customer) => Math.max(maxId, customer.id), 0) + 1;
  }
}
