import {Injectable} from '@angular/core';
import {ToolInputTypeEnum} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
// Responsibility: Turn Enum(s) into usable select options for inputs
export class SelectOptionsService {

  // Turn ToolInputTypeEnum into select options for form
  public getToolInputTypeOptions() {
    return Object.keys(ToolInputTypeEnum)
      .filter(key => isNaN(Number(key)))
      .map((key: any) => ({value: ToolInputTypeEnum[key], label: key}));
  }

  // Turn ToolOutputTypeEnum into select options for form
  // public getToolOutputTypeOptions() {
  //   return Object.keys(ToolOutputTypeEnum)
  //     .filter(key => isNaN(Number(key)))
  //     .map((key: any) => ({value: ToolOutputTypeEnum[key], label: key}));
  // }

}
