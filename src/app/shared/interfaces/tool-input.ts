import {RemoveTool} from "./tool";

export interface ToolInput {
  id: number;
  toolId: number;
  name: string;
  label: string;
  placeholder: string;
  fieldTypeId: ToolInputTypeEnum;
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
  Text = 1,
  Number = 2,
  Select = 3,
}
