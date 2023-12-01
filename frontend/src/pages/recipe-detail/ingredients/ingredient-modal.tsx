import { AutoComplete, Form, Input, InputNumber, Modal, Select } from "antd";
import React, { useEffect } from "react";
import DefaultGrains from "../../../data/default-grains";
import DefaultHops from "../../../data/default-hops";
import { v4 as uuid } from "uuid";
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
import { useCurrentUser } from "../../../components/user-context/user-context";
import { useForm, useWatch } from "antd/es/form/Form";
import { FormFlex } from "../../../components/form-layouts/form-flex";
import { BrewSettings } from "../../../types/brew-settings";
interface IngredientModalProps {
  handleCancel: () => void;
  commitIngredientChange: (newIngredient: Ingredient) => void;
  ingredient?: Ingredient;
  step: Step;
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

const addDefaultsForType = (
  type: IngredientType,
  settings: BrewSettings,
  recipeId: string
): Ingredient => {
  const defaults = {
    recipe: recipeId,
    ingredient_type: type,
  };
  switch (type) {
    case "chemistry":
      return {
        ...defaults,
        amount_type: "g",
      } as Chemistry;
    case "cultures":
      return {
        ...defaults,
        amount_type: "each",
        form: "dry",
        attenuation: 75,
        timing: 1,
      } as Culture;
    case "fermentables":
      return {
        ...defaults,
        amount_type: settings.measurement_type === "imperial" ? "lb" : "kg",
      } as Fermentable;
    case "hops":
      return {
        ...defaults,
        amount_type: settings.measurement_type === "imperial" ? "oz" : "g",
        timing: 60,
      } as Hop;
    case "non_fermentables":
      return {
        ...defaults,
        amount_type: "each",
      } as NonFermentable;
    default:
      throw Error("Bad Step!");
  }
};

const IngredientModal = ({
  handleCancel,
  commitIngredientChange,
  ingredient,
  step,
  recipeId,
}: IngredientModalProps) => {
  const { user } = useCurrentUser();
  const [form] = useForm<Ingredient>();
  const watchedStep = useWatch("step", form);
  const watchedIngredientType = useWatch("ingredient_type", form);

  useEffect(() => {
    let initialValues: Ingredient;
    if (ingredient) {
      initialValues = { step, ...ingredient };
    } else {
      const type = watchedIngredientType ?? defaultTypeForStep[step];
      const defaults = addDefaultsForType(type, user.settings, recipeId);
      initialValues = { step, ...defaults };
    }
    form.setFields(
      Object.entries(initialValues).map((value) => {
        return {
          name: value[0],
          value: value[1],
        };
      })
    );
  }, []);

  const handleChangeIngredientType = () => {
    const savedIngredientType = form.getFieldValue("ingredient_type");
    const savedStep = form.getFieldValue("step");

    form.resetFields();
    form.setFieldValue("ingredient_type", savedIngredientType);
    form.setFieldValue("step", savedStep);
    const defaultsForStep = addDefaultsForType(
      savedIngredientType,
      user.settings,
      recipeId
    );
    form.setFields(
      Object.entries(defaultsForStep).map((value) => {
        return {
          name: value[0],
          value: value[1],
        };
      })
    );
  };

  const handleHopNameSelect = (selection: string) => {
    const defaultHop = DefaultHops.find((hop) => hop.name === selection);

    if (defaultHop) {
      form.setFieldValue("alpha_acid", defaultHop.alpha);
      form.setFieldValue("name", defaultHop.name);
    }
  };

  const handleGrainNameSelect = (selection: string) => {
    const defaultGrain = DefaultGrains.find(
      (grain) => grain.name === selection
    );

    if (defaultGrain) {
      form.setFieldValue("lovibond", defaultGrain.lovibond);
      form.setFieldValue("potential", defaultGrain.gravity);
      form.setFieldValue("type", defaultGrain.type);
      form.setFieldValue("name", defaultGrain.name);
    }
  };

  const handleFormSubmit = async () => {
    try {
      await form.validateFields();
      const data = form.getFieldsValue(true);
      commitIngredientChange({
        ...data,
        id: ingredient?.id ?? uuid(),
      });
    } catch (e) {
      console.log("form is invalid!", e);
    }
  };

  const renderTypeSpecificElements = () => {
    const type =
      form.getFieldValue("ingredient_type") ?? defaultTypeForStep[step];

    switch (type) {
      case "fermentables":
        return (
          <FormFlex>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Required" }]}
            >
              <AutoComplete
                options={grainOptions}
                style={{ width: 220 }}
                filterOption={(inputValue, option) =>
                  option?.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
                placeholder="Grain Name"
                onChange={handleGrainNameSelect}
              />
            </Form.Item>
            <Form.Item label="Type" name="type" rules={[{ required: true }]}>
              <Select style={{ width: 150 }}>
                {Object.entries(FermentableTypeLookup).map(([key, label]) => (
                  <Select.Option key={key} value={key}>
                    {label}
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber
                min="0"
                max="100"
                step="0.1"
                style={{ width: 105 }}
              />
            </Form.Item>
            <Form.Item
              label="Amount Type"
              name="amount_type"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select style={{ width: 80 }}>
                <Select.Option value="lb">lb</Select.Option>
                <Select.Option value="kg">kg</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Color"
              name="lovibond"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber
                min="0"
                max="100"
                step="1"
                style={{ width: 105 }}
                addonAfter="lov"
              />
            </Form.Item>
            <Form.Item
              label="Gravity"
              name="potential"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber
                stringMode
                min="1"
                max="2"
                step="0.001"
                style={{ width: 84 }}
              />
            </Form.Item>
          </FormFlex>
        );
      case "hops":
        return (
          <FormFlex>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Required" }]}
            >
              <AutoComplete
                options={hopOptions}
                style={{ width: 220 }}
                filterOption={(inputValue, option) =>
                  option?.value
                    .toUpperCase()
                    .indexOf(inputValue.toUpperCase()) !== -1
                }
                placeholder="Hop Name"
                onChange={handleHopNameSelect}
              />
            </Form.Item>
            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber
                min="0"
                max="100"
                step="0.5"
                style={{ width: 105 }}
              />
            </Form.Item>
            <Form.Item
              label="Amount Type"
              name="amount_type"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select style={{ width: 80 }}>
                <Select.Option value="oz">oz</Select.Option>
                <Select.Option value="g">g</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item
              label="Bitterness"
              name="alpha_acid"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber
                min="0"
                max="25"
                step="0.1"
                style={{ width: 105 }}
                addonAfter="AA"
              />
            </Form.Item>
          </FormFlex>
        );
      case "cultures":
        return (
          <FormFlex>
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input style={{ width: 220 }} />
            </Form.Item>
            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber min="0" max="100" step="1" style={{ width: 105 }} />
            </Form.Item>
            <Form.Item
              label="Amount Type"
              name="amount_type"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select style={{ width: 80 }}>
                {Object.entries(IngredientAmountTypeLookup).map(
                  ([key, label]) => (
                    <Select.Option key={key} value={key}>
                      {label}
                    </Select.Option>
                  )
                )}
              </Select>
            </Form.Item>
            <Form.Item
              label="Attenuation"
              name="attenuation"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber
                style={{ width: 120 }}
                min="0"
                max="100"
                step="1"
                addonAfter="%"
              />
            </Form.Item>
            <Form.Item
              label="Yeast Form"
              name="form"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select style={{ width: 120 }}>
                <Select.Option value="dry">Dry</Select.Option>
                <Select.Option value="liquid">Liquid</Select.Option>
              </Select>
            </Form.Item>
          </FormFlex>
        );
      case "non_fermentables":
        return (
          <FormFlex>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Required" }]}
            >
              <Input style={{ width: 220 }} />
            </Form.Item>
            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber min="0" max="100" step="1" style={{ width: 105 }} />
            </Form.Item>
            <Form.Item
              label="Amount Type"
              name="amount_type"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select style={{ width: 80 }}>
                {Object.entries(IngredientAmountTypeLookup).map(
                  ([key, label]) => (
                    <Select.Option key={key} value={key}>
                      {label}
                    </Select.Option>
                  )
                )}
              </Select>
            </Form.Item>
          </FormFlex>
        );
      case "chemistry":
        return (
          <FormFlex>
            <Form.Item label="Name" name="name" rules={[{ required: true }]}>
              <Input style={{ width: 220 }} />
            </Form.Item>
            <Form.Item
              label="Amount"
              name="amount"
              rules={[{ required: true, message: "Required" }]}
            >
              <InputNumber min="0" max="100" step="1" style={{ width: 105 }} />
            </Form.Item>
            <Form.Item
              label="Amount Type"
              name="amount_type"
              rules={[{ required: true, message: "Required" }]}
            >
              <Select style={{ width: 80 }}>
                {Object.entries(IngredientAmountTypeLookup).map(
                  ([key, label]) => (
                    <Select.Option key={key} value={key}>
                      {label}
                    </Select.Option>
                  )
                )}
              </Select>
            </Form.Item>
          </FormFlex>
        );
      default:
        return null;
    }
  };

  return (
    <Modal
      title="Add/Edit Ingredient"
      onCancel={handleCancel}
      onOk={handleFormSubmit}
      destroyOnClose
      open
    >
      <Form
        form={form}
        name="ingredient-modal"
        onFinish={commitIngredientChange}
        autoComplete="off"
        layout="vertical"
      >
        <FormFlex>
          <Form.Item
            label="Brewing Step"
            name="step"
            rules={[{ required: true, message: "Required" }]}
            initialValue={step}
          >
            <Select style={{ width: 130 }}>
              {Object.entries(StepLookup).map(([key, label]) => (
                <Select.Option key={key} value={key}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          <Form.Item
            label="Ingredient Type"
            name="ingredient_type"
            rules={[{ required: true, message: "Required" }]}
          >
            <Select
              style={{ width: 150 }}
              onChange={handleChangeIngredientType}
            >
              {Object.entries(IngredientTypeLookup).map(([key, label]) => (
                <Select.Option key={key} value={key}>
                  {label}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
          {watchedStep !== "bottle" &&
            watchedStep !== "strikewater" &&
            watchedStep !== "mash" && (
              <Form.Item
                label="Timing"
                name="timing"
                rules={[{ required: true, message: "Required" }]}
              >
                <InputNumber
                  min={0}
                  style={{ width: 95 }}
                  addonAfter={watchedStep === "fermentor" ? "days" : "min"}
                />
              </Form.Item>
            )}
        </FormFlex>
        <Form.Item
          noStyle
          shouldUpdate={(prevValues, currentValues) =>
            prevValues.ingredient_type !== currentValues.ingredient_type
          }
        >
          {renderTypeSpecificElements()}
        </Form.Item>
        <FormFlex justify="center">
          <Form.Item label="Notes" name="notes">
            <Input.TextArea style={{ width: 300 }} />
          </Form.Item>
        </FormFlex>
      </Form>
    </Modal>
  );
};

export default IngredientModal;
