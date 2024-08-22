export interface Application {
  id: number;
  name: string;
}

export type AddApplication = Omit<Application, 'id'>;
export type EditApplication = { id: Application['id']; data: AddApplication };
export type RemoveApplication = Application['id'];
