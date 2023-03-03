import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  Ingredient,
  Recipe,
  RecipeDetailed,
  RecipeListResponse,
} from "../types/recipe";
import { deleteRecipe, getRecipesByUser } from "../utils/api-calls";
import { deepCloneObject } from "../utils/helpers";
import type { RootState } from "./store";

export interface RecipeState {
  recipeCount: number;
  nextPage: string;
  prevPage: string;
  recipeList: Recipe[];
  currentRecipe: RecipeDetailed;
}

const initialState: RecipeState = {
  recipeCount: 0,
  nextPage: null,
  prevPage: null,
  recipeList: [],
  currentRecipe: null,
};

export const refreshRecipeList = createAsyncThunk(
  "recipes/refreshRecipeList",
  async (_, { dispatch }) => {
    const recipeListResponse = await getRecipesByUser();
    dispatch(setRecipeListResponse(recipeListResponse));
    dispatch(setRecipeList(recipeListResponse.results));
  }
);

export const processDeleteRecipe = createAsyncThunk(
  "recipes/deleteRecipe",
  async (recipeId: string, { getState, dispatch }) => {
    await deleteRecipe(recipeId);
    const state = getState() as RootState;
    const newRecipes = state.recipes.recipeList.filter(
      (recipe) => recipe.id !== recipeId
    );
    dispatch(setRecipeList(newRecipes));
  }
);

export const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipeListResponse: (state, action: { payload: RecipeListResponse }) => {
      state.recipeCount = action.payload.count;
      state.nextPage = action.payload.next;
      state.prevPage = action.payload.previous;
      return state;
    },
    setRecipeList: (state, action: { payload: Recipe[] }) => {
      state.recipeList = action.payload;
      return state;
    },
  },
});

export const { setRecipeList, setRecipeListResponse } = recipeSlice.actions;

export const selectRecipeList = (state: RootState) => state.recipes.recipeList;

export default recipeSlice.reducer;
