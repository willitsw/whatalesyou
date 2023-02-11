import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import type { RootState } from "./store";
import { createUpdateBrewSettings } from "../utils/api-calls";
import { BrewSettings } from "../types/brew-settings";

export interface BrewSettingsState {
  brewSettings: BrewSettings;
}

const initialState: BrewSettingsState = {
  brewSettings: null,
};

export const processCreateUpdateBrewSettings = createAsyncThunk(
  "brewSettings/updateBrewSettings",
  async (brewSettings: BrewSettings, { dispatch }) => {
    await createUpdateBrewSettings(brewSettings);
    dispatch(setBrewSettings(brewSettings));
  }
);

export const brewSettingsSlice = createSlice({
  name: "brew-settings",
  initialState,
  reducers: {
    setBrewSettings: (state, action: { payload: BrewSettings }) => {
      state.brewSettings = action.payload;
    },
  },
});

export const { setBrewSettings } = brewSettingsSlice.actions;

export const selectBrewSettings = (state: RootState) =>
  state.brewSettings.brewSettings;

export default brewSettingsSlice.reducer;
