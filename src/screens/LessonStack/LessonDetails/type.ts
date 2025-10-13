export type ClassesType = {
  id: number;
  name: string;
  description?: string;
};

export type ListItemType = {
  id: string;
  name: string;
  class: string;
  isPresent: boolean;
  report?: Array<{ id: string; value: number | boolean }>;
};
