import {computed, effect, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {AddApplication, Application, EditApplication, RemoveApplication, RemoveCustomer} from "../../shared/interfaces";
import {StorageService} from "../../shared/data-access/storage.service";
import {catchError, EMPTY, map, merge, Observable, Subject} from "rxjs";
import {connect} from "ngxtension/connect";

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

  private storageService: StorageService = inject(StorageService);

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
  public add$: Subject<AddApplication> = new Subject<AddApplication>();
  public edit$: Subject<EditApplication> = new Subject<EditApplication>();
  public remove$: Subject<RemoveApplication> = new Subject<RemoveApplication>();

  public customerRemoved$: Subject<RemoveCustomer> = new Subject<RemoveCustomer>();

  private error$: Subject<string> = new Subject<string>();
  private applicationsLoaded$: Observable<Application[]> = this.storageService.loadApplications().pipe(
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
      this.applicationsLoaded$.pipe(
        map((applications) => ({applications, loaded: true}))
      )
    );

    connect(this.state)
      .with(nextState$)

      // add$ reducer
      .with(this.add$, (state, application) => ({
        applications: [
          ...state.applications,
          {
            ...application.item,
            id: this.generateId(),
            customerId: application.customerId
          },
        ],
      }))

      // edit$ reducer
      .with(this.edit$, (state, update) => ({
        applications: state.applications.map((application) =>
          application.id === update.id
            ? {...application, name: update.data.name}
            : application
        ),
      }))

      // remove$ reducer
      .with(this.remove$, (state, id) => ({
        applications: state.applications.filter((application) => application.id !== id),
      }))

      // customerRemoved$ reducer
      .with(this.customerRemoved$, (state, customerId) => ({
        applications: state.applications.filter((application) => application.customerId !== customerId)
      }));

    // --- Effects (effects are used to chain certain actions to state updates)
    effect((): void => {
      // this effect saves the applications to local storage every time the state changes
      if (this.loaded()) {
        this.storageService.saveApplications(this.applications());
      }
    });
  }

  // --- Functions (these functions are used exclusively inside this state)
  private generateId() {
    return this.applications().reduce((maxId, obj) => Math.max(maxId, obj.id), 0) + 1;
  }
}
