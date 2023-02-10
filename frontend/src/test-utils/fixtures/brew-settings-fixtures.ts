import { BrewSettings } from "../../types/brew-settings";

const getImperialSettings = (): BrewSettings => {
  return {
    id: 1,
    batch_size: 5,
    boil_time: 60,
    brewhouse_efficiency: 70,
    measurement_type: "imperial",
    water_loss_kettle_trub: 0.25,
    water_loss_fermentor_trub: 0.25,
    water_loss_per_boil_unit: 1.5,
    water_loss_per_grain_unit: 0.5,
    do_sparge: false,
    mash_thickness_target: 1.3,
  };
};

const getMetricSettings = (): BrewSettings => {
  return {
    id: 2,
    batch_size: 18.93,
    boil_time: 60,
    brewhouse_efficiency: 70,
    measurement_type: "metric",
    water_loss_kettle_trub: 0.95,
    water_loss_fermentor_trub: 0.95,
    water_loss_per_boil_unit: 5.68,
    water_loss_per_grain_unit: 1,
    do_sparge: false,
    mash_thickness_target: 1.3,
  };
};

export const brewSettingsFixtures = { getMetricSettings, getImperialSettings };
