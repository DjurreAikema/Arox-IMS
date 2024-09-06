import {Component, input, output, signal} from '@angular/core';
import {MatExpansionModule} from "@angular/material/expansion";
import {MatTooltip} from "@angular/material/tooltip";
import {ToolInput, ToolInputTypeEnum} from "../../shared/interfaces";
import {EnumToTextPipe} from "../../shared/pipes/enum-to-text.pipe";

@Component({
  selector: 'app-tool-input-expansion-panel',
  standalone: true,
  imports: [
    MatExpansionModule,
    MatTooltip,
    EnumToTextPipe
  ],
  template: `
    <mat-expansion-panel (opened)="panelOpenState.set(true)" (closed)="panelOpenState.set(false)">

      <!-- Panel header -->
      <mat-expansion-panel-header>

        <mat-panel-title><span>{{ input().label }}</span> <div>-</div> <span>{{ input().type | enumToText: ToolInputTypeEnum }}</span></mat-panel-title>

        <!-- Panel header buttons -->
        <mat-panel-description>
          <button class="button-info small-button" (click)="onButtonClick($event)"
                  matTooltip="Edit tool input" matTooltipPosition="right">
            <i class="fa-solid fa-pen"></i>
          </button>
        </mat-panel-description>

      </mat-expansion-panel-header>


      <!-- Panel body -->
      <p>Name: {{ input().name }}</p>
      <p>Label: {{ input().label }}</p>
      <p>Type: {{ input().type | enumToText: ToolInputTypeEnum }}</p>
      <p>Placeholder: {{ input().placeholder }}</p>

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
  `]
})
export class ToolInputExpansionPanelComponent {

  // --- Inputs
  input = input.required<ToolInput>();

  // --- Outputs
  editInput = output<ToolInput>();

  // --- Properties
  protected readonly panelOpenState = signal(false);

  protected onButtonClick(event: MouseEvent) {
    event.stopPropagation();
    this.editInput.emit(this.input());
  }

  protected readonly ToolInputTypeEnum = ToolInputTypeEnum;
}
