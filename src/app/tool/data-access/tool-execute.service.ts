import {Injectable} from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ToolExecuteService {

  constructor() {
  }

  public postToApi(formData: any, apiUrl: string) {
    console.log(formData);
    console.log(apiUrl);
  }

}
