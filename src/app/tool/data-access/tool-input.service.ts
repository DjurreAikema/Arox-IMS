import {computed, effect, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {AddToolInput, EditToolInput, RemoveToolInput, ToolInput} from "../../shared/interfaces";
import {StorageService} from "../../shared/data-access/storage.service";
import {catchError, EMPTY, map, merge, Observable, Subject} from "rxjs";
import {connect} from "ngxtension/connect";

// State interface
export interface ToolInputState {
  toolInputs: ToolInput[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ToolInputService {

  private storageService: StorageService = inject(StorageService);

  // --- State (state is initialized with default values here)
  private state: WritableSignal<ToolInputState> = signal<ToolInputState>({
    toolInputs: [],
    loaded: false,
    error: null
  });

  // --- Selectors (the rest of the application can access the data in this service via these selectors)
  public toolInputs: Signal<ToolInput[]> = computed(() => this.state().toolInputs);
  public loaded: Signal<boolean> = computed(() => this.state().loaded);

  // --- Sources (the state gets updated when these sources get a new value, the rest of the application can use these sources to alter the data in the state)
  public add$: Subject<AddToolInput> = new Subject<AddToolInput>();
  public edit$: Subject<EditToolInput> = new Subject<EditToolInput>();
  public remove$: Subject<RemoveToolInput> = new Subject<RemoveToolInput>();

  private error$: Subject<string> = new Subject<string>();
  private toolInputsLoaded$: Observable<ToolInput[]> = this.storageService.loadToolInputs().pipe(
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

      // toolInputsLoaded$ reducer
      this.toolInputsLoaded$.pipe(
        map((toolInputs) => ({toolInputs, loaded: true}))
      )
    );

    connect(this.state)
      .with(nextState$)

      // add$ reducer
      .with(this.add$, (state, toolInput) => ({
        toolInputs: [
          ...state.toolInputs,
          {
            ...toolInput.item,
            id: this.generateId(),
            toolId: toolInput.toolId
          }
        ]
      }))

      // edit$ reducer
      .with(this.edit$, (state, update) => ({
        toolInputs: state.toolInputs.map((toolInput) =>
          toolInput.id === update.id
            ? {...toolInput, ...update.data}
            : toolInput
        )
      }))

      // remove$ reducer
      .with(this.remove$, (state, id) => ({
        toolInputs: state.toolInputs.filter((toolInput) => toolInput.id !== id),
      }));

    // --- Effects (effects are used to chain certain actions to state updates)
    effect((): void => {
      // this effect saves the toolInputs to local storage every time the state changes
      if (this.loaded()) {
        this.storageService.saveToolInputs(this.toolInputs());
      }
    });
  }

  // --- Functions (these functions are used exclusively inside this state)
  private generateId() {
    return this.toolInputs().reduce((maxId, tool) => Math.max(maxId, tool.id), 0) + 1;
  }
}
