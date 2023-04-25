import {
  Chemistry,
  Culture,
  Fermentable,
  Hop,
  Ingredient,
  NonFermentable,
} from "../types/recipe";
import { Step } from "../types/shared";

const sortAmountDescending = (a: Ingredient, b: Ingredient) => {
  if (a.amount > b.amount) {
    return -1;
  } else if (a.amount < b.amount) {
    return 1;
  } else {
    return 0;
  }
};

const sortTimeDescending = (a: Ingredient, b: Ingredient) => {
  if (a.timing > b.timing) {
    return -1;
  } else if (a.timing < b.timing) {
    return 1;
  } else {
    return 0;
  }
};

const sortTimeAscending = (a: Ingredient, b: Ingredient) => {
  if (a.timing < b.timing) {
    return -1;
  } else if (a.timing > b.timing) {
    return 1;
  } else {
    return 0;
  }
};

export const sortIngredientsByStep = (
  ingredients: Ingredient[]
): Record<Step, Ingredient[]> => {
  const sortedIngredients: Record<Step, Ingredient[]> = ingredients.reduce(
    (returnValue, currentValue) => {
      returnValue[currentValue.step].push(currentValue);
      return returnValue;
    },
    { strikewater: [], mash: [], boil: [], fermentor: [], bottle: [] }
  );

  sortedIngredients.strikewater.sort(sortAmountDescending);
  sortedIngredients.mash.sort(sortAmountDescending);
  sortedIngredients.boil.sort(sortTimeDescending);
  sortedIngredients.fermentor.sort(sortTimeAscending);
  sortedIngredients.bottle.sort(sortAmountDescending);

  return sortedIngredients;
};
