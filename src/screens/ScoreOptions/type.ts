export type Score = {
  _id?: string;
  title: string;
  type: "BooleanScore" | "NumberScore";
  flag: string;
  weight: number;
};
