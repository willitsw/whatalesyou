export type MeasurementType = "imperial" | "metric";

export interface PagedResponse {
  count: number;
  next?: string;
  previous?: string;
}