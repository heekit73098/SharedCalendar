import { Dispatch, SetStateAction, createContext, useContext, useState } from "react";
import * as SecureStorage from "expo-secure-store"

type AuthState = 'LOGGED_IN' | 'LOGGED_OUT' | 'EXPIRED';

export interface AuthStateInterface {
    state: AuthState;
    token: string;
}

const AuthStateContext = createContext({
    state: {} as Partial<AuthStateInterface>,
    setState: {} as Dispatch<SetStateAction<Partial<AuthStateInterface>>>,
});

const AuthStateProvider = ({
    children,
    value = {} as AuthStateInterface,
  }: {
    children: React.ReactNode;
    value?: Partial<AuthStateInterface>;
  }) => {
    const [state, setState] = useState(value);
    return (
        <AuthStateContext.Provider value={{ state, setState }}>
        {children}
      </AuthStateContext.Provider>
    );
  };

  const useAuthState = () => {
    const context = useContext(AuthStateContext);
    if (!context) {
      throw new Error("useAuthState must be used within an AuthStateContext");
    }
    return context;
  };

  export { AuthStateProvider, useAuthState };