import { createContext, useContext, useEffect, useState } from "react";
import AuthService, { SignInData } from "@services/AuthService";
import StorageService from "@services/StorageService";
import { Alert } from "react-native";

export type User = {
  _id: string;
  name?: string;
  email: string;
  role: "admin" | "teacher" | "owner";
  plan: string;
  recoveryToken: string;
  register?: {
    _id: string;
    name: string;
    class: string;
    phone: string;
    anniversary: string;
  };
};

export type AuthState = {
  user?: User;
  token?: string;
  isLoading: boolean;
};

type AuthContextProps = {
  authState: AuthState;
  onSignIn: (newUser: SignInData) => Promise<void>;
  onLogIn: (email: string, password: string) => Promise<void>;
  onLogOut: () => void;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextProps>({} as AuthContextProps);

export default function AuthProvider({ children }: AuthProviderProps) {
  const [authState, setAuth] = useState<AuthState>({
    user: undefined,
    token: undefined,
    isLoading: true,
  });

  useEffect(() => {
    async function fetchUser() {
      const token = await StorageService.getItem("token");

      if (token === null) {
        setAuth({
          user: undefined,
          token: undefined,
          isLoading: false,
        });

        return console.log("Exception: No token found when fetching user.");
      }

      const { data, status } = await AuthService.getUser(token);

      if (status !== 200) {
        setAuth({
          user: undefined,
          token: undefined,
          isLoading: false,
        });
        StorageService.removeItem("token");

        throw new Error(`${status} - ${data.message}`, { cause: data.error });
      }

      return setAuth({
        token: token,
        user: data.user,
        isLoading: false,
      });
    }

    fetchUser().catch((error) => {
      console.log("Error fetching user:", error, error.cause);
    });
  }, []);

  async function onSignIn(newUser: SignInData) {
    try {
      const { data, status } = await AuthService.signIn(newUser);

      if (status !== 201) {
        throw new Error(`${status} - ${data.message}`);
      }

      setAuth({
        token: data.token,
        user: data.user,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
      return Alert.alert("Erro", "Não foi possivel concluir cadastro. Tente novamente mais tarde.");
    }
  }

  async function onLogIn(email: string, password: string) {
    try {
      const { data, status } = await AuthService.logIn(email, password);

      if (status === 422) return Alert.alert("Erro", "Email ou senha incorretos.");

      if (status !== 200) {
        throw new Error(`${status} - ${data.message}`, { cause: data.error });
      }

      StorageService.setItem("token", data.token);
      setAuth({
        token: data.token,
        user: data.user,
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
    }
  }

  function onLogOut() {
    try {
      StorageService.removeItem("token");

      setAuth({
        token: undefined,
        user: undefined,
        isLoading: false,
      });
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
