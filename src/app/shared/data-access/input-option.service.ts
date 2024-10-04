import {computed, effect, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {AddInputOption, EditInputOption, InputOption, RemoveInputOption} from "../interfaces";
import {StorageService} from "./storage.service";
import {catchError, concatMap, EMPTY, exhaustMap, map, merge, Observable, of, retry, Subject} from "rxjs";
import {connect} from "ngxtension/connect";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

// State interface
export interface InputOptionState {
  inputOptions: InputOption[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class InputOptionService {

  private http: HttpClient = inject(HttpClient);
  private storageService: StorageService = inject(StorageService);

  // --- State (state is initialized with default values here)
  private state: WritableSignal<InputOptionState> = signal<InputOptionState>({
    inputOptions: [],
    loaded: false,
    error: null
  });

  // --- Selectors (the rest of the application can access the data in this service via these selectors)
  public inputOptions: Signal<InputOption[]> = computed(() => this.state().inputOptions);
  public loaded: Signal<boolean> = computed(() => this.state().loaded);

  // --- Sources (the state gets updated when these sources get a new value, the rest of the application can use these sources to alter the data in the state)
  public inputOptions$: Observable<InputOption[]> = this.load().pipe(
    retry(3),
    catchError((err) => {
      this.error$.next(err.message);
      return EMPTY;
    }),
  );

  public add$: Subject<AddInputOption> = new Subject<AddInputOption>();
  public edit$: Subject<EditInputOption> = new Subject<EditInputOption>();
  public remove$: Subject<RemoveInputOption> = new Subject<RemoveInputOption>();

  private error$: Subject<string> = new Subject<string>();

  // --- Reducers (reducers subscribe to the sources and update the actual state)
  constructor() {
    const nextState$ = merge(
      // error$ reducer
      this.error$.pipe(map((error) => ({error}))),

      // inputOptions$ reducer
      this.inputOptions$.pipe(map((inputOptions) => ({
        inputOptions: inputOptions,
        loaded: true,
        error: null
      }))),

      // add$ reducer
      this.add$.pipe(
        concatMap((inputOption) =>
          this.new(inputOption).pipe(
            map((newInputOption) => ({
              inputOptions: [...this.inputOptions(), newInputOption],
              error: null
            })),
            catchError((error) => of({error: error.message}))
          )
        )
      ),

      // edit$ reducer
      this.edit$.pipe(
        concatMap((update) =>
          this.edit(update).pipe(
            map((updatedInputOption) => ({
              inputOptions: this.inputOptions().map((inputOption) =>
                inputOption.id === updatedInputOption.id ? updatedInputOption : inputOption
              ),
              error: null
            })),
            catchError((error) => of({error: error.message}))
          )
        )
      ),

      // remove$ reducer
      this.remove$.pipe(
        exhaustMap((id) =>
          this.remove(id).pipe(
            map(() => ({
              inputOptions: this.inputOptions().filter((inputOption) => inputOption.id !== id),
              error: null
            })),
            catchError((error) => of({error: error.message}))
          )
        )
      ),
    );

    connect(this.state)
      .with(nextState$);

    // --- Effects (effects are used to chain certain actions to state updates)
    if (environment.demoMode) {
      effect(() => {
        this.storageService.saveInputOptions(this.inputOptions());
      });
    }
  }

  // --- Functions (these functions are used exclusively inside this state)
  private load(): Observable<InputOption[]> {
    if (environment.demoMode) return this.storageService.loadInputOptions();
    else
      return this.http.get<InputOption[]>(`${environment.apiUrl}/input-options`);
  }

  private new(inputOption: AddInputOption): Observable<InputOption> {
    if (environment.demoMode) return this.storageService.addInputOption(this.addIdToInputOption(inputOption));
    else
      return this.http.post<InputOption>(`${environment.apiUrl}/input-options`, {
        inputId: inputOption.inputId,
        ...inputOption.item
      });
  }

  private edit(update: EditInputOption): Observable<InputOption> {
    if (environment.demoMode) return this.storageService.editInputOption(update);
    else
      return this.http.put<InputOption>(`${environment.apiUrl}/input-options/${update.id}`, update.data);
  }

  private remove(id: number): Observable<void> {
    if (environment.demoMode) return this.storageService.removeInputOption(id);
    else
      return this.http.delete<void>(`${environment.apiUrl}/input-options/${id}`);
  }

  // Local storage only
  private addIdToInputOption(inputOption: AddInputOption): InputOption {
    const id = this.generateId();
    return {
      id,
      inputId: inputOption.inputId,
      ...inputOption.item
    };
  }

  private generateId(): number {
    return this.inputOptions().length > 0 ? Math.max(...this.inputOptions().map(io => io.id)) + 1 : 1;
  }
}
