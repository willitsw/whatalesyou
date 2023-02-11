import { BrewingTypes as BT } from "brewing-shared";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants";
import { BrewSettings } from "../types/brew-settings";
import {
  CreateUserRequest,
  TokenRequest,
  TokenResponse,
  UserResponse,
} from "../types/user";
import makeRequest from "./request";

// RECIPE ENDPOINTS

export const getRecipesByUser = async (): Promise<BT.Recipe[]> => {
  return await makeRequest("/recipes", "GET");
};

export const getRecipeById = async (recipeId: string): Promise<BT.Recipe> => {
  return await makeRequest(`/recipes/${recipeId}`, "GET");
};

export const deleteRecipe = async (recipeId: string): Promise<void> => {
  return await makeRequest(`/recipes/${recipeId}`, "DELETE");
};

export const createUpdateRecipe = async (
  recipe: BT.Recipe
): Promise<BT.Recipe> => {
  return await makeRequest("/recipes", "POST", recipe);
};

// BREW SETTINGS ENDPOINTS

export const getBrewSettings = async (): Promise<BT.User> => {
  return await makeRequest("/users", "GET");
};

export const deleteBrewSettings = async (id: string): Promise<void> => {
  return await makeRequest(`/users/${id}`, "DELETE");
};

export const createUpdateBrewSettings = async (
  brewSettings: BrewSettings
): Promise<BrewSettings> => {
  return await makeRequest("/users", "POST", brewSettings);
};

// BREW LOG ENDPOINTS

export const getBrewLogsByUser = async (): Promise<BT.BrewLog[]> => {
  return await makeRequest("/brew-logs", "GET");
};

export const getBrewLogById = async (
  brewLogId: string
): Promise<BT.BrewLog> => {
  return await makeRequest(`/brew-logs/${brewLogId}`, "GET");
};

export const deleteBrewLog = async (brewLogId: string): Promise<void> => {
  return await makeRequest(`/brew-logs/${brewLogId}`, "DELETE");
};

export const createUpdateBrewLog = async (
  brewLog: BT.BrewLog
): Promise<BT.BrewLog> => {
  return await makeRequest("/brew-logs", "POST", brewLog);
};

// TOKEN ENDPOINTS

export const getToken = async (body: TokenRequest): Promise<void> => {
  const tokenPayload: TokenResponse = await makeRequest(
    "/token/",
    "POST",
    body,
    { useAuth: false }
  );
  localStorage.setItem(ACCESS_TOKEN_KEY, tokenPayload.access);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokenPayload.refresh);
  console.log("logged in with new token");
};

export const refreshToken = async (): Promise<void> => {
  const refresh = localStorage.getItem(REFRESH_TOKEN_KEY);
  const tokenPayload: TokenResponse = await makeRequest(
    "/token/refresh/",
    "POST",
    {
      refresh,
    },
    { useAuth: false }
  );
  localStorage.setItem(ACCESS_TOKEN_KEY, tokenPayload.access);
  localStorage.setItem(REFRESH_TOKEN_KEY, tokenPayload.refresh);
  console.log("refreshed the token");
};

// USER ENDPOINTS

export const getCurrentUser = async (id: number): Promise<UserResponse> => {
  return await makeRequest(`/users/${id}/`, "GET");
};

export const createUser = async (
  body: CreateUserRequest
): Promise<UserResponse> => {
  return await makeRequest("/users/", "POST", body, { useAuth: false });
};
