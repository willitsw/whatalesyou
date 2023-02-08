import { MeasurementType } from "./shared";

export interface TokenResponse {
  refresh: string;
  access: string;
}

export interface TokenRequest {
  username: string;
  password: string;
}

export interface User {
  id: number;
  bio: string;
  username: string;
}

export interface UserResponse {
  id: number;
  user: {
    id: number;
    username: string;
    is_staff: boolean;
  };
  bio: string;
  measurement_type: MeasurementType;
  batch_size: number;
  boil_time: number;
  brewhouse_efficiency: number;
  water_loss_per_grain_unit: number;
  water_loss_fermentor_trub: number;
  water_loss_kettle_trub: number;
  water_loss_per_boil_unit: number;
  do_sparge: boolean;
  mash_thickness_target: number;
}
