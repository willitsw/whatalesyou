import { AutoComplete, Input, InputNumber, Modal, Select } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { setPageIsClean } from "../../../redux/global-modals";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import DefaultGrains from "../../../data/default-grains";
import DefaultHops from "../../../data/default-hops";
import {
  Chemistry,
  Culture,
  Fermentable,
  Hop,
  Ingredient,
  IngredientType,
  IngredientTypeLookup,
  NonFermentable,
} from "../../../types/recipe";
import {
  FermentableTypeLookup,
  IngredientAmountTypeLookup,
  Step,
  StepLookup,
} from "../../../types/shared";
import ElementWithLabel from "../../../components/form-layouts/element-with-label";
import {
  UserContext,
  UserContextValue,
} from "../../../components/user-context/user-context";
interface IngredientModalProps {
  ingredientId: any;
  handleCancel: () => void;
  ingredientList: Ingredient[];
  commitIngredientChange: (newIngredient: Ingredient) => void;
  recipeId: string;
}

const grainOptions = DefaultGrains.map((grain) => {
  return {
    value: grain.name,
  };
});

const hopOptions = DefaultHops.map((hop) => {
  return {
    value: hop.name,
  };
});

const defaultTypeForStep: Record<Step, IngredientType> = {
  boil: "hops",
  bottle: "non_fermentables",
  fermentor: "cultures",
  mash: "fermentables",
  strikewater: "chemistry",
};

