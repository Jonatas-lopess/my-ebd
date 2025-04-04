export type ClassesType = {
  id: number;
  name: string;
  description?: string;
};

export type TeacherCallType = {
  id: number;
  name: string;
  isPresent: boolean;
};

export type TeacherInfoType = {
  bibles: number;
  books: number;
  offer: number;
};
