import { configureStore } from "@reduxjs/toolkit";
import GlobalModalsReducer from "./global-modals";
import MiscReducer from "./misc";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    globalModals: GlobalModalsReducer,
    misc: MiscReducer,
  },
});

export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
