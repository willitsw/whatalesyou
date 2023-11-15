import {
  brewSettingsToImperial,
  gallonsToLiters,
  recipeToImperial,
} from "./converters";
import { RecipeUtils } from "brewing-shared";
import { BrewSettings } from "../types/brew-settings";
import {
  Culture,
  Fermentable,
  Hop,
  Recipe,
  RecipeDetailed,
} from "../types/recipe";
import { Stats } from "../types/stats";

export const calculateSrm = (
  batchSizeGallons: number,
  fermentables: Fermentable[]
): number | null => {
  if (!batchSizeGallons || !fermentables) {
    return null;
  }
  let srm = 0;

  const actualFermentables = fermentables.filter((grain) => !!grain);

  actualFermentables.forEach((fermentable) => {
    if (fermentable.lovibond && fermentable.amount && fermentable.potential) {
      srm += (fermentable.amount * fermentable.lovibond) / batchSizeGallons;
    }
  });

  srm = 1.4922 * srm ** 0.6859;

  srm = Math.round(srm);

  return srm;
};

export const calculateOg = (
  fermentables: Fermentable[],
  batchSizeGallons: number,
  efficiency: number
): number | null => {
  if (!batchSizeGallons || fermentables.length === 0 || !efficiency) {
    return null;
  }

  const actualFermentables = fermentables.filter(
    (fermentable) =>
      !!fermentable &&
      fermentable.potential &&
      fermentable.amount &&
      fermentable.potential > 0 &&
      fermentable.amount > 0
  );

  const unadjustedOg = actualFermentables.reduce(
    (og, { potential, amount }) => {
      const points = potential - 1;
      return (og += points * amount);
    },
    0
  );

  const actualEfficiency = efficiency / 100;

  const efficiencyOg = unadjustedOg * actualEfficiency;

  const adjustedOg = efficiencyOg / batchSizeGallons + 1;

  return Math.round(adjustedOg * 1000) / 1000;
};

export const calculateFg = (
  og: number | null,
  cultures: Culture[]
): number | null => {
  if (!og || cultures.length === 0) {
    return null;
  }

  const ogPercentage = og - 1;

  const averageAttenuation =
    cultures.reduce((att, culture) => {
      if (culture && culture.attenuation) {
        return (att += culture.attenuation / 100);
      } else {
        return att;
      }
    }, 0) / cultures.length;

  const averageNotAttenuated = 1 - averageAttenuation;

  const rawFg = ogPercentage * averageNotAttenuated + 1;

  return Math.round(rawFg * 1000) / 1000;
};

export const calculateAbv = (
  og: number | null,
  fg: number | null
): number | null => {
  if (!og || !fg) {
    return null;
  }
  const rawAbv = (og - fg) * 131.25;
  return Math.round(rawAbv * 10) / 10;
};

export const calculateIbu = (
  og: number | null,
  hops: Hop[],
  batchSize: number
): number | null => {
  if (!og) {
    return null;
  }

  const bignessFactor = 1.65 * 0.000125 ** (og - 1);

  let totalIbu = 0;

  const actualHops = hops.filter((hop) => !!hop);

  actualHops.forEach((hop) => {
    if (hop.timing && hop.amount && hop.alpha_acid && hop.step === "boil") {
      const boilTimeFactor = (1 - Math.E ** (-0.04 * hop.timing)) / 4.15;
      const aaUtilization = bignessFactor * boilTimeFactor;
      const mgLtrAa = ((hop.alpha_acid / 100) * hop.amount * 7490) / batchSize;
      const ibu = aaUtilization * mgLtrAa;
      totalIbu += ibu;
    }
  });

  return Math.round(totalIbu);
};

const getGrainPounds = (grains: Fermentable[]): number => {
  return grains?.reduce((pounds, currentFermentable) => {
    if (
      !currentFermentable ||
      !currentFermentable.amount ||
      currentFermentable.type !== "grain"
    ) {
      return pounds;
    }
    return pounds + currentFermentable.amount;
  }, 0);
};

export const calculateWaterLoss = (
  brewSettings: BrewSettings,
  fermentables: Fermentable[]
) => {
  let waterLoss = 0;

  waterLoss += brewSettings.water_loss_fermentor_trub;
  waterLoss += brewSettings.water_loss_kettle_trub;

  const boilHours = brewSettings.boil_time / 60;
  const evaporationLoss = brewSettings.water_loss_per_boil_unit * boilHours;
  waterLoss += evaporationLoss;

  const grainPounds = getGrainPounds(fermentables);
  const quartsLostFromGrain =
    grainPounds * brewSettings.water_loss_per_grain_unit;
  waterLoss += quartsLostFromGrain / 4;

  return waterLoss;
};

export const calculateStrikeWater = (
  brewSettings: BrewSettings,
  waterLoss: number,
  fermentables: Fermentable[],
  batchSize: number
) => {
  if (!brewSettings.do_sparge) {
    return batchSize + waterLoss;
  }

  const grainPounds = getGrainPounds(fermentables);
  const quartsNeeded = grainPounds * brewSettings.mash_thickness_target;
  return quartsNeeded / 4;
};

export const calculateHotLiquor = (
  recipe: Recipe,
  brewSettings: BrewSettings,
  strikeWater: number,
  waterLoss: number
) => {
  if (!brewSettings.do_sparge) return 0;

  const totalWater = recipe.batch_size + waterLoss;

  return totalWater - strikeWater;
};

export const getStats = (
  recipe: RecipeDetailed,
  brewSettings: BrewSettings
): Stats => {
  const adjustedRecipe = recipeToImperial(recipe);
  const adjustedBrewSettings =
    brewSettings.measurement_type === "imperial"
      ? brewSettings
      : brewSettingsToImperial(brewSettings);

  const srm = calculateSrm(
    adjustedRecipe.batch_size,
    adjustedRecipe.fermentables
  );
  const og = calculateOg(
    adjustedRecipe.fermentables,
    adjustedRecipe.batch_size,
    adjustedRecipe.efficiency
  );
  const fg = calculateFg(og, adjustedRecipe.cultures);
  const abv = calculateAbv(og, fg);
  const ibu = calculateIbu(og, adjustedRecipe.hops, adjustedRecipe.batch_size);

  const waterLoss = calculateWaterLoss(
    adjustedBrewSettings,
    adjustedRecipe.fermentables
  );
  const strikeWater = calculateStrikeWater(
    adjustedBrewSettings,
    waterLoss,
    adjustedRecipe.fermentables,
    adjustedRecipe.batch_size
  );
  const hotLiquor = calculateHotLiquor(
    adjustedRecipe,
    adjustedBrewSettings,
    strikeWater,
    waterLoss
  );

  const isMetric = recipe.measurement_type === "metric";

  return {
    srm,
    og,
    fg,
    abv,
    ibu,
    strikeWater: isMetric ? gallonsToLiters(strikeWater) : strikeWater,
    hotLiquor: isMetric ? gallonsToLiters(hotLiquor) : hotLiquor,
    waterLoss: isMetric ? gallonsToLiters(waterLoss) : waterLoss,
  };
};
