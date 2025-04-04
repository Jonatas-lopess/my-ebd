export type Lesson = {
  id: string;
  title: string;
  date: string;
  reports: {
    pending: number;
    presents?: number;
  };
  total: number;
};

export type NewLesson = {
  lesson?: number;
  date: Date;
};
