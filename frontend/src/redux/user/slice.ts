import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";
import { TokenRequest, User } from "../../types/user";
import { getCurrentUser, getToken } from "../../utils/api-calls";
import { ACCESS_TOKEN_KEY } from "../../constants";
import jwt from "jwt-decode";
import { setBrewSettings } from "../brew-settings/slice";

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
    const { user_id } = jwt(token) as any;
    const currentUser = await getCurrentUser(user_id);
    dispatch(
      setUser({
        bio: currentUser.bio,
        id: currentUser.id,
        username: currentUser.user.username,
      })
    );
    dispatch(
      setBrewSettings({
        batchSize: currentUser.batch_size,
        boilOffWaterLossRate: currentUser.water_loss_per_boil_unit,
        boilTime: currentUser.boil_time,
        brewhouseEfficiency: currentUser.brewhouse_efficiency,
        fermentorTrubWaterLoss: currentUser.water_loss_fermentor_trub,
        kettleTrubWaterLoss: currentUser.water_loss_kettle_trub,
        mashThickness: currentUser.mash_thickness_target,
        measurementType: currentUser.measurement_type,
        sparge: currentUser.do_sparge,
        waterLossPerGrain: currentUser.water_loss_per_grain_unit,
      })
    );
  }
);

export const loginUser = createAsyncThunk(
  "users/login",
  async (payload: TokenRequest, { dispatch }) => {
    const tokenPayload = await getToken(payload);
    localStorage.setItem(ACCESS_TOKEN_KEY, tokenPayload.access);
    dispatch(loadUserData());
  }
);

export const logoutUser = createAsyncThunk(
  "users/logout",
  async (_, { dispatch }) => {
    localStorage.removeItem(ACCESS_TOKEN_KEY);
    dispatch(clearUser);
    dispatch(setIsAuthenticated(false));
    dispatch(setBrewSettings(null));
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
