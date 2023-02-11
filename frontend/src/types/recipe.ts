import { MeasurementType, PagedResponse } from "./shared";

export interface Recipe {
  id: number;
  name: string;
  type: string;
  description: string;
  author: string;
  created_at: string;
  updated_at: string;
  batch_size: number;
  efficiency: number;
  measurement_type: MeasurementType;
  owner: number;
}

export interface RecipeListResponse extends PagedResponse {
  results: Recipe[];
}
