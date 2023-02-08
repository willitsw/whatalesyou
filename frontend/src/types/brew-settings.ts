import { MeasurementType } from "./shared";

export interface BrewSettings {
  measurementType: MeasurementType;
  batchSize: number;
  boilTime: number;
  brewhouseEfficiency: number;
  waterLossPerGrain: number;
  fermentorTrubWaterLoss: number;
  kettleTrubWaterLoss: number;
  boilOffWaterLossRate: number;
  sparge: boolean;
  mashThickness: number;
}
