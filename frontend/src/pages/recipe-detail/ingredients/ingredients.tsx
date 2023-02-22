import {
  Avatar,
  Button,
  ConfigProvider,
  Descriptions,
  Divider,
  List,
  Space,
  Tooltip,
  Typography,
  Modal,
} from "antd";
import React, { useState } from "react";
import hop from "./hop.png";
import chemical from "./chemical.png";
import grain from "./grain.png";
import ingredient from "./ingredient.png";
import yeast from "./yeast.png";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import IngredientModal from "./ingredient-modal";
import { v4 as uuid } from "uuid";
import { useAppDispatch, useAppSelector } from "../../../redux/store";
import {
  selectCurrentRecipe,
  selectIngredientList,
  selectSortedIngredients,
  setCurrentRecipe,
} from "../../../redux/recipe";
import {
  FermentableTypeLookup,
  MeasurementType,
  Step,
} from "../../../types/shared";
import {
  Culture,
  CultureFormLookup,
  Fermentable,
  Hop,
  Ingredient,
  IngredientType,
  RecipeDetailed,
} from "../../../types/recipe";

interface StepConfig {
  title: string;
  step: Step;
  items: Ingredient[];
}

interface IngredientsProps {
  measurementType: MeasurementType;
}

const ingredientIcons: Record<IngredientType, any> = {
  cultures: yeast,
  fermentables: grain,
  hops: hop,
  non_fermentables: ingredient,
  chemistry: chemical,
};

