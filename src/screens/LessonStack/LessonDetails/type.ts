export type ClassesType = {
  id: number;
  name: string;
  description?: string;
};

export type ListItemType = {
  id: string;
  name: string;
  lesson: string;
  isPresent: boolean;
  report?: { [key: string]: { id: string; value: number | boolean } };
};
