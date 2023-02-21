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
import { useAppSelector } from "../../../redux/store";
import { selectSortedIngredients } from "../../../redux/recipe";
import { MeasurementType } from "../../../types/shared";
import { Culture, Fermentable, Hop, Ingredient } from "../../../types/recipe";

interface IngredientsProps {
  measurementType: MeasurementType;
  setIngredients: (values: any) => void;
}

const ingredientIcons = {
  Culture: yeast,
  Fermentable: grain,
  Hop: hop,
  Misc: ingredient,
  Chemistry: chemical,
};

const Ingredients = ({ measurementType, setIngredients }: IngredientsProps) => {
  const [selectedIngredientId, setSelectedIngredientId] =
    useState<string>(null);
  const [ingredientToDelete, setIngredientToDelete] = useState<string>(null);

  const sortedIngredients = useAppSelector(selectSortedIngredients);

  const steps = [
    {
      title: "Strike Water Additions",
      step: "StrikeWater",
      items: sortedIngredients.strikewater,
    },
    {
      title: "Mash Additions",
      step: "Mash",
      items: sortedIngredients.mash,
    },
    {
      title: "Boil Additions",
      step: "Boil",
      items: sortedIngredients.boil,
    },
    {
      title: "Fermentor Additions",
      step: "Fermentor",
      items: sortedIngredients.fermentor,
    },
    {
      title: "Packaging Additions",
      step: "Bottle",
      items: sortedIngredients.bottle,
    },
  ];

  const handleUpdateRecipe = (ingredient: Ingredient) => {
    // const ingredientToUpdate = ingredients.find(
    //   ({ id }) => selectedIngredientId === id
    // );
    // ingredient.id = ingredientToUpdate?.id ?? uuid();
    // const newIngredients = [...ingredients];
    // const ingredientIndexToReplace = newIngredients.findIndex(
    //   ({ id }) => id === ingredient.id
    // );
    // if (ingredientIndexToReplace !== -1) {
    //   newIngredients.splice(ingredientIndexToReplace, 1, ingredient);
    // } else {
    //   newIngredients.push(ingredient);
    // }
    // setIngredients(newIngredients);
    // setSelectedIngredientId(null);
  };

  const handleDeleteClick = () => {
    // const newRawIngredients = [...ingredients].filter(
    //   (ingredient) => ingredient.id !== ingredientToDelete
    // );
    // setIngredients(newRawIngredients);
    // setIngredientToDelete(null);
  };

  const formatListTitle = (text: string, step: string) => (
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
      case "fermentable":
        const fermentable = { ...step } as Fermentable;
        return (
          <>
            <Descriptions.Item label="Amount">{`${fermentable.amount} ${fermentable.amount_type}`}</Descriptions.Item>
            <Descriptions.Item label="Lovibond">
              {fermentable.lovibond}
            </Descriptions.Item>
            <Descriptions.Item label="Fermentable Type">
              {fermentable.type}
            </Descriptions.Item>
            <Descriptions.Item label="Gravity">
              {fermentable.potential}
            </Descriptions.Item>
          </>
        );
      case "hop":
        const hop = { ...step } as Hop;
        return (
          <>
            <Descriptions.Item label="Amount">{`${hop.amount} ${hop.amount_type}`}</Descriptions.Item>
            <Descriptions.Item label="Alpha Acid">
              {hop.alpha_acid}
            </Descriptions.Item>
          </>
        );
      case "culture":
        const culture = { ...step } as Culture;
        return (
          <>
            <Descriptions.Item label="Amount">{`${culture.amount} ${culture.amount_type}`}</Descriptions.Item>
            <Descriptions.Item label="Attenuation">
              {culture.attenuation}%
            </Descriptions.Item>
            <Descriptions.Item label="Yeast Type">
              {culture.form}
            </Descriptions.Item>
          </>
        );
      case "non_fermentable":
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
                  // onClick={() => setSelectedIngredientId(item.id)}
                />
              </Tooltip>
              <Tooltip title="Delete">
                <Button
                  shape="circle"
                  icon={<DeleteOutlined />}
                  // onClick={() => setIngredientToDelete(item.id)}
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
                    // avatar={<Avatar src={ingredientIcons[item.type]} />}
                    description={getDetails(item)}
                  />
                </List.Item>
              )}
            />
            <Divider />
          </div>
        );
      })}
      {/* {selectedIngredientId && ( */}
      {/* <IngredientModal
        handleCancel={() => setSelectedIngredientId(null)}
        ingredientId={selectedIngredientId}
        ingredientList={ingredients}
        updateRecipe={handleUpdateRecipe}
        measurementType={measurementType}
      /> */}

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
