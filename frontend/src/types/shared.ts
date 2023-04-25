import { BrewLogStatuses } from "./brew-log";

export type MeasurementType = "imperial" | "metric";

export const MeasurementTypeLookup: Record<MeasurementType, string> = {
  imperial: "Imperial",
  metric: "Metric",
};

export type RecipeTypes = "other" | "extract" | "partial_mash" | "all_grain";

export const RecipeTypesLookup: Record<RecipeTypes, string> = {
  other: "Other",
  extract: "Extract",
  partial_mash: "Partial Mash",
  all_grain: "All Grain",
};

export interface PagedResponse {
  count: number;
  next?: string;
  previous?: string;
}

export type FermentableType =
  | "other"
  | "liquid_extract"
  | "dry_extract"
  | "grain"
  | "sugar"
  | "fruit"
  | "juice"
  | "honey";

export const FermentableTypeLookup: Record<FermentableType, string> = {
  other: "Other",
  liquid_extract: "Liquid Extract",
  dry_extract: "Dry Extract",
  grain: "Grain",
  sugar: "Sugar",
  fruit: "Fruit",
  juice: "Juice",
  honey: "Honey",
};

export type Step = "strikewater" | "mash" | "boil" | "fermentor" | "bottle";

export const StepLookup: Record<Step, string> = {
  strikewater: "Strike Water",
  mash: "Mash",
  boil: "Boil",
  fermentor: "Fermentor",
  bottle: "Bottle",
};

export type IngredientAmountType = "g" | "oz" | "kg" | "lb" | "each";

export const IngredientAmountTypeLookup: Record<IngredientAmountType, string> =
  {
    g: "g",
    oz: "oz",
    kg: "kg",
    lb: "lb",
    each: "each",
  };

export const BrewLogStatusLookup: Record<BrewLogStatuses, string> = {
  in_progress: "In Progress",
  complete: "Complete",
};
