import {computed, effect, inject, Injectable, Signal, signal, WritableSignal} from '@angular/core';
import {AddTool, Tool, EditTool, RemoveTool, RemoveApplication} from "../../shared/interfaces";
import {StorageService} from "../../shared/data-access/storage.service";
import {catchError, EMPTY, exhaustMap, map, merge, Observable, of, retry, Subject} from "rxjs";
import {connect} from "ngxtension/connect";
import {ToolInputService} from "./tool-input.service";
import {ToolOutputService} from "./tool-output.service";
import {HttpClient} from "@angular/common/http";
import {environment} from "../../../environments/environment";

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

  private http: HttpClient = inject(HttpClient);
  private storageService: StorageService = inject(StorageService);
  private toolInputService: ToolInputService = inject(ToolInputService);
  private toolOutputService: ToolOutputService = inject(ToolOutputService);

  // --- State (state is initialized with default values here)
  private state: WritableSignal<ToolState> = signal<ToolState>({
    tools: [],
    loaded: false,
    error: null
  });

  // --- Selectors (the rest of the application can access the data in this service via these selectors)
  public tools: Signal<Tool[]> = computed(() => this.state().tools);
  public toolsCount: Signal<number> = computed(() => this.state().tools.length);
  public loaded: Signal<boolean> = computed(() => this.state().loaded);

  // --- Sources (the state gets updated when these sources get a new value, the rest of the application can use these sources to alter the data in the state)
  public tools$: Observable<Tool[]> = this.load().pipe(
    retry(3),
    catchError((err) => {
      this.error$.next(err.message);
      return EMPTY;
    }),
  );

  public add$: Subject<AddTool> = new Subject<AddTool>();
  public edit$: Subject<EditTool> = new Subject<EditTool>();
  public remove$: Subject<RemoveTool> = new Subject<RemoveTool>();
  public applicationRemoved$: Subject<RemoveApplication> = new Subject<RemoveApplication>();

  private error$: Subject<string> = new Subject<string>();

  // --- Reducers (reducers subscribe to the sources and update the actual state)
  constructor() {
    const nextState$ = merge(
      // error$ reducer
      this.error$.pipe(map((error) => ({error}))),

      // tools$ reducer
      this.tools$.pipe(map((tools) => ({
        tools: tools,
        loaded: true,
        error: null
      }))),

      // add$ reducer
      this.add$.pipe(
        exhaustMap((tool) =>
          this.new(tool).pipe(
            map((newTool) => ({
              tools: [...this.tools(), newTool],
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
            map((updatedTool) => ({
              tools: this.tools().map((tool) =>
                tool.id === updatedTool.id ? updatedTool : tool
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
              tools: this.tools().filter((tool) => tool.id !== id),
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
        this.storageService.saveTools(this.tools());
      });
    }
  }

  // --- Functions (these functions are used exclusively inside this state)
  private load(): Observable<Tool[]> {
    if (environment.demoMode) return this.storageService.loadTools();
    else
      return this.http.get<Tool[]>(`${environment.apiUrl}/tools`);
  }

  private new(tool: AddTool): Observable<Tool> {
    if (environment.demoMode) return this.storageService.addTool(this.addIdToTool(tool));
    else
      return this.http.post<Tool>(`${environment.apiUrl}/tools`, {
        applicationId: tool.applicationId,
        ...tool.item
      });
  }

  private edit(update: EditTool): Observable<Tool> {
    if (environment.demoMode) return this.storageService.editTool(update);
    else
      return this.http.put<Tool>(`${environment.apiUrl}/tools/${update.id}`, update.data);
  }

  private remove(id: number): Observable<void> {
    if (environment.demoMode) {
      return this.storageService.removeTool(id).pipe(
        map(() => {
          this.toolInputService.toolRemoved$.next(id);
          this.toolOutputService.toolRemoved$.next(id);
        })
      );
    } else {
      return this.http.delete<void>(`${environment.apiUrl}/tools/${id}`).pipe(
        map(() => {
          this.toolInputService.toolRemoved$.next(id);
          this.toolOutputService.toolRemoved$.next(id);
        })
      );
    }
  }

  // Local storage only
  private addIdToTool(tool: AddTool): Tool {
    const id = this.generateId();
    return {
      id,
      applicationId: tool.applicationId,
      ...tool.item
    };
  }

  private generateId(): number {
    return this.tools().length > 0 ? Math.max(...this.tools().map(t => t.id)) + 1 : 1;
  }
}
