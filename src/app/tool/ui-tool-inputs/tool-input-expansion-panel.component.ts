import {Component, input, output, signal} from '@angular/core';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTooltip} from "@angular/material/tooltip";
import {InputOption, ToolInput, ToolInputTypeEnum} from "../../shared/interfaces";
import {EnumToTextPipe} from "../../shared/pipes/enum-to-text.pipe";
import {getErrorMessages} from "../../shared/utils/get-error-messages";
import {MatIcon} from "@angular/material/icon";
import {MatSuffix} from "@angular/material/form-field";

@Component({
  selector: 'app-tool-input-expansion-panel',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatTooltip,
    EnumToTextPipe,
    MatIcon,
    MatSuffix
  ],
  template: `
    <mat-expansion-panel (opened)="panelOpenState.set(true)" (closed)="panelOpenState.set(false)">

      <!-- Panel header -->
      <mat-expansion-panel-header>

        <mat-panel-title><span>{{ input().label }}</span>
          <div>-</div>
          <span>{{ input().type | enumToText: ToolInputTypeEnum }}</span></mat-panel-title>

        <!-- Panel header buttons -->
        <mat-panel-description>

          @if(inputHasOptions()) {
            <mat-icon matSuffix matTooltip="Select input has no options">error</mat-icon>
          }

          <button class="button-info small-button" (click)="onButtonClick($event)"
                  matTooltip="Edit tool input" matTooltipPosition="right">
            <i class="fa-solid fa-pen"></i>
          </button>
        </mat-panel-description>

      </mat-expansion-panel-header>


      <!-- Panel body -->
      <div class="panel-body">

        <div>
          <div class="panel-body-line"><span>Name:</span> {{ input().name }}</div>
          <div class="panel-body-line"><span>Label:</span> {{ input().label }}</div>
          <div class="panel-body-line"><span>Type:</span> {{ input().type | enumToText: ToolInputTypeEnum }}</div>
          <div class="panel-body-line"><span>Placeholder:</span> {{ input().placeholder }}</div>
        </div>

        <div>
          @if (input().type == ToolInputTypeEnum.Select && filteredInputOptions(input().id); as filteredOptions) {
            @for (option of filteredOptions; track option.id) {
              {{ option }}
            } @empty {
              This select input does not have a list yet.
            }
          }
        </div>

      </div>

    </mat-expansion-panel>
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

    .panel-body {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(0, 1fr);
      gap: 1rem;
    }

    .panel-body-line {
      display: flex;
      flex-flow: row nowrap;

      span {
        width: 120px;
        font-weight: 550;
      }
    }

    mat-icon {
      color: red;
      margin-right: 1rem;
    }
  `]
})
// Responsibility: TODO
export class ToolInputExpansionPanelComponent {

  // --- Inputs
  input = input.required<ToolInput>();
  inputOptions = input.required<InputOption[]>();

  // --- Outputs
  editInput = output<ToolInput>();

  // --- Properties
  protected readonly panelOpenState = signal(false);

  protected onButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.editInput.emit(this.input());
  }

  protected filteredInputOptions(inputId: number) {
    return this.inputOptions().filter(option => option.inputId === inputId);
  }

  protected inputHasOptions(): boolean {
    return this.input().type === ToolInputTypeEnum.Select && this.filteredInputOptions(this.input().id).length === 0;
  }

  protected readonly ToolInputTypeEnum = ToolInputTypeEnum;
  protected readonly getErrorMessages = getErrorMessages;
}
