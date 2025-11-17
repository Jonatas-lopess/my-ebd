export type Rollcall = {
  _id: string;
  register: {
    id: string;
    name: string;
    class: string;
    isTeacher: boolean;
  };
  lesson: {
    id: string;
    number: number;
    date: Date;
  };
  isPresent: boolean;
  score?: {
    kind: "BooleanScore" | "NumberScore";
    value: number | boolean;
    scoreInfo: string;
  }[];
};
