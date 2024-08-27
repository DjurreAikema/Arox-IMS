import {RemoveTool} from "./tool";

export interface ToolOutput {
  id: number;
  toolId: number;
  name: string;
  type: ToolOutputTypeEnum;
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

export enum ToolOutputTypeEnum {
  Text = 0,
}
