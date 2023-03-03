import { configureStore } from "@reduxjs/toolkit";
import UserReducer from "./user";
import BrewSettingsReducer from "./brew-settings";
import GlobalModalsReducer from "./global-modals";
import MiscReducer from "./misc";
import BrewLogReducer from "./brew-log";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    user: UserReducer,
    brewSettings: BrewSettingsReducer,
    globalModals: GlobalModalsReducer,
    misc: MiscReducer,
    brewLogs: BrewLogReducer,
  },
});

export type Store = typeof store;
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
