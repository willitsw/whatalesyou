import { BrewSettings } from "../types/brew-settings";
import { Recipe, RecipeDetailed } from "../types/recipe";

export const gallonsToLiters = (gallons: number): number => {
  const rawLiters = gallons * 3.78541;
  return parseFloat(rawLiters.toFixed(2));
};

export const litersToGallons = (liters: number): number => {
  const rawGallons = liters / 3.78541;
  return parseFloat(rawGallons.toFixed(2));
};

export const poundsToKilograms = (pounds: number): number => {
  const rawKg = pounds / 2.205;
  return parseFloat(rawKg.toFixed(2));
};

export const kilogramsToPounds = (kilograms: number): number => {
  const rawLb = kilograms * 2.205;
  return parseFloat(rawLb.toFixed(2));
};

export const ouncesToGrams = (ounces: number): number => {
  const rawGrams = ounces * 28.35;
  return parseFloat(rawGrams.toFixed(2));
};

export const gramsToOunces = (grams: number): number => {
  const rawOz = grams / 28.35;
  return parseFloat(rawOz.toFixed(2));
};

export const quartPoundsToLiterKilos = (quartPounds: number) => {
  const rawLiterKilos = quartPounds * 2.086;
  return parseFloat(rawLiterKilos.toFixed(1));
};

export const literKilosToQuartPounds = (literKilos: number) => {
  const rawQuartPounds = literKilos / 2.086;
  return parseFloat(rawQuartPounds.toFixed(1));
};

export const recipeToMetric = (recipe: RecipeDetailed): RecipeDetailed => {
  recipe.hops.forEach((hop) => {
    if (hop.amount_type === "oz") {
      hop.amount = ouncesToGrams(hop.amount);
    }
  });

  recipe.fermentables.forEach((fermentable) => {
    if (fermentable.amount_type === "lb") {
      fermentable.amount = poundsToKilograms(fermentable.amount);
    }
  });

  return {
    ...recipe,
    batch_size:
      recipe.measurement_type === "metric"
        ? recipe.batch_size
        : gallonsToLiters(recipe.batch_size),
  };
};

export const recipeToImperial = (recipe: RecipeDetailed): RecipeDetailed => {
  recipe?.hops?.forEach((hop) => {
    if (hop.amount_type === "g") {
      hop.amount = gramsToOunces(hop.amount);
    }
  });

  recipe?.fermentables?.forEach((fermentable) => {
    if (fermentable.amount_type === "kg") {
      fermentable.amount = kilogramsToPounds(fermentable.amount);
    }
  });

  return {
    ...recipe,
    batch_size:
      recipe.measurement_type === "imperial"
        ? recipe.batch_size
        : litersToGallons(recipe.batch_size),
  };
};

export const brewSettingsToMetric = (
  imperialBrewSettings: BrewSettings
): BrewSettings => {
  return {
    ...imperialBrewSettings,
    batch_size: gallonsToLiters(imperialBrewSettings.batch_size),
    water_loss_per_boil_unit: gallonsToLiters(
      imperialBrewSettings.water_loss_per_boil_unit
    ),
    water_loss_fermentor_trub: gallonsToLiters(
      imperialBrewSettings.water_loss_fermentor_trub
    ),
    water_loss_kettle_trub: gallonsToLiters(
      imperialBrewSettings.water_loss_kettle_trub
    ),
    water_loss_per_grain_unit: quartPoundsToLiterKilos(
      imperialBrewSettings.water_loss_per_grain_unit
    ),
    mash_thickness_target: quartPoundsToLiterKilos(
      imperialBrewSettings.mash_thickness_target
    ),
  };
};

export const brewSettingsToImperial = (
  metricBrewSettings: BrewSettings
): BrewSettings => {
  return {
    ...metricBrewSettings,
    batch_size: litersToGallons(metricBrewSettings.batch_size),
    water_loss_per_boil_unit: litersToGallons(
      metricBrewSettings.water_loss_per_boil_unit
    ),
    water_loss_fermentor_trub: litersToGallons(
      metricBrewSettings.water_loss_fermentor_trub
    ),
    water_loss_kettle_trub: litersToGallons(
      metricBrewSettings.water_loss_kettle_trub
    ),
    water_loss_per_grain_unit: literKilosToQuartPounds(
      metricBrewSettings.water_loss_per_grain_unit
    ),
    mash_thickness_target: literKilosToQuartPounds(
      metricBrewSettings.mash_thickness_target
    ),
  };
};
