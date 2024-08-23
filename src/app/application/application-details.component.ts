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

@Component({
  selector: 'app-application-details',
  standalone: true,
  imports: [
    JsonPipe,
    RouterLink,
    ToolListComponent,
    FormModalComponent,
    ModalComponent
  ],
  template: `
    @if (application(); as application) {
      <header>
        <button class="button-primary" routerLink="/customer/{{application.customerId}}">Back</button>

        <div class="title">
          <h1>{{ application.name }}</h1>
        </div>

        <div>
          <button (click)="toolBeingEdited.set({})">Add Tool</button>
        </div>
      </header>
    }

    <app-tool-list
      [tools]="tools()"
      (edit)="toolBeingEdited.set($event)"
      (delete)="toolService.remove$.next($event)"
    />

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
    .title {
      display: flex;
      flex-flow: column;
      align-items: center;
    }

    button {
      margin-left: 1rem;
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
