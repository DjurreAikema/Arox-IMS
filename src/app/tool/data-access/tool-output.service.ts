import {computed, effect, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {AddToolOutput, EditToolOutput, RemoveToolOutput, ToolOutput} from "../../shared/interfaces";
import {StorageService} from "../../shared/data-access/storage.service";
import {catchError, EMPTY, map, merge, Observable, Subject} from "rxjs";
import {connect} from "ngxtension/connect";

// State interface
export interface ToolOutputState {
  toolOutputs: ToolOutput[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ToolOutputService {

  private storageService: StorageService = inject(StorageService);

  // --- State (state is initialized with default values here)
  private state: WritableSignal<ToolOutputState> = signal<ToolOutputState>({
    toolOutputs: [],
    loaded: false,
    error: null
  });

  // --- Selectors (the rest of the application can access the data in this service via these selectors)
  public toolOutputs: Signal<ToolOutput[]> = computed(() => this.state().toolOutputs);
  public loaded: Signal<boolean> = computed(() => this.state().loaded);

  // --- Sources (the state gets updated when these sources get a new value, the rest of the application can use these sources to alter the data in the state)
  public add$: Subject<AddToolOutput> = new Subject<AddToolOutput>();
  public edit$: Subject<EditToolOutput> = new Subject<EditToolOutput>();
  public remove$: Subject<RemoveToolOutput> = new Subject<RemoveToolOutput>();

  private error$: Subject<string> = new Subject<string>();
  private toolOutputsLoaded$: Observable<ToolOutput[]> = this.storageService.loadToolOutputs().pipe(
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

      // toolOutputsLoaded$ reducer
      this.toolOutputsLoaded$.pipe(
        map((toolOutputs) => ({toolOutputs, loaded: true}))
      )
    );

    connect(this.state)
      .with(nextState$)

      // add$ reducer
      .with(this.add$, (state, toolOutput) => ({
        toolOutputs: [
          ...state.toolOutputs,
          {
            ...toolOutput.item,
            id: this.generateId(),
            toolId: toolOutput.toolId,
            value: null
          }
        ]
      }))

      // edit$ reducer
      .with(this.edit$, (state, update) => ({
        toolOutputs: state.toolOutputs.map((toolOutput) =>
          toolOutput.id === update.id
            ? {...toolOutput, ...update.data}
            : toolOutput
        )
      }))

      // remove$ reducer
      .with(this.remove$, (state, id) => ({
        toolOutputs: state.toolOutputs.filter((toolOutput) => toolOutput.id !== id),
      }));

    // --- Effects (effects are used to chain certain actions to state updates)
    effect((): void => {
      // this effect saves the toolOutputs to local storage every time the state changes
      if (this.loaded()) {
        this.storageService.saveToolOutputs(this.toolOutputs());
      }
    });
  }

  // --- Functions (these functions are used exclusively inside this state)
  private generateId() {
    return this.toolOutputs().reduce((maxId, tool) => Math.max(maxId, tool.id), 0) + 1;
  }
}
