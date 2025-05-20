export type Register = {
  _id: string | undefined;
  name: string;
  class: { id: string; name: string } | undefined;
  isProfessor: boolean;
  anniversary?: Date;
  phone?: string;
};
