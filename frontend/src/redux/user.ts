import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import {
  CreateUserRequest,
  TokenPayload,
  TokenRequest,
  User,
} from "../types/user";
import { createUser, getCurrentUser, getToken } from "../utils/api-calls";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants";
import jwt from "jwt-decode";
import { setBrewSettings } from "./brew-settings";

export interface UserState {
  currentUser: User;
  isAuthenticated: boolean;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: !!localStorage.getItem(ACCESS_TOKEN_KEY),
};

export const loadUserData = createAsyncThunk(
  "users/loadUserData",
  async (_, { dispatch }) => {
    const token = localStorage.getItem(ACCESS_TOKEN_KEY);
    const { user_id } = jwt(token) as TokenPayload;
    const userResponse = await getCurrentUser(user_id);

    const { settings, ...user } = userResponse;

    dispatch(setUser(user));
    dispatch(setBrewSettings(settings));
  }
);

export const loginUser = createAsyncThunk(
  "users/login",
  async (payload: TokenRequest, { dispatch }) => {
    await getToken(payload);
    dispatch(setIsAuthenticated(!!localStorage.getItem(ACCESS_TOKEN_KEY)));
    dispatch(loadUserData());
  }
);

export const createNewUser = createAsyncThunk(
  "users/create",
  async (payload: CreateUserRequest, { dispatch }) => {
    await createUser(payload);
    dispatch(loginUser(payload));
  }
);

export const logoutUser = createAsyncThunk(
  "users/logout",
  async (_, { dispatch }) => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    localStorage.removeItem(REFRESH_TOKEN_KEY);
    dispatch(clearUser);
    dispatch(setIsAuthenticated(false));
    dispatch(setBrewSettings(null));
    console.log("logged out");
  }
);

export const userSlice = createSlice({
  name: "users",
  initialState,
  reducers: {
    setUser: (state, action: { payload: User }) => {
      state.currentUser = action.payload;
      state.isAuthenticated = !!action.payload;
      return state;
    },
    clearUser: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      return state;
    },
    setIsAuthenticated: (state, action: { payload: boolean }) => {
      state.isAuthenticated = action.payload;
      return state;
    },
  },
});

export const { setUser, clearUser, setIsAuthenticated } = userSlice.actions;

export const selectCurrentUser = (state: RootState) => state.user.currentUser;
export const userIsAuthenticated = (state: RootState) =>
  state.user.isAuthenticated;

export default userSlice.reducer;
