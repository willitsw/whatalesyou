import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants";
import { BrewLog, BrewLogListResponse } from "../types/brew-log";
import { BrewSettings } from "../types/brew-settings";
import { Recipe, RecipeDetailed, RecipeListResponse } from "../types/recipe";
import { Response } from "../types/shared";
import {
  UserRequest,
  TokenRequest,
  TokenResponse,
  UserResponse,
  User,
  EmailValidationRequest,
} from "../types/user";
import makeRequest from "./request";

// RECIPE ENDPOINTS

export const getRecipesByUser = async (): Promise<RecipeListResponse> => {
  return (await makeRequest("/recipes/", "GET")).body;
};

export const getRecipeById = async (
  recipeId: string
): Promise<RecipeDetailed> => {
  return (await makeRequest(`/recipes/${recipeId}/`, "GET")).body;
};

export const deleteRecipe = async (recipeId: string): Promise<void> => {
  return (await makeRequest(`/recipes/${recipeId}/`, "DELETE")).body;
};

export const createUpdateRecipe = async (recipe: Recipe): Promise<Recipe> => {
  return (await makeRequest(`/recipes/${recipe.id}/`, "PUT", recipe)).body;
};

// BREW SETTINGS ENDPOINTS

export const getBrewSettings = async (): Promise<BrewSettings> => {
  return (await makeRequest("/users/", "GET")).body;
};

export const createUpdateBrewSettings = async (
  brewSettings: BrewSettings
): Promise<BrewSettings> => {
  return (
    await makeRequest(`/brew-settings/${brewSettings.id}/`, "PUT", brewSettings)
  ).body;
};

// BREW LOG ENDPOINTS

export const getBrewLogsByUser = async (): Promise<BrewLogListResponse> => {
  return (await makeRequest("/brew-logs/", "GET")).body;
};

export const getBrewLogById = async (brewLogId: string): Promise<BrewLog> => {
  return (await makeRequest(`/brew-logs/${brewLogId}/`, "GET")).body;
};

export const deleteBrewLog = async (brewLogId: string): Promise<void> => {
  return (await makeRequest(`/brew-logs/${brewLogId}/`, "DELETE")).body;
};

export const createUpdateBrewLog = async (
  brewLog: BrewLog
): Promise<BrewLog> => {
  return (await makeRequest(`/brew-logs/${brewLog.id}/`, "PUT", brewLog)).body;
};

// TOKEN ENDPOINTS

export const getToken = async (body: TokenRequest): Promise<void> => {
  const response = await makeRequest("/token/", "POST", body, {
    useAuth: false,
  });
  if (response.ok) {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.body.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.body.refresh);
    console.log("logged in with new token");
  }
};

export const refreshToken = async (): Promise<void> => {
  const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
  const response = await makeRequest(
    "/token/refresh/",
    "POST",
    {
      refresh,
    },
    { useAuth: false }
  );
  if (response.ok) {
    localStorage.setItem(ACCESS_TOKEN_KEY, response.body.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, response.body.refresh);
    console.log("refreshed the token");
  }
};

// USER ENDPOINTS

export const getCurrentUser = async (id: string): Promise<UserResponse> => {
  return (await makeRequest(`/users/${id}/`, "GET")).body;
};

export const createUser = async (body: UserRequest): Promise<UserResponse> => {
  const result = await makeRequest("/users/", "POST", body, { useAuth: false });
  return { code: result.code, ...result.body };
};

export const updateUser = async (body: User): Promise<UserResponse> => {
  return (await makeRequest(`/users/${body.id}/`, "PUT", body)).body;
};

export const validateEmailToken = async (
  body: EmailValidationRequest
): Promise<Response> => {
  const result = await makeRequest(`/validate-new-user/`, "POST", body);

  return { code: result.code };
};
