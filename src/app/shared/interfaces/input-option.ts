export interface InputOption {
  id: number;
  inputId: number;
  label: string;
  value: any;
}

export type AddInputOption = {
  item: Omit<InputOption, 'id' | 'inputId'>;
  inputId: RemoveInputOption;
};

export type EditInputOption = {
  id: InputOption['id'];
  data: AddInputOption['item'];
};

export type RemoveInputOption = InputOption['id'];
