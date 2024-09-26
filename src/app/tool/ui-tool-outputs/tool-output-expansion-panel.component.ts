import {Component, input, output, signal} from '@angular/core';
import {MatExpansionModule} from "@angular/material/expansion";
import {RemoveToolOutput, ToolInputTypeEnum, ToolOutput} from "../../shared/interfaces";
import {EnumToTextPipe} from "../../shared/pipes/enum-to-text.pipe";
import {MatIcon} from "@angular/material/icon";
import {MatSuffix} from "@angular/material/form-field";
import {MatTooltip} from "@angular/material/tooltip";
import {ConfirmModalComponent} from "../../shared/ui/modals/confirm-modal.component";
import {ModalComponent} from "../../shared/ui/modals/modal.component";

@Component({
  selector: 'app-tool-output-expansion-panel',
  standalone: true,
  imports: [
    MatExpansionModule,
    EnumToTextPipe,
    MatIcon,
    MatSuffix,
    MatTooltip,
    ConfirmModalComponent,
    ModalComponent
  ],
  template: `
    <mat-expansion-panel (opened)="panelOpenState.set(true)" (closed)="panelOpenState.set(false)">

      <!-- Panel header -->
      <mat-expansion-panel-header>

        <mat-panel-title>
          <span>{{ output().name }}</span>
          <div>-</div>
          <span>{{ output().type | enumToText: ToolInputTypeEnum }}</span>
        </mat-panel-title>

        <!-- Panel header buttons -->
        <mat-panel-description>

          <button class="button-danger small-button mr-5" (click)="outputToDelete.set(output().id)"
                  matTooltip="Delete tool input" matTooltipPosition="right">
            <i class="fa-solid fa-trash"></i>
          </button>

          <button class="button-info small-button" (click)="onButtonClick($event)"
                  matTooltip="Edit tool input" matTooltipPosition="right">
            <i class="fa-solid fa-pen"></i>
          </button>
        </mat-panel-description>

      </mat-expansion-panel-header>


      <!-- Panel body -->
      <div class="panel-body">

        <div class="panel-body-line"><span>Name:</span> {{ output().name }}</div>
        <div class="panel-body-line"><span>Type:</span> {{ output().type | enumToText: ToolInputTypeEnum }}</div>

      </div>

    </mat-expansion-panel>


    <!-- Delete modal -->
    <app-modal [isOpen]="!!outputToDelete()">
      <ng-template>

        <app-confirm-modal
          title="Delete Tool Output"
          message="Are you sure you want to delete this tool output?"
          (confirm)="handleDeleteOutput()"
          (cancel)="outputToDelete.set(null)"
        />

      </ng-template>
    </app-modal>
  `,
  styles: [`
    .mat-expansion-panel:last-of-type {
      border-bottom-right-radius: 0 !important;
      border-bottom-left-radius: 0 !important;
    }

    .mat-expansion-panel:first-of-type {
      border-top-right-radius: 0 !important;
      border-top-left-radius: 0 !important;
    }

    mat-panel-title {
      span {
        width: 150px;
      }

      div {
        width: 50px;
      }
    }

    mat-panel-description {
      justify-content: flex-end;
    }

    .panel-body-line {
      display: flex;
      flex-flow: row nowrap;

      span {
        width: 120px;
        font-weight: 550;
      }
    }
  `]
})
// Responsibility: TODO
export class ToolOutputExpansionPanelComponent {

  // --- Inputs
  output = input.required<ToolOutput>();

  // --- Outputs
  edit = output<ToolOutput>();
  delete = output<RemoveToolOutput>();

  // --- Properties
  protected readonly panelOpenState = signal(false);
  protected outputToDelete = signal<RemoveToolOutput | null>(null);

  protected handleDeleteOutput() {
    if (this.outputToDelete()) {
      this.delete.emit(this.outputToDelete()!);
      this.outputToDelete.set(null);
    }
  }

  protected onButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.edit.emit(this.output());
  }

  protected readonly ToolInputTypeEnum = ToolInputTypeEnum;
}
