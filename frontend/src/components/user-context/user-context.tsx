import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { message } from "antd";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../../constants";
import { TokenPayload, TokenRequest, UserResponse } from "../../types/user";
import jwt from "jwt-decode";
import { getCurrentUser, getToken } from "../../utils/api-calls";
import { useQueryClient } from "@tanstack/react-query";

export interface UserContextValue {
  user: UserResponse;
  token: string;
  loginUser: (payload: TokenRequest) => Promise<void>;
  logoutUser: () => void;
  refreshUser: () => Promise<void>;
  isAuthenticated: boolean;
}

const UserContext = createContext(null);

interface UserContextProps {
  children: React.ReactNode;
}

export const UserContextProvider = ({ children }: UserContextProps) => {
  const queryClient = useQueryClient();
  const [token, setToken] = useState<string>(
    localStorage.getItem(ACCESS_TOKEN_KEY)
  );
  const [user, setUser] = useState<UserResponse>();

  useEffect(() => {
    const changeUser = async () => {
      let userId = "";
      if (token) {
        userId = (jwt(token) as TokenPayload).user_id;
        const newUser = await getCurrentUser(userId);
        if (newUser) {
          message.success(`Successfully logged in as ${newUser?.email}!`);
          setUser(newUser);
        }
      } else {
        setUser(null);
      }
    };

    changeUser();
  }, [token]);

  const refreshUser = async () => {
    let userId = "";
    if (token) {
      userId = (jwt(token) as TokenPayload).user_id;
      const newUser = await getCurrentUser(userId);
      if (newUser) {
        setUser(newUser);
      }
    } else {
      setUser(null);
    }
  };

  const loginUser = useCallback(async (payload: TokenRequest) => {
    const response = await getToken(payload);
    if (!response.ok) {
      const body = await response.json();
      message.error(
        body.detail ?? "An error occurred loging in the user. Please try again."
      );
    } else {
      const body = await response.json();
      localStorage.setItem(ACCESS_TOKEN_KEY, body.access);
      localStorage.setItem(REFRESH_TOKEN_KEY, body.refresh);
      setToken(body.access);
    }
  }, []);

  const logoutUser = useCallback(() => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    message.success("Successfully logged out.");
    queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    setToken("");
  }, []);

  const value: UserContextValue = {
    user,
    token,
    loginUser,
    logoutUser,
    refreshUser,
    isAuthenticated: !!user,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useCurrentUser = (): UserContextValue => {
  return useContext(UserContext);
};
