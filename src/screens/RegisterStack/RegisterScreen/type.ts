import { Never } from "@custom/types/utility_types";

type DefaultRegister = {
  name: string;
  flag: string;
  class: {
    id: string;
    name: string;
    group?: string;
  };
  aniversary?: string;
  phone?: string;
};

type RegisterFromAppExtraInfo = {
  isTeacher: boolean;
};

type RegisterFromApiExtraInfo = {
  _id: string;
  user?: string;
  rollcalls?: { id: string; isPresent: boolean }[];
};

export type RegisterFromApp = DefaultRegister &
  RegisterFromAppExtraInfo &
  Never<RegisterFromApiExtraInfo>;

export type RegisterFromApi = DefaultRegister &
  RegisterFromApiExtraInfo &
  Never<RegisterFromAppExtraInfo>;

type Register = RegisterFromApp | RegisterFromApi;

export default Register;
