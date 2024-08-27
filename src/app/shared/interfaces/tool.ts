import {RemoveApplication} from "./application";

export interface Tool {
  id: number;
  applicationId: number;
  name: string;
  apiUrl: string;
}

export type AddTool = {
  item: Omit<Tool, 'id' | 'applicationId'>;
  applicationId: RemoveApplication;
}

export type EditTool = {
  id: Tool['id'];
  data: AddTool['item'];
};

export type RemoveTool = Tool['id'];
