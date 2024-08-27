import {Component, computed, effect, inject, signal} from '@angular/core';
import {ApplicationService} from "./data-access/application.service";
import {ActivatedRoute, RouterLink} from "@angular/router";
import {toSignal} from "@angular/core/rxjs-interop";
import {JsonPipe} from "@angular/common";
import {ToolService} from "../tool/data-access/tool.service";
import {FormBuilder, Validators} from "@angular/forms";
import {Tool} from "../shared/interfaces";
import {ToolListComponent} from "../tool/ui-tools/tool-list.component";
import {FormModalComponent} from "../shared/ui/form-modal.component";
import {ModalComponent} from "../shared/ui/modal.component";
import {MatCard, MatCardContent} from "@angular/material/card";

@Component({
  selector: 'app-application-details',
  standalone: true,
  imports: [
    JsonPipe,
    RouterLink,
    ToolListComponent,
    FormModalComponent,
    ModalComponent,
    MatCard,
    MatCardContent
  ],
  template: `
    @if (application(); as application) {
      <header>
        <button class="button-primary" routerLink="/customer/{{application.customerId}}">< Back</button>

        <h1>Application: {{ application.name }}</h1>

        <button class="button-success" (click)="toolBeingEdited.set({})">Add Tool +</button>
      </header>

      <mat-card class="list-header">
        <mat-card-content>
          All tool belonging to {{ application.name }} ({{toolService.toolsCount()}})
        </mat-card-content>
      </mat-card>
    }

    <section>
      <app-tool-list
        [tools]="tools()"
        (add)="toolBeingEdited.set({})"
        (edit)="toolBeingEdited.set($event)"
        (delete)="toolService.remove$.next($event)"
      />
    </section>

    <app-modal [isOpen]="!!toolBeingEdited()">
      <ng-template>
        <app-form-modal
          [formGroup]="toolForm"
          [title]="
            toolBeingEdited()?.name
                ? toolBeingEdited()!.name!
                : 'Add tool'
          "
          (close)="toolBeingEdited.set(null)"
          (save)="
            toolBeingEdited()?.id
              ? toolService.edit$.next({
                id: toolBeingEdited()!.id!,
                data: toolForm.getRawValue()
              })
              : toolService.add$.next({
                item: toolForm.getRawValue(),
                applicationId: application()?.id!
              })
          "
        />
      </ng-template>
    </app-modal>
  `,
  styles:  [`
    header {
      display: flex;
      flex-flow: row nowrap;

      justify-content: space-between;
      align-items: center;

      padding: 0 1rem;

      border-bottom: 1px solid var(--color-dark);
    }

    h1 {
      margin: 0;
      font-size: 1.8em;
    }

    section {
      padding: 1rem;
      height: calc(100vh - 120px);
      overflow-y: auto;
    }

    .list-header {
      display: flex;
      flex-flow: row nowrap;
      justify-content: center;

      background-color: var(--color-light);
      margin: 1rem 1rem 0 1rem;
      padding: 0;

      mat-card-content {
        padding: 5px;
      }
    }
  `]
})
// Responsibility: Smart component in charge of showing a application details
// Get the application by its id, get this id from the url parameters
export default class ApplicationDetailsComponent {

  // --- Dependencies
  public applicationService: ApplicationService = inject(ApplicationService);
  protected toolService: ToolService = inject(ToolService);

  private route: ActivatedRoute = inject(ActivatedRoute);
  private fb: FormBuilder = inject(FormBuilder);

  // --- Properties
  public params = toSignal(this.route.paramMap);

  // Get the application by the id in the url parameters
  public application = computed(() => {
    const id = Number(this.params()?.get('id'));
    return this.applicationService
      .applications()
      .find((application) => application.id === id);
  });

  // --- Tools
  // Array of tools for the selected application
  public tools = computed(() => {
    const id = Number(this.params()?.get('id'));
    return this.toolService
      .tools()
      .filter((tool) => tool.applicationId == id)
  });

  // Track the tool that is currently being edited
  public toolBeingEdited = signal<Partial<Tool> | null>(null);

  // Form for creating/editing tools
  public toolForm = this.fb.nonNullable.group({
    name: ['', [Validators.required, Validators.minLength(3)]],
  });

  constructor() {
    // Reset `toolForm` when `toolBeingEdited()` is null
    effect((): void => {
      const tool: Partial<Tool> | null = this.toolBeingEdited();
      if (!tool) this.toolForm.reset(); // Imperative code
      else {
        this.toolForm.patchValue({
          name: tool.name
        });
      }
    });
  }
}
