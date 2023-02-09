import { configureStore } from "@reduxjs/toolkit";
import RecipesReducer from "./recipe-list/slice";
import UserReducer from "./user/slice";
import BrewSettingsReducer from "./brew-settings/slice";
import GlobalModalsReducer from "./global-modals/slice";
import MiscReducer from "./misc/slice";
import BrewLogReducer from "./brew-log/slice";
import { TypedUseSelectorHook, useDispatch, useSelector } from "react-redux";

export const store = configureStore({
  reducer: {
    recipes: RecipesReducer,
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
