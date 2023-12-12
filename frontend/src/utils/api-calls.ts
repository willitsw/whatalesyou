import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "../constants";
import { BrewLog, BrewLogListResponse } from "../types/brew-log";
import { BrewSettings } from "../types/brew-settings";
import { Recipe, RecipeDetailed, RecipeListResponse } from "../types/recipe";
import {
  UserRequest,
  TokenRequest,
  UserResponse,
  User,
  EmailValidationRequest,
} from "../types/user";
import makeRequest from "./request";

export const useGetRecipesByUser = () =>
  useQuery<RecipeListResponse>({
    queryKey: ["recipe", "list"],
    queryFn: async () => {
      const res = await makeRequest("/recipes/", "GET");
      return await res.json();
    },
  });

export const useGetRecipeById = (recipeId: string) =>
  useQuery<RecipeDetailed>({
    queryKey: ["recipe", recipeId],
    queryFn: async () => {
      if (recipeId) {
        const rest = await makeRequest(`/recipes/${recipeId}/`, "GET");
        return await rest.json();
      }
      return null;
    },
  });

export const useDeleteRecipe = (recipeId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void>({
    mutationFn: async () => {
      const res = await makeRequest(`/recipes/${recipeId}/`, "DELETE");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", "list"] });
    },
  });
};

export const useCreateUpdateRecipe = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, Recipe>({
    mutationFn: async (recipe: Recipe) => {
      const res = await makeRequest(`/recipes/${recipe.id}/`, "PUT", recipe);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe", "list"] });
    },
  });
};

export const useCreateUpdateBrewSettings = () => {
  const queryClient = useQueryClient();
  return useMutation<void, Error, BrewSettings>({
    mutationFn: async (brewSettings: BrewSettings) => {
      const res = await makeRequest(
        `/brew-settings/${brewSettings.id}/`,
        "PUT",
        brewSettings
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brewSettings"] });
    },
  });
};

// BREW LOG ENDPOINTS

export const useGetBrewLogsByUser = () =>
  useQuery<BrewLogListResponse>({
    queryKey: ["brewLogs"],
    queryFn: async () => {
      const res = await makeRequest("/brew-logs/", "GET");
      return await res.json();
    },
  });

export const useGetBrewLogsById = (brewLogId: string) =>
  useQuery<BrewLog>({
    queryKey: ["brewLogById"],
    queryFn: async () => {
      const res = await makeRequest(`/brew-logs/${brewLogId}/`, "GET");
      return await res.json();
    },
  });

export const useCreateUpdateBrewLog = (brewLog: BrewLog) => {
  const queryClient = useQueryClient();
  return useMutation<BrewLog>({
    mutationFn: async () => {
      const res = await makeRequest(
        `/brew-logs/${brewLog.id}/`,
        "PUT",
        brewLog
      );
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brewLogById"] });
      queryClient.invalidateQueries({ queryKey: ["brewLogs"] });
    },
  });
};

export const useDeleteBrewLog = (brewLogId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void>({
    mutationFn: async () => {
      const res = await makeRequest(`/brew-logs/${brewLogId}/`, "DELETE");
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brewLogById"] });
      queryClient.invalidateQueries({ queryKey: ["brewLogs"] });
    },
  });
};

// TOKEN ENDPOINTS

export const getToken = async (body: TokenRequest): Promise<Response> => {
  const response = await makeRequest("/token/", "POST", body, {
    useAuth: false,
  });
  return response;
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
    const body = await response.json();
    localStorage.setItem(ACCESS_TOKEN_KEY, body.access);
    localStorage.setItem(REFRESH_TOKEN_KEY, body.refresh);
    console.log("refreshed the token");
  }
};

// USER ENDPOINTS

export const getCurrentUser = async (id: string): Promise<UserResponse> => {
  const result = await makeRequest(`/users/${id}/`, "GET");
  return await result.json();
};

export const useGetCurrentUser = (id: string) =>
  useQuery<UserResponse>({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const response = await makeRequest(`/users/${id}/`, "GET");
      return await response.json();
    },
  });

export const useCreateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<UserResponse, Error, UserRequest>({
    mutationFn: async (body: UserRequest) => {
      const res = await makeRequest("/users/", "POST", body, {
        useAuth: false,
      });
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  return useMutation<UserResponse, Error, User>({
    mutationFn: async (body: User) => {
      const res = await makeRequest(`/users/${body.id}/`, "PUT", body);
      return await res.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const validateEmailToken = async (
  body: EmailValidationRequest
): Promise<Response> => {
  const result = await makeRequest(`/validate-new-user/`, "POST", body);

  return result;
};

export const resetValidationCode = async (): Promise<Response> => {
  const result = await makeRequest(`/verification-code/reset/`, "GET");

  return result;
};
