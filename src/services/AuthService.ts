import config from "config";

type ApiResponse = {
  status: number;
  data: any;
};

export type SignInData = {
  email: string;
  password: string;
  name: string;
  code: string;
};

export default class AuthService {
  static async signIn(newUser: SignInData): Promise<ApiResponse> {
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

  static async getUser(token: string): Promise<ApiResponse> {
    return fetch(`${config.apiBaseUrl}/user`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      return {
        status: response.status,
        data: await response.json(),
      };
    });
  }

  static async deleteAccount(token: string): Promise<ApiResponse> {
    return fetch(`${config.apiBaseUrl}/user`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    }).then(async (response) => {
      return {
        status: response.status,
        data: await response.json(),
      };
    });
  }
}
