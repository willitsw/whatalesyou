import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
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

// type RecipeApiType = {
//   getByUser: (userId: string) => Promise<UseQueryResult<RecipeDetailed[]>>;
//   getById: (recipeId: string) => Promise<RecipeDetailed>;
//   delete: (recipeId: string) => Promise<void>;
//   createUpdate: (recipe: Recipe) => Promise<void>;
// };

export const useGetRecipesByUser = () =>
  useQuery<RecipeListResponse>({
    queryKey: ["recipe", "list"],
    queryFn: async () => (await makeRequest("/recipes/", "GET")).body,
  });

export const useGetRecipeById = (recipeId: string) =>
  useQuery<RecipeDetailed>({
    queryKey: ["recipe", recipeId],
    queryFn: async () => {
      if (recipeId) {
        return (await makeRequest(`/recipes/${recipeId}/`, "GET")).body;
      }
      return null;
    },
  });

export const useDeleteRecipe = (recipeId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void>({
    mutationFn: async () =>
      (await makeRequest(`/recipes/${recipeId}/`, "DELETE")).body,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe"] });
    },
  });
};

export const useCreateUpdateRecipe = (recipe: Recipe) => {
  const queryClient = useQueryClient();
  return useMutation<void>({
    mutationFn: async () =>
      (await makeRequest(`/recipes/${recipe.id}/`, "PUT", recipe)).body,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["recipe"] });
    },
  });
};

// export const RecipeApi: RecipeApiType = {
//   getByUser: async (userId: string) =>
//     useQuery({
//       queryKey: ["recipesByUser", userId],
//       queryFn: (await makeRequest("/recipes/", "GET")).body,
//     }),
//   getById: async (recipeId: string) =>
//     (await makeRequest(`/recipes/${recipeId}/`, "GET")).body,
//   delete: async (recipeId: string) =>
//     (await makeRequest(`/recipes/${recipeId}/`, "DELETE")).body,
//   createUpdate: async (recipe: Recipe) =>
//     (await makeRequest(`/recipes/${recipe.id}/`, "PUT", recipe)).body,
// };

// export const getRecipesByUser = async (): Promise<RecipeListResponse> => {
//   return (await makeRequest("/recipes/", "GET")).body;
// };

// export const getRecipeById = async (
//   recipeId: string
// ): Promise<RecipeDetailed> => {
//   return (await makeRequest(`/recipes/${recipeId}/`, "GET")).body;
// };

// export const deleteRecipe = async (recipeId: string): Promise<void> => {
//   return (await makeRequest(`/recipes/${recipeId}/`, "DELETE")).body;
// };

// export const createUpdateRecipe = async (recipe: Recipe): Promise<Recipe> => {
//   return (await makeRequest(`/recipes/${recipe.id}/`, "PUT", recipe)).body;
// };

// BREW SETTINGS ENDPOINTS

// export const useGetBrewSettings = () =>
//   useQuery<BrewSettings>({
//     queryKey: ["brewSettings"],
//     queryFn: async () => (await makeRequest("/brew-settings/", "GET")).body,
//   });

export const useCreateUpdateBrewSettings = (brewSettings: BrewSettings) => {
  const queryClient = useQueryClient();
  return useMutation<void>({
    mutationFn: async () =>
      (
        await makeRequest(
          `/brew-settings/${brewSettings.id}/`,
          "PUT",
          brewSettings
        )
      ).body,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brewSettings"] });
    },
  });
};

// export const getBrewSettings = async (): Promise<BrewSettings> => {
//   return (await makeRequest("/users/", "GET")).body;
// };

// export const createUpdateBrewSettings = async (
//   brewSettings: BrewSettings
// ): Promise<BrewSettings> => {
//   return (
//     await makeRequest(`/brew-settings/${brewSettings.id}/`, "PUT", brewSettings)
//   ).body;
// };

// BREW LOG ENDPOINTS

