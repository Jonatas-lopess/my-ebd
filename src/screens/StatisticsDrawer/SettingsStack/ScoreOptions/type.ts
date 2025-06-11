export type Score = {
  title: string;
  type: "BooleanScore" | "NumberScore";
  flag: string;
  weight: number;
};
