import { createContext, useCallback, useContext, useState } from "react";

type UserRoleTypes = "admin" | "teacher";

type User =
  | {
      name: string;
      role: UserRoleTypes;
    }
  | undefined;

type AuthContextType = {
  user: User;
  setSessionUser: (user: User) => void;
};

type AuthProviderProps = {
  children: React.ReactNode;
};

const AuthContext = createContext<AuthContextType>({
  user: undefined,
  setSessionUser: () => {},
});

export default function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User>();

  const handleSessionRegister = useCallback((newUser: User) => {
    setUser(newUser);
  }, []);

  return (
    <AuthContext.Provider
      value={{ user, setSessionUser: handleSessionRegister }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