export const useGetBrewLogsByUser = () =>
  useQuery<BrewLogListResponse>({
    queryKey: ["brewLogs"],
    queryFn: async () => (await makeRequest("/brew-logs/", "GET")).body,
  });

export const useGetBrewLogsById = (brewLogId: string) =>
  useQuery<BrewLog>({
    queryKey: ["brewLogById"],
    queryFn: async () =>
      (await makeRequest(`/brew-logs/${brewLogId}/`, "GET")).body,
  });

export const useCreateUpdateBrewLog = (brewLog: BrewLog) => {
  const queryClient = useQueryClient();
  return useMutation<BrewLog>({
    mutationFn: async () =>
      (await makeRequest(`/brew-logs/${brewLog.id}/`, "PUT", brewLog)).body,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brewLogById"] });
      queryClient.invalidateQueries({ queryKey: ["brewLogs"] });
    },
  });
};

export const useDeleteBrewLog = (brewLogId: string) => {
  const queryClient = useQueryClient();
  return useMutation<void>({
    mutationFn: async () =>
      (await makeRequest(`/brew-logs/${brewLogId}/`, "DELETE")).body,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["brewLogById"] });
      queryClient.invalidateQueries({ queryKey: ["brewLogs"] });
    },
  });
};

// export const getBrewLogsByUser = async (): Promise<BrewLogListResponse> => {
//   return (await makeRequest("/brew-logs/", "GET")).body;
// };

// export const getBrewLogById = async (brewLogId: string): Promise<BrewLog> => {
//   return (await makeRequest(`/brew-logs/${brewLogId}/`, "GET")).body;
// };

// export const deleteBrewLog = async (brewLogId: string): Promise<void> => {
//   return (await makeRequest(`/brew-logs/${brewLogId}/`, "DELETE")).body;
// };

// export const createUpdateBrewLog = async (
//   brewLog: BrewLog
// ): Promise<BrewLog> => {
//   return (await makeRequest(`/brew-logs/${brewLog.id}/`, "PUT", brewLog)).body;
// };

// TOKEN ENDPOINTS

export const getToken = async (body: TokenRequest): Promise<TokenResponse> => {
  const response = await makeRequest("/token/", "POST", body, {
    useAuth: false,
  });
  return response.body;
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

// export const getCurrentUser = async (id: string): Promise<UserResponse> => {
//   return (await makeRequest(`/users/${id}/`, "GET")).body;
// };

export const getCurrentUser = async (id: string): Promise<UserResponse> => {
  return (await makeRequest(`/users/${id}/`, "GET")).body;
};

export const useGetCurrentUser = (id: string) =>
  useQuery<UserResponse>({
    queryKey: ["currentUser"],
    queryFn: async () => (await makeRequest(`/users/${id}/`, "GET")).body,
  });

export const useCreateUser = (body: UserRequest) => {
  const queryClient = useQueryClient();
  return useMutation<UserResponse>({
    mutationFn: async () =>
      (await makeRequest("/users/", "POST", body, { useAuth: false })).body,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

export const useUpdateUser = (body: User) => {
  const queryClient = useQueryClient();
  return useMutation<UserResponse>({
    mutationFn: async () =>
      (await makeRequest(`/users/${body.id}/`, "PUT", body)).body,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["currentUser"] });
    },
  });
};

// export const createUser = async (body: UserRequest): Promise<UserResponse> => {
//   const result = await makeRequest("/users/", "POST", body, { useAuth: false });
//   return { code: result.code, ...result.body };
// };

// export const updateUser = async (body: User): Promise<UserResponse> => {
//   return (await makeRequest(`/users/${body.id}/`, "PUT", body)).body;
// };

export const validateEmailToken = async (
  body: EmailValidationRequest
): Promise<Response> => {
  const result = await makeRequest(`/validate-new-user/`, "POST", body);

  return { code: result.code };
};
