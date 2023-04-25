import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { BrewLog, BrewLogListResponse } from "../types/brew-log";
import {
  createUpdateBrewLog,
  deleteBrewLog,
  getBrewLogsByUser,
} from "../utils/api-calls";
import { deepCloneObject } from "../utils/helpers";
import type { RootState } from "./store";

export interface BrewLogState {
  brewLogList: BrewLog[];
  currentBrewLog: BrewLog;
  brewLogCount: number;
  nextPage: string;
  prevPage: string;
}

const initialState: BrewLogState = {
  brewLogList: [],
  currentBrewLog: null,
  brewLogCount: 0,
  nextPage: null,
  prevPage: null,
};

export enum BrewLogActionTypes {
  SetBrewLogList = "brew-log/setBrewLogList",
  SetCurrentBrewLog = "brew-log/setCurrentBrewLog",
}

export const refreshBrewLogList = createAsyncThunk(
  "brew-log/refreshBrewLogList",
  async (_, { dispatch }) => {
    const brewLogResponse = await getBrewLogsByUser();
    dispatch(setBrewLogListResponse(brewLogResponse));
  }
);

export const processDeleteBrewLog = createAsyncThunk(
  "brew-log/deleteBrewLog",
  async (brewLogId: string, { getState, dispatch }) => {
    await deleteBrewLog(brewLogId);
    const state = getState() as RootState;
    const newBrewLogs = state.brewLogs.brewLogList.filter(
      (brewLog) => brewLog.id !== brewLogId
    );
    dispatch(setBrewLogList(newBrewLogs));
    dispatch(setCurrentBrewLog(null));
  }
);

export const processCreateUpdateBrewLog = createAsyncThunk(
  "brew-log/createUpdateBrewLog",
  async (brewLog: BrewLog, { getState, dispatch }) => {
    await createUpdateBrewLog(brewLog);
    const state = getState() as RootState;
    const newBrewLogList: BrewLog[] = deepCloneObject(
      state.brewLogs.brewLogList
    );
    const currentBrewLogIndex = newBrewLogList.findIndex(
      ({ id }) => id === brewLog.id
    );
    if (currentBrewLogIndex !== -1) {
      // this is an update - replace old instance of brew log
      newBrewLogList[currentBrewLogIndex] = brewLog;
    } else {
      // this is a create - add it to the list
      newBrewLogList.push(brewLog);
    }
    dispatch(setBrewLogList(newBrewLogList));
    dispatch(setCurrentBrewLog(brewLog));
  }
);

export const brewLogSlice = createSlice({
  name: "brew-log",
  initialState,
  reducers: {
    setBrewLogListResponse: (
      state,
      action: { payload: BrewLogListResponse }
    ) => {
      state.brewLogList = action.payload.results;
      state.brewLogCount = action.payload.count;
      state.nextPage = action.payload.next;
      state.prevPage = action.payload.previous;
    },
    setBrewLogList: (state, action) => {
      state.brewLogList = action.payload;
    },
    setCurrentBrewLog: (state, action) => {
      state.currentBrewLog = action.payload;
    },
  },
});

export const { setBrewLogList, setCurrentBrewLog, setBrewLogListResponse } =
  brewLogSlice.actions;

export const selectBrewLogList = (state: RootState) =>
  state.brewLogs.brewLogList;
export const selectCurrentBrewLog = (state: RootState) =>
  state.brewLogs.currentBrewLog;
export const selectBrewLogCount = (state: RootState) =>
  state.brewLogs.brewLogCount;

export default brewLogSlice.reducer;
