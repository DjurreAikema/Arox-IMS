import {computed, effect, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {AddToolOutput, EditToolOutput, RemoveTool, RemoveToolOutput, ToolOutput} from "../../shared/interfaces";
import {StorageService} from "../../shared/data-access/storage.service";
import {catchError, EMPTY, exhaustMap, map, merge, Observable, of, retry, Subject} from "rxjs";
import {connect} from "ngxtension/connect";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

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

  private http: HttpClient = inject(HttpClient);
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
  public toolOutputs$: Observable<ToolOutput[]> = this.load().pipe(
    retry(3),
    catchError((err) => {
      this.error$.next(err.message);
      return EMPTY;
    }),
  );

  public add$: Subject<AddToolOutput> = new Subject<AddToolOutput>();
  public edit$: Subject<EditToolOutput> = new Subject<EditToolOutput>();
  public remove$: Subject<RemoveToolOutput> = new Subject<RemoveToolOutput>();
  public toolRemoved$: Subject<RemoveTool> = new Subject<RemoveTool>()

  private error$: Subject<string> = new Subject<string>();

  // --- Reducers (reducers subscribe to the sources and update the actual state)
  constructor() {
    const nextState$ = merge(
      // error$ reducer
      this.error$.pipe(map((error) => ({error}))),

      // toolOutputs$ reducer
      this.toolOutputs$.pipe(map((toolOutputs) => ({
        toolOutputs: toolOutputs,
        loaded: true,
        error: null
      }))),

      // add$ reducer
      this.add$.pipe(
        exhaustMap((toolOutput) =>
          this.new(toolOutput).pipe(
            map((newToolOutput) => ({
              toolOutputs: [...this.toolOutputs(), newToolOutput],
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
            map((updatedToolOutput) => ({
              toolOutputs: this.toolOutputs().map((toolOutput) =>
                toolOutput.id === updatedToolOutput.id ? updatedToolOutput : toolOutput
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
              toolOutputs: this.toolOutputs().filter((toolOutput) => toolOutput.id !== id),
              error: null
            })),
            catchError((error) => of({error: error.message}))
          )
        )
      )
    );

    connect(this.state)
      .with(nextState$);

    // --- Effects (effects are used to chain certain actions to state updates)
    if (environment.demoMode) {
      effect(() => {
        this.storageService.saveToolOutputs(this.toolOutputs());
      });
    }
  }

  // --- Functions (these functions are used exclusively inside this state)
  private load(): Observable<ToolOutput[]> {
    if (environment.demoMode) return this.storageService.loadToolOutputs();
    else
      return this.http.get<ToolOutput[]>(`${environment.apiUrl}/tool-outputs`);
  }

  private new(toolOutput: AddToolOutput): Observable<ToolOutput> {
    if (environment.demoMode) return this.storageService.addToolOutput(this.addIdToToolOutput(toolOutput));
    else
      return this.http.post<ToolOutput>(`${environment.apiUrl}/tool-outputs`, {
        toolId: toolOutput.toolId,
        ...toolOutput.item
      });
  }

  private edit(update: EditToolOutput): Observable<ToolOutput> {
    if (environment.demoMode) return this.storageService.editToolOutput(update);
    else
      return this.http.put<ToolOutput>(`${environment.apiUrl}/tool-outputs/${update.id}`, update.data);
  }

  private remove(id: number): Observable<void> {
    if (environment.demoMode) return this.storageService.removeToolOutput(id);
    else
      return this.http.delete<void>(`${environment.apiUrl}/tool-outputs/${id}`);
  }

  // Local storage only
  private addIdToToolOutput(toolOutput: AddToolOutput): ToolOutput {
    const id = this.generateId();
    return {
      id,
      toolId: toolOutput.toolId,
      value: null,
      ...toolOutput.item
    };
  }

  private generateId(): number {
    return this.toolOutputs().length > 0 ? Math.max(...this.toolOutputs().map(to => to.id)) + 1 : 1;
  }
}
