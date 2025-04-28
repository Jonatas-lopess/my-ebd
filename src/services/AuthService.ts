import { User } from "../providers/AuthProvider";
import config from "config";

export default class AuthService {
  static async signIn(newUser: User) {
    const response = await fetch(`${config.apiBaseUrl}/auth/signup`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(newUser),
    });

    if (!response.ok) {
      return Promise.reject(response.statusText);
    }

    return await response.json();
  }

  static async logIn(email: string, password: string) {
    const response = await fetch(`${config.apiBaseUrl}/auth/login`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password,
      }),
    });

    if (!response.ok) {
      return Promise.reject(response.statusText);
    }

    return await response.json();
  }
}
