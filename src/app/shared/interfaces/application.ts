import {RemoveCustomer} from "./customer";

export interface Application {
  id: number;
  customerId: number;
  name: string;
}

export type AddApplication = {
  item: Omit<Application, 'id' | 'customerId'>;
  customerId: RemoveCustomer;
}

export type EditApplication = {
  id: Application['id'];
  data: AddApplication['item'];
};

export type RemoveApplication = Application['id'];
