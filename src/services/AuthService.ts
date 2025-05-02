import { User } from "../providers/AuthProvider";
import config from "config";

type ApiResponse = {
  status: number;
  data: any;
};

export default class AuthService {
  static async signIn(newUser: User): Promise<ApiResponse> {
    return fetch(`${config.apiBaseUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    }).then(async (response) => {
      return {
        status: response.status,
        data: await response.json(),
      };
    });
  }

  static async logIn(email: string, password: string): Promise<ApiResponse> {
    if (!email || !password) {
      throw new Error("Email and password are required.");
    }

    return fetch(`${config.apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    }).then(async (response) => {
      return {
        status: response.status,
        data: await response.json(),
      };
    });
  }
}
