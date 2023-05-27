import { createContext } from "react";

interface LoginContextInterface {
  loginStatus: boolean | null;
  setLoginStatus: (newValue: boolean) => void;
}

export const LoginContext = createContext<LoginContextInterface>({
  loginStatus: false,
  setLoginStatus: () => undefined,
});
