export type Rollcall = {
  _id: string;
  register: {
    id: string;
    name: string;
    class: string;
  };
  lesson: {
    id: string;
    number: number;
    date: Date;
  };
  isPresent: boolean;
  score?: {
    kind: string;
    value: number | boolean;
    scoreInfo: string;
  }[];
};
