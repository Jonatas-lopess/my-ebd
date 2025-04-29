import { createContext, useContext, useState } from "react";
import AuthService from "@services/AuthService";
import { useQuery } from "@tanstack/react-query";
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
  loading: boolean;
  onSignIn: (newUser: User) => Promise<void>;
  onLogIn: (email: string, password: string) => Promise<void>;
  onLogOut: () => Promise<void>;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export default function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuth] = useState<AuthState>();
  const [loading, setLoading] = useState(false);

  async function onSignIn(newUser: User) {
    const response = useQuery({
      queryKey: ["signin", newUser],
      queryFn: () => {
        return AuthService.signIn(newUser);
      },
    });

    console.log("response:", response.data ?? response.error);
  }

  async function onLogIn(email: string, password: string) {
    const auth = useQuery({
      queryKey: ["login", email, password],
      queryFn: () => {
        return AuthService.logIn(email, password);
      },
    });

    console.log("auth:", auth.data ?? auth.error);

    StorageService.setItem("token", auth.data);
  }

  async function onLogOut() {
    await StorageService.removeItem("token");
    setAuth(undefined);
  }

  return (
    <AuthContext.Provider
      value={{ authState, loading, onSignIn, onLogIn, onLogOut }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
