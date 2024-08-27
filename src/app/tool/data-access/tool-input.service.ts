import {inject, Injectable} from '@angular/core';
import {ToolInput} from "../../shared/interfaces";
import {StorageService} from "../../shared/data-access/storage.service";

// State interface
export interface ToolInputState {
  toolInputs: ToolInput[];
  loaded: boolean;
  error: string | null;
}

@Injectable({
  providedIn: 'root'
})
export class ToolInputService {

  private storageService: StorageService = inject(StorageService);

  constructor() {
  }
}
