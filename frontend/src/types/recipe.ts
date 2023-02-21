import {
  FermentableType,
  IngredientAmountType,
  MeasurementType,
  PagedResponse,
  RecipeTypes,
  Step,
} from "./shared";

export interface Recipe {
  id: number;
  name: string;
  type: RecipeTypes;
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

export interface RecipeDetailed extends Recipe {
  hops: Hop[];
  fermentables: Fermentable[];
  chemistry: Chemistry[];
  cultures: Culture[];
  non_fermentables: NonFermentable[];
}

export interface Ingredient {
  id: number;
  name: string;
  step: Step;
  timing: number;
  notes: string;
  amount: number;
  amount_type: IngredientAmountType;
  ingredient_type?:
    | "fermentable"
    | "non_fermentable"
    | "culture"
    | "hop"
    | "chemistry";
}

export interface Hop extends Ingredient {
  alpha_acid: number;
}

export interface Fermentable extends Ingredient {
  lovibond: number;
  type: FermentableType;
  potential: number;
}

export interface Chemistry extends Ingredient {}

export interface Culture extends Ingredient {
  attenuation: number;
  form: "liquid" | "dry";
}

export interface NonFermentable extends Ingredient {}
