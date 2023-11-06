import { Response } from "./shared";
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
  user_id: string;
}

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
  is_verified: boolean;
}

export interface UserResponse extends User, Response {
  settings: BrewSettings;
}

export interface UserRequest {
  email: string;
  password: string;
  first_name: string;
  last_name: string;
}

export interface EmailValidationRequest {
  token: string;
}
