export interface Tool {
  id: number;
  name: string;
}

export type AddTool = Omit<Tool, 'id'>;
export type EditTool = { id: Tool['id']; data: AddTool };
export type RemoveTool = Tool['id'];
