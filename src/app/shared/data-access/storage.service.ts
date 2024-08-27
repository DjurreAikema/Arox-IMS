import {inject, Injectable, InjectionToken, PLATFORM_ID} from '@angular/core';
import {Observable, of} from "rxjs";
import {Application, Customer, Tool, ToolInput, ToolOutput} from "../interfaces";

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

  // --- Customers --- //
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
}
