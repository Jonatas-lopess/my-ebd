export type Rollcall = {
  _id: string;
  register: {
    id: string;
    name: string;
    class: string;
  };
  isPresent: boolean;
  score?: {
    kind: string;
    value: number | boolean;
    scoreInfo: string;
  }[];
};
