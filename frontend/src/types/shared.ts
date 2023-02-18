export type MeasurementType = "imperial" | "metric";

export type RecipeTypes = "other" | "extract" | "partial_mash" | "all_grain";

export interface PagedResponse {
  count: number;
  next?: string;
  previous?: string;
}

// class RecipeTypes(models.TextChoices):
//     Other = "other"
//     Extract = "extract"
//     Partial_Mash = "partial_mash"
//     All_Grain = "all_grain"