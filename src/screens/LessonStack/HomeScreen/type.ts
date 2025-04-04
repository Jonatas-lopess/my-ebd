export type Lesson = {
  id: string;
  title: string;
  date: string;
  total: number;
  presents?: number;
};

export type NewLesson = {
  lesson?: number;
  date: Date;
};
