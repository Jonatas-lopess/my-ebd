export type ClassesType = {
  id: number;
  name: string;
  description?: string;
};

export type ListItemType = {
  id: number;
  name: string;
  isPresent: boolean;
  report?: InfoType;
};

export type InfoType = {
  bibles: boolean;
  books: boolean;
  offer: number;
};
