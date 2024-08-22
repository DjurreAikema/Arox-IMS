import {computed, effect, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {AddTool, Tool, EditTool, RemoveTool} from "../../shared/interfaces";
import {StorageService} from "../../shared/data-access/storage.service";
import {catchError, EMPTY, map, merge, Observable, Subject} from "rxjs";
import {connect} from "ngxtension/connect";

// State interface
export interface ToolState {
  tools: Tool[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ToolService {

  private storageService: StorageService = inject(StorageService);

  // --- State (state is initialized with default values here)
  private state: WritableSignal<ToolState> = signal<ToolState>({
    tools: [],
    loaded: false,
    error: null
  });

  // --- Selectors (the rest of the application can access the data in this service via these selectors)
  public tools: Signal<Tool[]> = computed(() => this.state().tools);
  public loaded: Signal<boolean> = computed(() => this.state().loaded);

  // --- Sources (the state gets updated when these sources get a new value, the rest of the application can use these sources to alter the data in the state)
  public add$: Subject<AddTool> = new Subject<AddTool>();
  public edit$: Subject<EditTool> = new Subject<EditTool>();
  public remove$: Subject<RemoveTool> = new Subject<RemoveTool>();

  private error$: Subject<string> = new Subject<string>();
  private toolsLoaded$: Observable<Tool[]> = this.storageService.loadTools().pipe(
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

      // toolsLoaded$ reducer
      this.toolsLoaded$.pipe(
        map((tools) => ({tools, loaded: true}))
      )
    );

    connect(this.state)
      .with(nextState$)

      // add$ reducer
      .with(this.add$, (state, tool) => ({
        tools: [...state.tools, this.addIdToTool(tool)],
      }))

      // remove$ reducer
      .with(this.remove$, (state, id) => ({
        tools: state.tools.filter((tool) => tool.id !== id),
      }))

      // edit$ reducer
      .with(this.edit$, (state, update) => ({
        tools: state.tools.map((tool) =>
          tool.id === update.id
            ? {...tool, name: update.data.name}
            : tool
        ),
      }));

    // --- Effects (effects are used to chain certain actions to state updates)
    effect((): void => {
      // this effect saves the tools to local storage every time the state changes
      if (this.loaded()) {
        this.storageService.saveTools(this.tools());
      }
    });
  }

  // --- Functions (these functions are used exclusively inside this state)
  private addIdToTool(tool: AddTool) {
    return {
      ...tool,
      id: this.generateId()
    };
  }

  private generateId() {
    return this.tools().reduce((maxId, tool) => Math.max(maxId, tool.id), 0) + 1;
  }
}
