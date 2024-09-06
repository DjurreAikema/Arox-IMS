import {RemoveTool} from "./tool";

export interface ToolInput {
  id: number;
  toolId: number;
  name: string;
  label: string;
  placeholder: string;
  type: ToolInputTypeEnum;
}

export type AddToolInput = {
  item: Omit<ToolInput, 'id' | 'toolId'>;
  toolId: RemoveTool;
};

export type EditToolInput = {
  id: ToolInput['id'];
  data: AddToolInput['item'];
};

export type RemoveToolInput = ToolInput['id'];

export enum ToolInputTypeEnum {
  Text = 0,
  Number = 1,
  Select = 2,
}
