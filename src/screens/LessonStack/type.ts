export type Rollcall = {
  _id: string;
  register: string;
  date: Date;
  number: number;
  isPresent: boolean;
  score?: {
    kind: string;
    value: number | boolean;
    scoreInfo: string;
  }[];
};
