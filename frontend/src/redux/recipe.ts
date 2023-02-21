import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import { Recipe, RecipeDetailed, RecipeListResponse } from "../types/recipe";
import {
  createUpdateRecipe,
  deleteRecipe,
  getRecipesByUser,
} from "../utils/api-calls";
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
  }
);

export const processDeleteRecipe = createAsyncThunk(
  "recipes/deleteRecipe",
  async (recipeId: number, { getState, dispatch }) => {
    await deleteRecipe(recipeId);
    const state = getState() as RootState;
    const newRecipes = state.recipes.recipeList.filter(
      (recipe) => recipe.id !== recipeId
    );
    dispatch(setRecipeList(newRecipes));
    dispatch(setCurrentRecipe(null));
  }
);

export const processCreateUpdateRecipe = createAsyncThunk(
  "recipes/createUpdateRecipe",
  async (recipe: RecipeDetailed, { getState, dispatch }) => {
    await createUpdateRecipe(recipe);
    const state = getState() as RootState;
    const newRecipeList: Recipe[] = deepCloneObject(state.recipes.recipeList);
    const currentRecipeIndex = newRecipeList.findIndex(
      ({ id }) => id === recipe.id
    );
    if (currentRecipeIndex !== -1) {
      // this is an update - replace old instance of recipe
      newRecipeList[currentRecipeIndex] = recipe;
    } else {
      // this is a create - add it to the list
      newRecipeList.push(recipe);
    }
    dispatch(setRecipeList(newRecipeList));
    dispatch(setCurrentRecipe(recipe));
  }
);

export const recipeSlice = createSlice({
  name: "recipes",
  initialState,
  reducers: {
    setRecipeListResponse: (state, action: { payload: RecipeListResponse }) => {
      state.recipeList = action.payload.results;
      state.recipeCount = action.payload.count;
      state.nextPage = action.payload.next;
      state.prevPage = action.payload.previous;
      return state;
    },
    setRecipeList: (state, action: { payload: Recipe[] }) => {
      state.recipeList = action.payload;
      return state;
    },
    setCurrentRecipe: (state, action: { payload: RecipeDetailed }) => {
      state.currentRecipe = action.payload;
      return state;
    },
  },
});

export const { setRecipeList, setCurrentRecipe, setRecipeListResponse } =
  recipeSlice.actions;

export const selectRecipeList = (state: RootState) => state.recipes.recipeList;
export const selectCurrentRecipe = (state: RootState) =>
  state.recipes.currentRecipe;

export const selectSortedIngredients = (state: RootState) => {
  const sortedIngredients = {
    strikewater: [],
    mash: [],
    boil: [],
    fermentor: [],
    bottle: [],
  };

  state.recipes.currentRecipe.hops.forEach((hop) =>
    sortedIngredients[hop.step].push({ ...hop, ingredient_type: "hop" })
  );
  state.recipes.currentRecipe.fermentables.forEach((fermentable) =>
    sortedIngredients[fermentable.step].push({
      ...fermentable,
      ingredient_type: "fermentable",
    })
  );
  state.recipes.currentRecipe.cultures.forEach((culture) =>
    sortedIngredients[culture.step].push({
      ...culture,
      ingredient_type: "culture",
    })
  );
  state.recipes.currentRecipe.non_fermentables.forEach((non_fermentable) =>
    sortedIngredients[non_fermentable.step].push({
      ...non_fermentable,
      ingredient_type: "non_fermentable",
    })
  );
  state.recipes.currentRecipe.chemistry.forEach((chem) =>
    sortedIngredients[chem.step].push({ ...chem, ingredient_type: "chemistry" })
  );

  return sortedIngredients;
};

export default recipeSlice.reducer;
