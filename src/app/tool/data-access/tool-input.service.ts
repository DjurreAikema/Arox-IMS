import {computed, effect, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {AddToolInput, EditToolInput, RemoveTool, RemoveToolInput, ToolInput} from "../../shared/interfaces";
import {StorageService} from "../../shared/data-access/storage.service";
import {catchError, EMPTY, exhaustMap, map, merge, Observable, of, retry, Subject} from "rxjs";
import {connect} from "ngxtension/connect";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

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

  private http: HttpClient = inject(HttpClient);
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
  public toolInputs$: Observable<ToolInput[]> = this.load().pipe(
    retry(3),
    catchError((err) => {
      this.error$.next(err.message);
      return EMPTY;
    }),
  );

  public add$: Subject<AddToolInput> = new Subject<AddToolInput>();
  public edit$: Subject<EditToolInput> = new Subject<EditToolInput>();
  public remove$: Subject<RemoveToolInput> = new Subject<RemoveToolInput>();
  public toolRemoved$: Subject<RemoveTool> = new Subject<RemoveTool>()

  private error$: Subject<string> = new Subject<string>();

  // --- Reducers (reducers subscribe to the sources and update the actual state)
  constructor() {
    const nextState$ = merge(
      // error$ reducer
      this.error$.pipe(map((error) => ({error}))),

      // toolInputs$ reducer
      this.toolInputs$.pipe(map((toolInputs) => ({
        toolInputs: toolInputs,
        loaded: true,
        error: null
      }))),

      // add$ reducer
      this.add$.pipe(
        exhaustMap((toolInput) =>
          this.new(toolInput).pipe(
            map((newToolInput) => ({
              toolInputs: [...this.toolInputs(), newToolInput],
              error: null
            })),
            catchError((error) => of({error: error.message}))
          )
        )
      ),

      // edit$ reducer
      this.edit$.pipe(
        exhaustMap((update) =>
          this.edit(update).pipe(
            map((updatedToolInput) => ({
              toolInputs: this.toolInputs().map((toolInput) =>
                toolInput.id === updatedToolInput.id ? updatedToolInput : toolInput
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
              toolInputs: this.toolInputs().filter((toolInput) => toolInput.id !== id),
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
        this.storageService.saveToolInputs(this.toolInputs());
      });
    }
  }

  // --- Functions (these functions are used exclusively inside this state)
  private load(): Observable<ToolInput[]> {
    if (environment.demoMode) return this.storageService.loadToolInputs();
    else
      return this.http.get<ToolInput[]>(`${environment.apiUrl}/tool-inputs`);
  }

  private new(toolInput: AddToolInput): Observable<ToolInput> {
    if (environment.demoMode) return this.storageService.addToolInput(this.addIdToToolInput(toolInput));
    else
      return this.http.post<ToolInput>(`${environment.apiUrl}/tool-inputs`, {
        toolId: toolInput.toolId,
        ...toolInput.item
      });
  }

  private edit(update: EditToolInput): Observable<ToolInput> {
    if (environment.demoMode) return this.storageService.editToolInput(update);
    else
      return this.http.put<ToolInput>(`${environment.apiUrl}/tool-inputs/${update.id}`, update.data);
  }

  private remove(id: number): Observable<void> {
    if (environment.demoMode) return this.storageService.removeToolInput(id);
    else
      return this.http.delete<void>(`${environment.apiUrl}/tool-inputs/${id}`);
  }

  // Local storage only
  private addIdToToolInput(toolInput: AddToolInput): ToolInput {
    const id = this.generateId();
    return {
      id,
      toolId: toolInput.toolId,
      ...toolInput.item
    };
  }

  private generateId(): number {
    return this.toolInputs().length > 0 ? Math.max(...this.toolInputs().map(ti => ti.id)) + 1 : 1;
  }
}
