import {Injectable} from '@angular/core';
import {ToolInputTypeEnum} from '../interfaces';

@Injectable({
  providedIn: 'root'
})
// Responsibility: TODO
export class SelectOptionsService {

  // Turn ToolInputTypeEnum into select options for form
  public getToolInputTypeOptions() {
    return Object.keys(ToolInputTypeEnum)
      .filter(key => isNaN(Number(key)))
      .map((key: any) => ({value: ToolInputTypeEnum[key], label: key}));
  }

}