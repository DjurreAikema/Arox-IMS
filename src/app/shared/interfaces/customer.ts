export interface Customer {
  id: number;
  name: string;
}

export type AddCustomer = Omit<Customer, 'id'>;
export type EditCustomer = { id: Customer['id']; data: AddCustomer };
export type RemoveCustomer = Customer['id'];
