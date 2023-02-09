import { createSlice } from "@reduxjs/toolkit";
import type { RootState } from "../store";

export interface GlobalModalsState {
  showLoginModal: boolean;
  pageIsClean: boolean;
}

const initialState: GlobalModalsState = {
  showLoginModal: false,
  pageIsClean: true,
};

export const globalModalsSlice = createSlice({
  name: "globalModals",
  initialState,
  reducers: {
    setShowLoginModal: (state, action: { payload: boolean }) => {
      state.showLoginModal = action.payload;
      return state;
    },
    setPageIsClean: (state, action: { payload: boolean }) => {
      state.pageIsClean = action.payload;
      return state;
    },
  },
});

export const { setShowLoginModal, setPageIsClean } = globalModalsSlice.actions;

export const selectShowLoginModal = (state: RootState) =>
  state.globalModals.showLoginModal;
export const selectPageIsClean = (state: RootState) =>
  state.globalModals.pageIsClean;

export default globalModalsSlice.reducer;
