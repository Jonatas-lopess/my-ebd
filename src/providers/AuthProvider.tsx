import { createContext, useContext, useEffect, useState } from "react";
import AuthService from "@services/AuthService";
import StorageService from "@services/StorageService";

export type User = {
  name?: string;
  email: string;
  role: "admin" | "teacher";
  plan: string;
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
  onSignIn: (newUser: User) => Promise<void>;
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

  async function onSignIn(newUser: User) {
    try {
      const { data, status } = await AuthService.signIn(newUser);

      if (status !== 201) {
        throw new Error(`${status} - ${data.message}`);
      }

      setAuth({
        token: data.token,
        user: newUser,
        isLoading: false,
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
        user: data.user ?? {
          name: "",
          email: "",
          role: "admin",
          plan: "6823a5469dc1ccabbcd0659c",
        },
        isLoading: false,
      });
    } catch (error) {
      console.error(error);
    }
  }

  function onLogOut() {
    try {
      setAuth({
        token: undefined,
        user: undefined,
        isLoading: false,
      });

      return StorageService.removeItem("token");
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
