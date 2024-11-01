import {computed, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {HttpClient} from "@angular/common/http";
import {catchError, exhaustMap, map, merge, Observable, of, Subject} from "rxjs";
import {connect} from "ngxtension/connect";

// State interface
export interface ToolExecuteState {
  response: any;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ToolExecuteService {

  private http: HttpClient = inject(HttpClient);

  // --- State (state is initialized with default values here)
  private state: WritableSignal<ToolExecuteState> = signal<ToolExecuteState>({
    response: null,
    error: null
  });

  // --- Selectors (the rest of the application can access the data in this service via these selectors)
  public response: Signal<any> = computed(() => this.state().response);
  public error: Signal<any> = computed(() => this.state().error);

  // --- Sources (the state gets updated when these sources get a new value, the rest of the application can use these sources to alter the data in the state)
  public postToApi$: Subject<[any, string]> = new Subject<[any, string]>();

  private error$: Subject<string> = new Subject<string>();

  // --- Reducers (reducers subscribe to the sources and update the actual state)
  constructor() {
    const nextState$ = merge(
      // error$ reducer
      this.error$.pipe(map((error) => ({error}))),

      // postToApi$ reducer
      this.postToApi$.pipe(
        exhaustMap((data) =>
          this.postToApi(data[0], data[1]).pipe(
            map((response) => ({
              response: response,
              error: null
            })),
            catchError((error) => of({error: error.message}))
          )
        )
      )
    );

    connect(this.state)
      .with(nextState$);
  }

  // --- Functions (these functions are used exclusively inside this state)
  private postToApi(formData: any, apiUrl: string): Observable<any> {

    // TODO Actually execute the tool :)
    console.log(apiUrl, formData);

    return of({
      exampleOne: 'This is an example response',
      exampleTwo: 175,
      exampleThree: 'Example choice',
    });
  }
}