const IngredientModal = ({
  ingredientId,
  handleCancel,
  ingredientList,
  commitIngredientChange,
  recipeId,
}: IngredientModalProps) => {
  const dispatch = useAppDispatch();
  const { user }: UserContextValue = useContext(UserContext);
  const [ingredient, setIngredient] = useState<any>(null);

  useEffect(() => {
    const ingredientToUpdate = ingredientList.find(
      ({ id }) => ingredientId === id
    );
    if (ingredientToUpdate) {
      console.log("ingredient to update", ingredientToUpdate);
      setIngredient(ingredientToUpdate);
    } else {
      setIngredient({
        step: ingredientId,
        recipe: recipeId,
        ...addDefaultsForType(defaultTypeForStep[ingredientId]),
      });
    }
  }, [ingredientId]);

  const addDefaultsForType = (type: IngredientType) => {
    switch (type) {
      case "chemistry":
        return {
          ingredient_type: "chemistry",
          amount_type: "g",
        } as Chemistry;
      case "cultures":
        return {
          ingredient_type: "cultures",
          amount_type: "each",
          form: "dry",
          attenuation: 75,
          timing: 1,
        } as Culture;
      case "fermentables":
        return {
          ingredient_type: "fermentables",
          amount_type:
            user.settings.measurement_type === "imperial" ? "lb" : "kg",
        } as Fermentable;
      case "hops":
        return {
          ingredient_type: "hops",
          amount_type:
            user.settings.measurement_type === "imperial" ? "oz" : "g",
          timing: 60,
        } as Hop;
      case "non_fermentables":
        return {
          ingredient_type: "non_fermentables",
          amount_type: "each",
        } as NonFermentable;
      default:
        return {};
    }
  };

  const handleChangeIngredient = (value: any, key: any) => {
    dispatch(setPageIsClean(false));
    const newIngredient = { ...ingredient };
    newIngredient[key] = value;

    if (["step", "ingredient_type"].includes(key)) {
      setIngredient({
        step: newIngredient.step,
        ...addDefaultsForType(newIngredient.ingredient_type),
      });
    } else {
      setIngredient(newIngredient);
    }
  };

  const handleHopNameSelect = (selection: string) => {
    const defaultHop = DefaultHops.find((hop) => hop.name === selection);

    if (defaultHop) {
      const ingredientToUpdate = { ...ingredient } as Hop;
      ingredientToUpdate.alpha_acid = defaultHop.alpha;
      ingredientToUpdate.name = defaultHop.name;
      setIngredient(ingredientToUpdate);
    }
  };

  const handleGrainNameSelect = (selection: string) => {
    const defaultGrain = DefaultGrains.find(
      (grain) => grain.name === selection
    );

    if (defaultGrain) {
      const ingredientToUpdate = { ...ingredient } as Fermentable;
      ingredientToUpdate.name = defaultGrain.name;
      ingredientToUpdate.lovibond = defaultGrain.lovibond;
      ingredientToUpdate.potential = defaultGrain.gravity;
      ingredientToUpdate.type = defaultGrain.type;
      setIngredient(ingredientToUpdate);
    }
  };

  const handleCancelClick = () => {
    setIngredient(null);
    handleCancel();
  };

  const renderTypeSpecificElements = () => {
    switch (ingredient?.ingredient_type) {
      case "fermentables":
        return (
          <>
            <ElementWithLabel
              label="Name"
              formElement={
                <AutoComplete
                  value={ingredient?.name}
                  options={grainOptions}
                  style={{ width: 220 }}
                  filterOption={(inputValue, option) =>
                    option?.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                  onSelect={(selection: string) =>
                    handleGrainNameSelect(selection)
                  }
                  placeholder="Grain Name"
                />
              }
              orientation="column"
            />
            <ElementWithLabel
              label="Type"
              formElement={
                <Select
                  onChange={(value) => handleChangeIngredient(value, "type")}
                  value={ingredient?.type}
                  style={{ width: 150 }}
                >
                  {Object.entries(FermentableTypeLookup).map(([key, label]) => (
                    <Select.Option key={key} value={key}>
                      {label}
                    </Select.Option>
                  ))}
                </Select>
              }
              orientation="column"
            />
            <div style={{ display: "flex", flexDirection: "row", gap: 10 }}>
              <ElementWithLabel
                label="Amount"
                formElement={
                  <InputNumber
                    value={ingredient?.amount}
                    onChange={(value) =>
                      handleChangeIngredient(value, "amount")
                    }
                    min="0"
                    max="100"
                    step="0.1"
                    style={{ width: 105 }}
                  />
                }
                orientation="column"
              />
              <ElementWithLabel
                label="Amount Type"
                formElement={
                  <Select
                    value={ingredient?.amount_type}
                    onChange={(value) =>
                      handleChangeIngredient(value, "amount_type")
                    }
                    style={{ width: 100 }}
                  >
                    <Select.Option value="lb">lb</Select.Option>
                    <Select.Option value="kg">kg</Select.Option>
                  </Select>
                }
                orientation="column"
              />
            </div>
            <ElementWithLabel
              label="Color"
              formElement={
                <InputNumber
                  value={ingredient?.lovibond}
                  onChange={(value) =>
                    handleChangeIngredient(value, "lovibond")
                  }
                  min="0"
                  max="100"
                  step="1"
                  style={{ width: 105 }}
                  addonAfter="lov"
                />
              }
              orientation="column"
            />
            <ElementWithLabel
              label="Gravity"
              formElement={
                <InputNumber
                  value={ingredient?.potential}
                  onChange={(value) =>
                    handleChangeIngredient(value, "potential")
                  }
                  stringMode
                  min="1"
                  max="2"
                  step="0.001"
                  style={{ width: 84 }}
                />
              }
              orientation="column"
            />
          </>
        );
      case "hops":
        return (
          <>
            <ElementWithLabel
              label="Name"
              formElement={
                <AutoComplete
                  value={ingredient?.name}
                  options={hopOptions}
                  style={{ width: 220 }}
                  filterOption={(inputValue, option) =>
                    option?.value
                      .toUpperCase()
                      .indexOf(inputValue.toUpperCase()) !== -1
                  }
                  onSelect={(selection: string) =>
                    handleHopNameSelect(selection)
                  }
                  placeholder="Hop Name"
                />
              }
              orientation="column"
            />
            <ElementWithLabel
              label="Amount"
              formElement={
                <InputNumber
                  value={ingredient?.amount}
                  onChange={(value) => handleChangeIngredient(value, "amount")}
                  min="0"
                  max="100"
                  step="0.5"
                  style={{ width: 105 }}
                />
              }
              orientation="column"
            />
            <ElementWithLabel
              label="Amount Type"
              formElement={
                <Select
                  value={ingredient?.amount_type}
                  onChange={(value) =>
                    handleChangeIngredient(value, "amount_type")
                  }
                  style={{ width: 120 }}
                >
                  <Select.Option value="oz">oz</Select.Option>
                  <Select.Option value="g">g</Select.Option>
                </Select>
              }
              orientation="column"
            />
            <ElementWithLabel
              label="Bitterness"
              formElement={
                <InputNumber
                  value={ingredient?.alpha_acid}
                  onChange={(value) =>
                    handleChangeIngredient(value, "alpha_acid")
                  }
                  min="0"
                  max="25"
                  step="0.1"
                  style={{ width: 105 }}
                  addonAfter="AA"
                />
              }
              orientation="column"
            />
          </>
        );
      case "cultures":
        return (
          <>
            <ElementWithLabel
              label="Name"
              formElement={
                <Input
                  value={ingredient?.name}
                  onChange={(value) =>
                    handleChangeIngredient(value.target.value, "name")
                  }
                  style={{ width: 220 }}
                />
              }
              orientation="column"
            />
            <ElementWithLabel
              label="Amount"
              formElement={
                <InputNumber
                  value={ingredient?.amount}
                  onChange={(value) => handleChangeIngredient(value, "amount")}
                  min="0"
                  max="100"
                  step="1"
                  style={{ width: 105 }}
                />
              }
              orientation="column"
            />
            <ElementWithLabel
              label="Amount Type"
              formElement={
                <Select
                  value={ingredient?.amount_type}
                  onChange={(value) =>
                    handleChangeIngredient(value, "amount_type")
                  }
                  style={{ width: 120 }}
                >
                  {Object.entries(IngredientAmountTypeLookup).map(
                    ([key, label]) => (
                      <Select.Option key={key} value={key}>
                        {label}
                      </Select.Option>
                    )
                  )}
                </Select>
              }
              orientation="column"
            />
            <ElementWithLabel
              label="Attenuation"
              formElement={
                <InputNumber
                  value={ingredient?.attenuation}
                  onChange={(value) =>
                    handleChangeIngredient(value, "attenuation")
                  }
                  style={{ width: 120 }}
                  min="0"
                  max="100"
                  step="1"
                  addonAfter="%"
                />
              }
              orientation="column"
            />
            <ElementWithLabel
              label="Yeast Form"
              formElement={
                <Select
                  value={ingredient?.form}
                  onChange={(value) => handleChangeIngredient(value, "form")}
                  style={{ width: 120 }}
                >
                  <Select.Option value="dry">Dry</Select.Option>
                  <Select.Option value="liquid">Liquid</Select.Option>
                </Select>
              }
              orientation="column"
            />
          </>
        );
      case "non_fermentables":
        return (
          <>
            <ElementWithLabel
              label="Name"
              formElement={
                <Input
                  value={ingredient?.name}
                  onChange={(value) =>
                    handleChangeIngredient(value.target.value, "name")
                  }
                  style={{ width: 220 }}
                />
              }
              orientation="column"
            />
            <ElementWithLabel
              label="Amount"
              formElement={
                <InputNumber
                  value={ingredient?.amount}
                  onChange={(value) => handleChangeIngredient(value, "amount")}
                  min="0"
                  max="100"
                  step="1"
                  style={{ width: 105 }}
                />
              }
              orientation="column"
            />
            <ElementWithLabel
              label="Amount Type"
              formElement={
                <Select
                  value={ingredient?.amount_type}
                  onChange={(value) =>
                    handleChangeIngredient(value, "amount_type")
                  }
                  style={{ width: 120 }}
                >
                  {Object.entries(IngredientAmountTypeLookup).map(
                    ([key, label]) => (
                      <Select.Option key={key} value={key}>
                        {label}
                      </Select.Option>
                    )
                  )}
                </Select>
              }
              orientation="column"
            />
          </>
        );
      case "chemistry":
        return (
          <>
            <ElementWithLabel
              label="Name"
              formElement={
                <Input
                  value={ingredient?.name}
                  onChange={(value) =>
                    handleChangeIngredient(value.target.value, "name")
                  }
                  style={{ width: 220 }}
                />
              }
              orientation="column"
            />
            <ElementWithLabel
              label="Amount"
              formElement={
                <InputNumber
                  value={ingredient?.amount}
                  onChange={(value) => handleChangeIngredient(value, "amount")}
                  min="0"
                  max="100"
                  step="1"
                  style={{ width: 105 }}
                />
              }
              orientation="column"
            />
            <ElementWithLabel
              label="Amount Type"
              formElement={
                <Select
                  value={ingredient?.amount_type}
                  onChange={(value) =>
                    handleChangeIngredient(value, "amount_type")
                  }
                  style={{ width: 120 }}
                >
                  {Object.entries(IngredientAmountTypeLookup).map(
                    ([key, label]) => (
                      <Select.Option key={key} value={key}>
                        {label}
                      </Select.Option>
                    )
                  )}
                </Select>
              }
              orientation="column"
            />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title="Add/Edit Ingredient"
      open={!!ingredientId}
      onOk={() => {
        commitIngredientChange(ingredient);
        setIngredient(null);
      }}
      onCancel={handleCancelClick}
    >
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <ElementWithLabel
          label="Brewing Step"
          formElement={
            <Select
              value={ingredient?.step}
              onChange={(value) => handleChangeIngredient(value, "step")}
              style={{ width: 130 }}
            >
              {Object.entries(StepLookup).map(([key, label]) => (
                <Select.Option key={key} value={key}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          }
          orientation="column"
        />
        <ElementWithLabel
          label="Ingredient Type"
          formElement={
            <Select
              value={ingredient?.ingredient_type}
              onChange={(value) =>
                handleChangeIngredient(value, "ingredient_type")
              }
              style={{ width: 150 }}
            >
              {Object.entries(IngredientTypeLookup).map(([key, label]) => (
                <Select.Option key={key} value={key}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          }
          orientation="column"
        />
        {ingredient?.step !== "bottle" &&
          ingredient?.step !== "strikewater" &&
          ingredient?.step !== "mash" && (
            <ElementWithLabel
              label="Timing"
              formElement={
                <InputNumber
                  value={ingredient?.timing}
                  min={0}
                  style={{ width: 95 }}
                  addonAfter={ingredient?.step === "fermentor" ? "days" : "min"}
                  onChange={(value) => handleChangeIngredient(value, "timing")}
                />
              }
              orientation="column"
            />
          )}
        {renderTypeSpecificElements()}
        <ElementWithLabel
          label="Notes"
          formElement={
            <Input.TextArea
              value={ingredient?.notes}
              onChange={(value) =>
                handleChangeIngredient(value.target.value, "notes")
              }
              style={{ width: 300 }}
            />
          }
          orientation="column"
        />
      </div>
    </Modal>
  );
};

export default IngredientModal;
