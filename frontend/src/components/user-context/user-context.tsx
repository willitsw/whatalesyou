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
  isAuthenticated: boolean;
  isLoading: boolean;
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
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const changeUser = async () => {
      setIsLoading(true);
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
      setIsLoading(false);
    };

    changeUser();
  }, [token]);

  const loginUser = useCallback(async (payload: TokenRequest) => {
    setIsLoading(true);
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
    setIsLoading(true);
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
    isAuthenticated: !!user,
    isLoading,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useCurrentUser = (): UserContextValue => {
  return useContext(UserContext);
};
