import { AuthState, User } from "../providers/AuthProvider";

async function signIn(newUser: User): Promise<AuthState> {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        user: newUser,
        token: "token",
      });
    }, 1000);
  });
}

async function logIn(email: string, password: string): Promise<AuthState> {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (email === "user1") {
        resolve({
          user: {
            name: "John Doe",
            email: "john.doe@example.com",
            role: "admin",
          },
          token: "token",
        });
      }

      if (email === "user2") {
        resolve({
          user: {
            name: "Brad Pitt",
            email: "brad.pit@example.com",
            role: "teacher",
          },
          token: "token",
        });
      }

      reject(new Error("Invalid email or password"));
    }, 1000);
  });
}

export const AuthService = {
  signIn,
  logIn,
};
