import {computed, effect, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {AddInputOption, EditInputOption, InputOption, RemoveInputOption} from "../interfaces";
import {StorageService} from "./storage.service";
import {catchError, EMPTY, map, merge, Observable, Subject} from "rxjs";
import {connect} from "ngxtension/connect";

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
  public add$: Subject<AddInputOption> = new Subject<AddInputOption>();
  public edit$: Subject<EditInputOption> = new Subject<EditInputOption>();
  public remove$: Subject<RemoveInputOption> = new Subject<RemoveInputOption>();

  private error$: Subject<string> = new Subject<string>();
  private inputOptionsLoaded$: Observable<InputOption[]> = this.storageService.loadInputOptions().pipe(
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

      // inputOptionsLoaded$ reducer
      this.inputOptionsLoaded$.pipe(
        map((inputOptions) => ({inputOptions, loaded: true}))
      )
    );

    connect(this.state)
      .with(nextState$)

      // add$ reducer
      .with(this.add$, (state, inputOption) => ({
        inputOptions: [
          ...state.inputOptions,
          {
            ...inputOption.item,
            id: this.generateId(),
            inputId: inputOption.inputId
          }
        ]
      }))

      // edit$ reducer
      .with(this.edit$, (state, update) => ({
        inputOptions: state.inputOptions.map((inputOption) =>
          inputOption.id === update.id
            ? {...inputOption, ...update.data}
            : inputOption
        ),
      }))

      // remove$ reducer
      .with(this.remove$, (state, id) => {
        return {
          inputOptions: state.inputOptions.filter((inputOption) => inputOption.id !== id),
        };
      });

    // --- Effects (effects are used to chain certain actions to state updates)
    effect((): void => {
      // this effect saves the inputOptions to local storage every time the state changes
      if (this.loaded()) {
        this.storageService.saveInputOptions(this.inputOptions());
      }
    });
  }

  // --- Functions (these functions are used exclusively inside this state)
  private generateId() {
    return this.inputOptions().reduce((maxId, tool) => Math.max(maxId, tool.id), 0) + 1;
  }
}
