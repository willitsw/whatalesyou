import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import {
  Ingredient,
  Recipe,
  RecipeDetailed,
  RecipeListResponse,
} from "../types/recipe";
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
      const currentRecipe: RecipeDetailed = { ...action.payload };
      currentRecipe.hops.forEach((hop) => (hop.ingredient_type = "hops"));
      currentRecipe.cultures.forEach(
        (culture) => (culture.ingredient_type = "cultures")
      );
      currentRecipe.fermentables.forEach(
        (ferm) => (ferm.ingredient_type = "fermentables")
      );
      currentRecipe.non_fermentables.forEach(
        (non_ferm) => (non_ferm.ingredient_type = "non_fermentables")
      );
      currentRecipe.chemistry.forEach(
        (chemistry) => (chemistry.ingredient_type = "chemistry")
      );
      state.currentRecipe = currentRecipe;
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
  const sortedIngredients: {
    strikewater: Ingredient[];
    mash: Ingredient[];
    boil: Ingredient[];
    fermentor: Ingredient[];
    bottle: Ingredient[];
  } = {
    strikewater: [],
    mash: [],
    boil: [],
    fermentor: [],
    bottle: [],
  };

  state.recipes.currentRecipe.hops.forEach((hop) =>
    sortedIngredients[hop.step].push(hop)
  );
  state.recipes.currentRecipe.fermentables.forEach((fermentable) =>
    sortedIngredients[fermentable.step].push(fermentable)
  );
  state.recipes.currentRecipe.cultures.forEach((culture) =>
    sortedIngredients[culture.step].push(culture)
  );
  state.recipes.currentRecipe.non_fermentables.forEach((non_fermentable) =>
    sortedIngredients[non_fermentable.step].push(non_fermentable)
  );
  state.recipes.currentRecipe.chemistry.forEach((chem) =>
    sortedIngredients[chem.step].push(chem)
  );

  return sortedIngredients;
};

export const selectIngredientList = (state: RootState): Ingredient[] => [
  ...state.recipes.currentRecipe.fermentables,
  ...state.recipes.currentRecipe.hops,
  ...state.recipes.currentRecipe.cultures,
  ...state.recipes.currentRecipe.chemistry,
  ...state.recipes.currentRecipe.non_fermentables,
];

export default recipeSlice.reducer;
