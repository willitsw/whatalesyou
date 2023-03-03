import {
  FermentableType,
  IngredientAmountType,
  MeasurementType,
  PagedResponse,
  RecipeTypes,
  Step,
} from "./shared";

export interface Recipe {
  id: string;
  name: string;
  type: RecipeTypes;
  description: string;
  author: string;
  created_at: string;
  updated_at: string;
  batch_size: number;
  efficiency: number;
  measurement_type: MeasurementType;
  owner: string;
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
  id: string;
  name: string;
  step: Step;
  timing: number;
  notes: string;
  amount: number;
  amount_type: IngredientAmountType;
  ingredient_type?: IngredientType;
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

export type CultureForm = "liquid" | "dry";
export interface Culture extends Ingredient {
  attenuation: number;
  form: CultureForm;
}

export const CultureFormLookup: Record<CultureForm, string> = {
  liquid: "Liquid",
  dry: "Dry",
};

export interface NonFermentable extends Ingredient {}

export type ValidIngredient =
  | Hop
  | Fermentable
  | Chemistry
  | NonFermentable
  | Culture;

export type IngredientType =
  | "hops"
  | "cultures"
  | "fermentables"
  | "non_fermentables"
  | "chemistry";

export const IngredientTypeLookup: Record<IngredientType, string> = {
  hops: "Hop",
  cultures: "Culture",
  fermentables: "Fermentable",
  non_fermentables: "Non Fermentable",
  chemistry: "Chemistry",
};
