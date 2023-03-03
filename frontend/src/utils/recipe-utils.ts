import {
  Chemistry,
  Culture,
  Fermentable,
  Hop,
  Ingredient,
  NonFermentable,
} from "../types/recipe";

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
): {
  StrikeWater: Ingredient[];
  Mash: Ingredient[];
  Boil: Ingredient[];
  Fermentor: Ingredient[];
  Bottle: Ingredient[];
} => {
  const sortedIngredients = ingredients.reduce(
    (returnValue, currentValue) => {
      returnValue[currentValue.step].push(currentValue);
      return returnValue;
    },
    { StrikeWater: [], Mash: [], Boil: [], Fermentor: [], Bottle: [] }
  );

  sortedIngredients.StrikeWater.sort(sortAmountDescending);
  sortedIngredients.Mash.sort(sortAmountDescending);
  sortedIngredients.Boil.sort(sortTimeDescending);
  sortedIngredients.Fermentor.sort(sortTimeAscending);
  sortedIngredients.Bottle.sort(sortAmountDescending);

  return sortedIngredients;
};
