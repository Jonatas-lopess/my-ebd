import { createContext, useContext, useState } from "react";
import { AuthService } from "@services/AuthService";
import { Alert } from "react-native";

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
  onSignIn: (newUser: User) => Promise<AuthState>;
  onLogIn: (email: string, password: string) => void;
  onLogOut: () => Promise<void>;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export default function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuth] = useState<AuthState>();
  const [loading, setLoading] = useState(false);

  async function onSignIn(newUser: User): Promise<AuthState> {
    const response = await AuthService.signIn(newUser);
    setAuth(response);

    return response;
  }

  async function onLogIn(email: string, password: string) {
    try {
      const auth = await AuthService.logIn(email, password);
      setAuth(auth);
    } catch (error) {
      Alert.alert("Error", (error as Error).message);
    }
  }

  async function onLogOut(): Promise<void> {
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
