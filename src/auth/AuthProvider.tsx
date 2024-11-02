import React, { useCallback, useEffect, useState } from "react";
import PropTypes from "prop-types";
import { getLogger } from "../core";
import { login as loginApi, signup as signupApi } from "./authApi";
import { Preferences } from "@capacitor/preferences";

const log = getLogger("AuthProvider");

type LoginFn = (username?: string, password?: string) => void;
type LogoutFn = () => void;

export interface AuthState {
  authenticationError: Error | null;
  isAuthenticated: boolean;
  isAuthenticating: boolean;
  isLogin: boolean;
  isSignup: boolean;
  login?: LoginFn;
  signup?: LoginFn;
  logout?: LogoutFn;
  pendingAuthentication?: boolean;
  username?: string;
  password?: string;
  token: string;
}

const initialState: AuthState = {
  isAuthenticated: false,
  isAuthenticating: false,
  authenticationError: null,
  pendingAuthentication: false,
  isLogin: false,
  isSignup: false,
  token: "",
};

export const AuthContext = React.createContext<AuthState>(initialState);

interface AuthProviderProps {
  children: PropTypes.ReactNodeLike;
}

const savedToken = await Preferences.get({ key: "token" });

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [state, setState] = useState<AuthState>(initialState);

  const {
    isAuthenticated,
    isAuthenticating,
    isSignup,
    isLogin,
    authenticationError,
    pendingAuthentication,
    token,
  } = state;

  const login = useCallback<LoginFn>(loginCallback, []);
  const signup = useCallback<LoginFn>(signupCallback, []);
  const logout = useCallback<LogoutFn>(logoutCallback, []);
  useEffect(authenticationEffect, [pendingAuthentication]);

  let isAuthed = isAuthenticated;
  let currToken = token;

  if (savedToken !== undefined && savedToken.value !== null) {
    isAuthed = true;
    currToken = savedToken.value;
  }

  const value = {
    isAuthenticated: isAuthed,
    login,
    signup,
    logout,
    isLogin,
    isSignup,
    isAuthenticating,
    authenticationError,
    token: currToken,
  };
  log("render");
  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;

  function loginCallback(username?: string, password?: string): void {
    log("login");
    setState({
      ...state,
      pendingAuthentication: true,
      isLogin: true,
      username,
      password,
    });
  }

  function signupCallback(username?: string, password?: string): void {
    log("signup");
    setState({
      ...state,
      pendingAuthentication: true,
      isSignup: true,
      username,
      password,
    });
  }

  function logoutCallback() {
    setState({
      ...state,
      isAuthenticated: false,
    });
  }

  function authenticationEffect() {
    let canceled = false;
    authenticate();
    return () => {
      canceled = true;
    };

    async function authenticate() {
      if (!pendingAuthentication) {
        log("authenticate, !pendingAuthentication, return");
        return;
      }
      try {
        log("authenticate...");
        setState({
          ...state,
          isAuthenticating: true,
        });
        const { username, password } = state;

        let receivedToken = "";
        if (isLogin) {
          const response = await loginApi(username, password);
          receivedToken = response?.token;
        } else if (isSignup) {
          const response = await signupApi(username, password);
          receivedToken = response?.token;
        }

        if (canceled) {
          return;
        }

        log("authenticate succeeded");

        setState({
          ...state,
          token: receivedToken,
          pendingAuthentication: false,
          isAuthenticated: true,
          isAuthenticating: false,
        });

        await Preferences.set({
          key: "token",
          value: receivedToken,
        });
      } catch (error) {
        if (canceled) {
          return;
        }
        log("authenticate failed");
        setState({
          ...state,
          authenticationError: error as Error,
          pendingAuthentication: false,
          isAuthenticating: false,
        });
      }
    }
  }
};
