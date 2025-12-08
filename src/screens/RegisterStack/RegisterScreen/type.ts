import { Never } from "@custom/types/utility_types";
import { User } from "@providers/AuthProvider";
import config from "config";

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

type GetRegistersParams = {
  token: string | undefined;
  user: User | undefined;
  hasUser?: boolean | undefined;
};

export async function getRegisters({
  token,
  user,
  hasUser,
}: GetRegistersParams): Promise<RegisterFromApi[]> {
  if (user === undefined) throw new Error("User is undefined");

  if (user.role === "teacher") {
    const res = await fetch(
      config.apiBaseUrl +
        `/registers?class=${user.register!.class}${
          hasUser !== undefined ? "&hasUser=" + hasUser : ""
        }`,
      {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      }
    );

    const resJson = await res.json();
    if (!res.ok) throw new Error(resJson.message, { cause: resJson.error });

    return resJson;
  }

  const res = await fetch(config.apiBaseUrl + "/registers", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });

  const resJson = await res.json();
  if (!res.ok) throw new Error(resJson.message, { cause: resJson.error });

  return resJson;
}

export type RegisterFromApp = DefaultRegister &
  RegisterFromAppExtraInfo &
  Never<RegisterFromApiExtraInfo>;

export type RegisterFromApi = DefaultRegister &
  RegisterFromApiExtraInfo &
  Never<RegisterFromAppExtraInfo>;

type Register = RegisterFromApp | RegisterFromApi;

export default Register;
