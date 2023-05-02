import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { UserRequest, TokenPayload, TokenRequest, User } from "../types/user";
import {
  createUser,
  getCurrentUser,
  getToken,
  updateUser,
} from "../utils/api-calls";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants";
import jwt from "jwt-decode";
import { setBrewSettings } from "./brew-settings";
import { message } from "antd";

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
    if (token) {
      const { user_id } = jwt(token) as TokenPayload;
      const userResponse = await getCurrentUser(user_id);
      message.success(`Successfully logged in as ${userResponse.email}!`);

      const { settings, ...user } = userResponse;

      dispatch(setUser(user));
      dispatch(setBrewSettings(settings));
    } else {
      message.error("We were unable to load the user. Please try again.");
      console.error("User not loaded!");
    }
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
  async (payload: UserRequest, { dispatch }) => {
    await createUser(payload);
    dispatch(loginUser(payload));
  }
);

export const updateExistingUser = createAsyncThunk(
  "users/create",
  async (payload: User, { dispatch }) => {
    const updatedUser = await updateUser(payload);
    dispatch(setUser(updatedUser));
    message.success(`User ${updatedUser.email} has been updated.`);
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
    message.success("Successfully logged out.");
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
export const selectUserName = (state: RootState) => {
  let name = "";
  if (state.user.currentUser.first_name) {
    name += state.user.currentUser.first_name;
  }
  if (state.user.currentUser.last_name) {
    if (name) {
      name += " ";
    }
    name += state.user.currentUser.last_name;
  }
  if (!name) {
    name = state.user.currentUser.email;
  }
  return name;
};

export default userSlice.reducer;
