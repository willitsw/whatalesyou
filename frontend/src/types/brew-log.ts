import { PagedResponse } from "./shared";

export type BrewLogStatuses = "in_progress" | "complete";

export interface BrewLog {
  id: string;
  gravity_readings: GravityReading[];
  name: string;
  batch_number: number;
  status: BrewLogStatuses;
  brew_date: string;
  secondary_date?: string;
  packaging_date?: string;
  brewing_notes: string;
  fermentation_notes: string;
  hop_notes: string;
  yeast_notes: string;
  packaging_notes: string;
  tasting_notes: string;
  other_notes: string;
  recipe?: string;
  owner: number;
}

export interface GravityReading {
  id: string;
  notes: string;
  gravity: number;
  date: string;
}

export interface BrewLogListResponse extends PagedResponse {
  results: BrewLog[];
}
