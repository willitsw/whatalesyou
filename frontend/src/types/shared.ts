export type MeasurementType = "imperial" | "metric";

export type RecipeTypes = "other" | "extract" | "partial_mash" | "all_grain";

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

export type Step = "strikewater" | "mash" | "boil" | "fermentor" | "bottle";

export type IngredientAmountType = "g" | "oz" | "kg" | "lb" | "each";

// class RecipeTypes(models.TextChoices):
//     Other = "other"
//     Extract = "extract"
//     Partial_Mash = "partial_mash"
//     All_Grain = "all_grain"
