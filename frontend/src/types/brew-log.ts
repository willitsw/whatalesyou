import { PagedResponse } from "./shared";

export interface BrewLog {
  id: string;
  gravity_readings: any[];
  name: string;
  batch_number: number;
  status: string;
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

export interface BrewLogListResponse extends PagedResponse {
  results: BrewLog[];
}
