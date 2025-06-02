export type Lesson = {
  _id?: string;
  title?: string;
  flag: string;
  number: number | undefined;
  date: string;
  rollcalls?: {
    classId: string;
    isDone: boolean;
  }[];
};
