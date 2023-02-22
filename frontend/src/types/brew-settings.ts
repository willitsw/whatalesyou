import { MeasurementType } from "./shared";

export interface BrewSettings {
  id: string;
  measurement_type: MeasurementType;
  batch_size: number;
  boil_time: number;
  brewhouse_efficiency: number;
  water_loss_per_grain_unit: number;
  water_loss_fermentor_trub: number;
  water_loss_kettle_trub: number;
  water_loss_per_boil_unit: number;
  do_sparge: boolean;
  mash_thickness_target: number;
}