const Ingredients = ({ measurementType }: IngredientsProps) => {
  const [selectedIngredientId, setSelectedIngredientId] = useState<any>(null);
  const [ingredientToDelete, setIngredientToDelete] =
    useState<Ingredient>(null);

  const sortedIngredients = useAppSelector(selectSortedIngredients);
  const ingredientList = useAppSelector(selectIngredientList);
  const recipe = useAppSelector(selectCurrentRecipe);

  const dispatch = useAppDispatch();

  const steps: StepConfig[] = [
    {
      title: "Strike Water Additions",
      step: "strikewater",
      items: sortedIngredients.strikewater,
    },
    {
      title: "Mash Additions",
      step: "mash",
      items: sortedIngredients.mash,
    },
    {
      title: "Boil Additions",
      step: "boil",
      items: sortedIngredients.boil,
    },
    {
      title: "Fermentor Additions",
      step: "fermentor",
      items: sortedIngredients.fermentor,
    },
    {
      title: "Packaging Additions",
      step: "bottle",
      items: sortedIngredients.bottle,
    },
  ];

  const handleUpdateIngredient = (newIngredient: Ingredient) => {
    const updatedRecipe: RecipeDetailed = { ...recipe };
    const ingredientIdToUpdate = ingredientList.find(
      ({ id }) => newIngredient.id === id
    )?.id;

    if (ingredientIdToUpdate) {
      const indexToUpdate = updatedRecipe[
        newIngredient.ingredient_type
      ].findIndex((oldIngredient) => oldIngredient.id === ingredientIdToUpdate);
      updatedRecipe[newIngredient.ingredient_type][indexToUpdate] =
        newIngredient;
    } else {
      updatedRecipe[newIngredient.ingredient_type].push(newIngredient as any);
    }

    dispatch(setCurrentRecipe(updatedRecipe));
  };

  const handleDeleteClick = () => {
    const updatedRecipe: RecipeDetailed = { ...recipe };
    updatedRecipe[ingredientToDelete.ingredient_type] = updatedRecipe[
      ingredientToDelete.ingredient_type
    ].filter((i) => i.id !== ingredientToDelete.id) as any;

    dispatch(setCurrentRecipe(updatedRecipe));
  };

  const formatListTitle = (text: string, step: Step) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography.Title level={4}>{text}</Typography.Title>
      <Button
        style={{ marginLeft: "15px" }}
        type="primary"
        onClick={() => setSelectedIngredientId(step)}
      >
        Add Item
      </Button>
    </div>
  );

  const getTiming = (step: Ingredient) => {
    if (step.step === "boil") {
      return (
        <Descriptions.Item label="Timing">{step.timing} min</Descriptions.Item>
      );
    } else if (step.step === "fermentor") {
      return (
        <Descriptions.Item label="Timing">{step.timing} days</Descriptions.Item>
      );
    }
    return null;
  };

  const getTypeSpecificDetails = (step: Ingredient) => {
    switch (step.ingredient_type) {
      case "chemistry":
        return (
          <Descriptions.Item label="Amount">{`${step.amount} ${step.amount_type}`}</Descriptions.Item>
        );
      case "fermentables":
        const fermentable = { ...step } as Fermentable;
        return (
          <>
            <Descriptions.Item label="Amount">{`${fermentable.amount} ${fermentable.amount_type}`}</Descriptions.Item>
            <Descriptions.Item label="Lovibond">
              {fermentable.lovibond}
            </Descriptions.Item>
            <Descriptions.Item label="Fermentable Type">
              {FermentableTypeLookup[fermentable.type]}
            </Descriptions.Item>
            <Descriptions.Item label="Gravity">
              {fermentable.potential}
            </Descriptions.Item>
          </>
        );
      case "hops":
        const hop = { ...step } as Hop;
        return (
          <>
            <Descriptions.Item label="Amount">{`${hop.amount} ${hop.amount_type}`}</Descriptions.Item>
            <Descriptions.Item label="Alpha Acid">
              {hop.alpha_acid}
            </Descriptions.Item>
          </>
        );
      case "cultures":
        const culture = { ...step } as Culture;
        return (
          <>
            <Descriptions.Item label="Amount">{`${culture.amount} ${culture.amount_type}`}</Descriptions.Item>
            <Descriptions.Item label="Attenuation">
              {culture.attenuation}%
            </Descriptions.Item>
            <Descriptions.Item label="Yeast Type">
              {CultureFormLookup[culture.form]}
            </Descriptions.Item>
          </>
        );
      case "non_fermentables":
        return (
          <>
            <Descriptions.Item label="Amount">{`${step.amount} ${step.amount_type}`}</Descriptions.Item>
          </>
        );
    }
  };

  const getDetails = (item: Ingredient) => {
    return (
      <Descriptions
        title={
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            {item.name}
            <Space>
              <Tooltip title="Edit">
                <Button
                  shape="circle"
                  icon={<EditOutlined />}
                  onClick={() => setSelectedIngredientId(item.id)}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  shape="circle"
                  icon={<DeleteOutlined />}
                  onClick={() => setIngredientToDelete(item)}
                />
              </Tooltip>
            </Space>
          </div>
        }
      >
        {getTiming(item)}
        {getTypeSpecificDetails(item)}
        {item.notes && (
          <Descriptions.Item label="Notes">{item.notes}</Descriptions.Item>
        )}
      </Descriptions>
    );
  };

  return (
    <ConfigProvider renderEmpty={() => null}>
      {steps.map(({ title, items, step }, index) => {
        return (
          <div key={index}>
            <List
              header={formatListTitle(title, step)}
              itemLayout="horizontal"
              dataSource={items}
              renderItem={(item: Ingredient) => (
                <List.Item>
                  <List.Item.Meta
                    avatar={
                      <Avatar src={ingredientIcons[item.ingredient_type]} />
                    }
                    description={getDetails(item)}
                  />
                </List.Item>
              )}
            />
            <Divider />
          </div>
        );
      })}
      <IngredientModal
        handleCancel={() => setSelectedIngredientId(null)}
        ingredientId={selectedIngredientId}
        measurementType={measurementType}
      />

      <Modal
        title="Delete Ingredient?"
        onCancel={() => setIngredientToDelete(null)}
        onOk={handleDeleteClick}
        open={!!ingredientToDelete}
      >
        <>Are you sure you want to delete this ingredient?</>
      </Modal>
    </ConfigProvider>
  );
};

export default Ingredients;
