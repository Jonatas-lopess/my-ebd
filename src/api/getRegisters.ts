import { RegisterFromApi } from "@screens/RegisterStack/RegisterScreen/type";
import config from "config";

type GetRegistersParams = {
  hasUser?: boolean;
  _class?: string;
  token: string | undefined;
}

export default async ({ hasUser, _class, token }: GetRegistersParams): Promise<RegisterFromApi[]> => {
  let url = config.apiBaseUrl + "/registers" + (hasUser !== undefined ? "?hasUser=" + hasUser : "");
  if (hasUser === undefined && _class) url = url.concat("?class=", _class);
  if (hasUser !== undefined && _class) url = url.concat("&class=", _class);

  const res = await fetch(url, {
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