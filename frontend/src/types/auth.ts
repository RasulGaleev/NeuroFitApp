import { UserType } from "./user.ts";

export interface AuthContextType {
  user: UserType | null;
  setUser: (user: UserType | null) => void;
  isAuthenticated: boolean;
  login: (username: string, password: string) => Promise<UserType>;
  register: (username: string, email: string, password: string, password2: string) => Promise<void>;
  logout: () => void;
}