import {computed, effect, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {AddApplication, Application, EditApplication, RemoveApplication, RemoveCustomer} from "../../shared/interfaces";
import {StorageService} from "../../shared/data-access/storage.service";
import {catchError, EMPTY, exhaustMap, map, merge, Observable, of, retry, Subject} from "rxjs";
import {connect} from "ngxtension/connect";
import {ToolService} from "../../tool/data-access/tool.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";


// State interface
export interface ApplicationState {
  applications: Application[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ApplicationService {

  private http: HttpClient = inject(HttpClient);
  private storageService: StorageService = inject(StorageService);
  private toolService: ToolService = inject(ToolService);

  // --- State (state is initialized with default values here)
  private state: WritableSignal<ApplicationState> = signal<ApplicationState>({
    applications: [],
    loaded: false,
    error: null
  });

  // --- Selectors (the rest of the application can access the data in this service via these selectors)
  public applications: Signal<Application[]> = computed(() => this.state().applications);
  public applicationsCount: Signal<number> = computed(() => this.state().applications.length);
  public loaded: Signal<boolean> = computed(() => this.state().loaded);

  // --- Sources (the state gets updated when these sources get a new value, the rest of the application can use these sources to alter the data in the state)
  public applications$: Observable<Application[]> = this.load().pipe(
    retry(3),
    catchError((err) => {
      this.error$.next(err.message);
      return EMPTY;
    })
  );

  public add$: Subject<AddApplication> = new Subject<AddApplication>();
  public edit$: Subject<EditApplication> = new Subject<EditApplication>();
  public remove$: Subject<RemoveApplication> = this.toolService.applicationRemoved$;
  public customerRemoved$: Subject<RemoveCustomer> = new Subject<RemoveCustomer>();

  private error$: Subject<string> = new Subject<string>();

  // --- Reducers (reducers subscribe to the sources and update the actual state)
  constructor() {
    const nextState$ = merge(
      // error$ reducer
      this.error$.pipe(map((error) => ({error}))),

      // applications$ reducer
      this.applications$.pipe(map((applications) => ({
        applications: applications,
        loaded: true,
        error: null
      }))),

      // add$ reducer
      this.add$.pipe(
        exhaustMap((application) =>
          this.new(application).pipe(
            map((newApplication) => ({
              applications: [...this.applications(), newApplication],
              error: null
            })),
            catchError((err) => of({error: err.message}))
          )
        )
      ),

      // edit$ reducer
      this.edit$.pipe(
        exhaustMap((update) =>
          this.edit(update).pipe(
            map((updatedApplication) => ({
              applications: this.applications().map((application) =>
                application.id === updatedApplication.id ? updatedApplication : application
              ),
              error: null
            })),
            catchError((err) => of({error: err.message}))
          )
        )
      ),

      // remove$ reducer
      this.remove$.pipe(
        exhaustMap((id) =>
          this.remove(id).pipe(
            map(() => ({
              applications: this.applications().filter((application) => application.id !== id),
              error: null
            })),
            catchError((err) => of({error: err.message}))
          )
        )
      ),

      // customerRemoved$ reducer
      this.customerRemoved$.pipe(
        exhaustMap((customerId) =>
          this.removeByCustomerId(customerId).pipe(
            map(() => ({
              applications: this.applications().filter((application) => application.customerId !== customerId),
              error: null
            })),
            catchError((err) => of({error: err.message}))
          )
        )
      ),
    );

    connect(this.state)
      .with(nextState$);


    // --- Effects (effects are used to chain certain actions to state updates)
    if (environment.demoMode) {
      effect(() => {
        this.storageService.saveApplications(this.applications());
      });
    }
  }

  // --- Functions (these functions are used exclusively inside this state)
  private load(): Observable<Application[]> {
    if (environment.demoMode) return this.storageService.loadApplications();
    else
      return this.http.get<Application[]>(`${environment.apiUrl}/applications`);
  }

  private new(application: AddApplication): Observable<Application> {
    if (environment.demoMode) return this.storageService.addApplication(this.addIdToApplication(application));
    else
      return this.http.post<Application>(`${environment.apiUrl}/applications`, {
        customerId: application.customerId,
        ...application.item
      });
  }

  private edit(update: EditApplication): Observable<Application> {
    if (environment.demoMode) return this.storageService.editApplication(update);
    else
      return this.http.put<Application>(`${environment.apiUrl}/applications/${update.id}`, update.data);
  }

  private remove(id: number): Observable<void> {
    if (environment.demoMode) return this.storageService.removeApplication(id);
    else
      return this.http.delete<void>(`${environment.apiUrl}/applications/${id}`);
  }

  private removeByCustomerId(customerId: number): Observable<void> {
    if (environment.demoMode) return this.storageService.removeApplicationsByCustomer(customerId);
    else
      return this.http.delete<void>(`${environment.apiUrl}/customers/${customerId}/applications`);
  }

  // Local storage only
  private addIdToApplication(application: AddApplication): Application {
    const id = this.generateId();
    return {
      id,
      customerId: application.customerId,
      ...application.item
    };
  }

  private generateId(): number {
    return this.applications().length > 0 ? Math.max(...this.applications().map(a => a.id)) + 1 : 1;
  }
}
