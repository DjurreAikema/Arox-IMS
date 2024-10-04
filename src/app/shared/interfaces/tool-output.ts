import {RemoveTool} from "./tool";
import {ToolInputTypeEnum} from "./tool-input";

export interface ToolOutput {
  id: number;
  toolId: number;
  name: string;
  fieldTypeId: ToolInputTypeEnum;
  value: any;
}

export type AddToolOutput = {
  item: Omit<ToolOutput, 'id' | 'toolId' | 'value'>;
  toolId: RemoveTool;
}

export type EditToolOutput = {
  id: ToolOutput['id'];
  data: AddToolOutput['item'];
};

export type RemoveToolOutput = ToolOutput['id'];
