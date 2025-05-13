import { createContext, useContext, useState } from "react";
import AuthService from "@services/AuthService";
import StorageService from "@services/StorageService";

export type User = {
  name: string;
  email: string;
  role: "admin" | "teacher";
};

export type AuthState = {
  user: User;
  token: string;
};

type AuthContextProps = {
  authState?: AuthState;
  onSignIn: (newUser: User) => Promise<void>;
  onLogIn: (email: string, password: string) => Promise<void>;
  onLogOut: () => void;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export default function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuth] = useState<AuthState>();

  async function onSignIn(newUser: User) {
    try {
      const { data, status } = await AuthService.signIn(newUser);

      if (status !== 201) {
        throw new Error(`${status} - ${data.message}`);
      }

      setAuth({
        token: "",
        user: newUser,
      });
    } catch (error) {
      console.error(error);
    }
  }

  async function onLogIn(email: string, password: string) {
    try {
      const { data, status } = await AuthService.logIn(email, password);

      if (status !== 200) {
        throw new Error(`${status} - ${data.message}`, { cause: data.error });
      }

      StorageService.setItem("token", data.token);
      setAuth({
        token: data.token,
        user: { name: "John Doe", email, role: "admin" },
      });
    } catch (error) {
      console.error(error);
    }
  }

  function onLogOut() {
    try {
      StorageService.removeItem("token").catch((error) => {
        throw new Error("Error removing token from storage: " + error);
      });
      setAuth(undefined);
    } catch (error) {
      console.error(error, (error as Error).cause);
    }
  }

  return (
    <AuthContext.Provider value={{ authState, onSignIn, onLogIn, onLogOut }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
