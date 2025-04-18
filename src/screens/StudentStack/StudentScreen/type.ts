export type Register = {
  id: string | undefined;
  name: string;
  class: string | undefined;
  isProfessor: boolean;
  birthday?: Date;
  phoneNumber?: string;
};
