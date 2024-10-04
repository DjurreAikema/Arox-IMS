import {inject, Injectable, InjectionToken, PLATFORM_ID} from '@angular/core';
import {map, Observable, of} from "rxjs";
import {
  Application,
  Customer,
  EditApplication,
  EditCustomer,
  EditInputOption,
  EditTool,
  EditToolInput,
  EditToolOutput,
  InputOption,
  Tool,
  ToolInput,
  ToolOutput
} from "../interfaces";

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
  private applicationKey = 'applications';
  private toolKey = 'tools';
  private toolInputKey = 'toolInputs';
  private toolOutputKey = 'toolOutputs';
  private inputOptionKey = 'inputOptions';

  // --- Generic Functions --- //
  private loadItems<T>(key: string): Observable<T[]> {
    const items = this.storage.getItem(key);
    return of(items ? (JSON.parse(items) as T[]) : []);
  }

  private saveItems<T>(key: string, items: T[]): void {
    this.storage.setItem(key, JSON.stringify(items));
  }

  private addItem<T extends { id: number }>(key: string, item: T): Observable<T> {
    return this.loadItems<T>(key).pipe(
      map((items) => {
        items.push(item);
        this.saveItems<T>(key, items);
        return item;
      })
    );
  }

  private editItem<T extends { id: number }>(key: string, id: number, data: Partial<T>): Observable<T> {
    return this.loadItems<T>(key).pipe(
      map((items) => {
        const index = items.findIndex((i) => i.id === id);
        if (index !== -1) {
          items[index] = {...items[index], ...data};
          this.saveItems<T>(key, items);
          return items[index];
        } else {
          throw new Error(`${key.slice(0, -1)} not found`);
        }
      })
    );
  }

  private removeItem<T extends { id: number }>(key: string, id: number): Observable<void> {
    return this.loadItems<T>(key).pipe(
      map((items) => {
        const updatedItems = items.filter((i) => i.id !== id);
        this.saveItems<T>(key, updatedItems);
      })
    );
  }


  // --- Customers --- //
  public loadCustomers(): Observable<Customer[]> {
    return this.loadItems<Customer>(this.customerKey);
  }

  public saveCustomers(customers: Customer[]): void {
    this.saveItems<Customer>(this.customerKey, customers);
  }

  public addCustomer(customer: Customer): Observable<Customer> {
    return this.addItem<Customer>(this.customerKey, customer);
  }

  public editCustomer(update: EditCustomer): Observable<Customer> {
    return this.editItem<Customer>(this.customerKey, update.id, update.data);
  }

  public removeCustomer(id: number): Observable<void> {
    return this.removeItem<Customer>(this.customerKey, id);
  }


  // --- Applications --- //
  public loadApplications(): Observable<Application[]> {
    return this.loadItems<Application>(this.applicationKey);
  }

  public saveApplications(applications: Application[]): void {
    this.saveItems<Application>(this.applicationKey, applications);
  }

  public addApplication(application: Application): Observable<Application> {
    return this.addItem<Application>(this.applicationKey, application);
  }

  public editApplication(update: EditApplication): Observable<Application> {
    return this.editItem<Application>(this.applicationKey, update.id, update.data);
  }

  public removeApplication(id: number): Observable<void> {
    return this.removeItem<Application>(this.applicationKey, id);
  }

  public removeApplicationsByCustomer(customerId: number): Observable<void> {
    return this.loadApplications().pipe(
      map((applications) => {
        this.saveApplications(applications.filter(a => a.customerId !== customerId));
      })
    );
  }


  // --- Tools --- //
  public loadTools(): Observable<Tool[]> {
    return this.loadItems<Tool>(this.toolKey);
  }

  public saveTools(tools: Tool[]): void {
    this.saveItems<Tool>(this.toolKey, tools);
  }

  public addTool(tool: Tool): Observable<Tool> {
    return this.addItem<Tool>(this.toolKey, tool);
  }

  public editTool(update: EditTool): Observable<Tool> {
    return this.editItem<Tool>(this.toolKey, update.id, update.data);
  }

  public removeTool(id: number): Observable<void> {
    return this.removeItem<Tool>(this.toolKey, id);
  }


  // --- Tool Inputs --- //
  public loadToolInputs(): Observable<ToolInput[]> {
    return this.loadItems<ToolInput>(this.toolInputKey);
  }

  public saveToolInputs(toolInputs: ToolInput[]): void {
    this.saveItems<ToolInput>(this.toolInputKey, toolInputs);
  }

  public addToolInput(toolInput: ToolInput): Observable<ToolInput> {
    return this.addItem<ToolInput>(this.toolInputKey, toolInput);
  }

  public editToolInput(update: EditToolInput): Observable<ToolInput> {
    return this.editItem<ToolInput>(this.toolInputKey, update.id, update.data);
  }

  public removeToolInput(id: number): Observable<void> {
    return this.removeItem<ToolInput>(this.toolInputKey, id);
  }


  // --- Tool Outputs --- //
  public loadToolOutputs(): Observable<ToolOutput[]> {
    return this.loadItems<ToolOutput>(this.toolOutputKey);
  }

  public saveToolOutputs(toolOutputs: ToolOutput[]): void {
    this.saveItems<ToolOutput>(this.toolOutputKey, toolOutputs);
  }

  public addToolOutput(toolOutput: ToolOutput): Observable<ToolOutput> {
    return this.addItem<ToolOutput>(this.toolOutputKey, toolOutput);
  }

  public editToolOutput(update: EditToolOutput): Observable<ToolOutput> {
    return this.editItem<ToolOutput>(this.toolOutputKey, update.id, update.data);
  }

  public removeToolOutput(id: number): Observable<void> {
    return this.removeItem<ToolOutput>(this.toolOutputKey, id);
  }


  // --- Input Options --- //
  public loadInputOptions(): Observable<InputOption[]> {
    return this.loadItems<InputOption>(this.inputOptionKey);
  }

  public saveInputOptions(inputOptions: InputOption[]): void {
    this.saveItems<InputOption>(this.inputOptionKey, inputOptions);
  }

  public addInputOption(inputOption: InputOption): Observable<InputOption> {
    return this.addItem<InputOption>(this.inputOptionKey, inputOption);
  }

  public editInputOption(update: EditInputOption): Observable<InputOption> {
    return this.editItem<InputOption>(this.inputOptionKey, update.id, update.data);
  }

  public removeInputOption(id: number): Observable<void> {
    return this.removeItem<InputOption>(this.inputOptionKey, id);
  }
}
