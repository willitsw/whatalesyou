import { BrewSettings } from "./brew-settings";

export interface TokenResponse {
  refresh: string;
  access: string;
}

export interface TokenRequest {
  email: string;
  password: string;
}

export interface TokenPayload {
  token_type: "access" | "refresh";
  exp: number;
  user_id: number;
}

export interface User {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
}

export interface UserResponse extends User {
  settings: BrewSettings;
}

export interface CreateUserRequest {
  email: string;
  password: string;
}