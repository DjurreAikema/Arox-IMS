import {inject, Injectable, InjectionToken, PLATFORM_ID} from '@angular/core';
import {map, Observable, of} from "rxjs";
import {Application, Customer, EditCustomer, InputOption, Tool, ToolInput, ToolOutput} from "../interfaces";

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

  private customerKey = 'customers';

  // --- Customers --- //
  public loadCustomers(): Observable<Customer[]> {
    const customers = this.storage.getItem(this.customerKey);
    return of(customers
      ? (JSON.parse(customers) as Customer[])
      : []
    );
  }

  public saveCustomers(customers: Customer[]): void {
    this.storage.setItem(this.customerKey, JSON.stringify(customers));
  }

  public addCustomer(customer: Customer): Observable<Customer> {
    return this.loadCustomers().pipe(
      map((customers) => {
        customers.push(customer);
        this.saveCustomers(customers);
        return customer;
      })
    );
  }

  public editCustomer(update: EditCustomer): Observable<Customer> {
    return this.loadCustomers().pipe(
      map((customers) => {
        const index = customers.findIndex(c => c.id === update.id);
        if (index !== -1) {
          customers[index] = {...customers[index], ...update.data};
          this.saveCustomers(customers);
          return customers[index];
        } else {
          throw new Error('Customer not found');
        }
      })
    );
  }

  public removeCustomer(id: number): Observable<void> {
    return this.loadCustomers().pipe(
      map((customers) => {
        const updatedCustomers = customers.filter(c => c.id !== id);
        this.saveCustomers(updatedCustomers);
      })
    );
  }

  // --- Applications --- //
  public loadApplications(): Observable<Application[]> {
    const applications = this.storage.getItem('applications');
    return of(applications
      ? (JSON.parse(applications) as Application[])
      : []
    );
  }

  public saveApplications(applications: Application[]): void {
    this.storage.setItem('applications', JSON.stringify(applications));
  }

  // --- Tools --- //
  public loadTools(): Observable<Tool[]> {
    const tools = this.storage.getItem('tools');
    return of(tools
      ? (JSON.parse(tools) as Tool[])
      : []
    );
  }

  public saveTools(tools: Tool[]): void {
    this.storage.setItem('tools', JSON.stringify(tools));
  }

  // --- Tool Inputs --- //
  public loadToolInputs(): Observable<ToolInput[]> {
    const toolInputs = this.storage.getItem('toolInputs');
    return of(toolInputs
      ? (JSON.parse(toolInputs) as ToolInput[])
      : []
    );
  }

  public saveToolInputs(toolInputs: ToolInput[]): void {
    this.storage.setItem('toolInputs', JSON.stringify(toolInputs));
  }

  // --- Tool Outputs --- //
  public loadToolOutputs(): Observable<ToolOutput[]> {
    const toolOutputs = this.storage.getItem('toolOutputs');
    return of(toolOutputs
      ? (JSON.parse(toolOutputs) as ToolOutput[])
      : []
    );
  }

  public saveToolOutputs(toolOutputs: ToolOutput[]): void {
    this.storage.setItem('toolOutputs', JSON.stringify(toolOutputs));
  }

  // --- Input Options --- //
  public loadInputOptions(): Observable<InputOption[]> {
    const inputOptions = this.storage.getItem('inputOptions');
    return of(inputOptions
      ? (JSON.parse(inputOptions) as InputOption[])
      : []
    );
  }

  public saveInputOptions(inputOptions: InputOption[]): void {
    this.storage.setItem('inputOptions', JSON.stringify(inputOptions));
  }
}
