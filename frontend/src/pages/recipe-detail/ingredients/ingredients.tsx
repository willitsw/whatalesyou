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
  FormInstance,
} from "antd";
import React, { useEffect, useState } from "react";
import hop from "./hop.png";
import chemical from "./chemical.png";
import grain from "./grain.png";
import ingredient from "./ingredient.png";
import yeast from "./yeast.png";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import IngredientModal from "./ingredient-modal";
import { FermentableTypeLookup, Step } from "../../../types/shared";
import {
  Culture,
  CultureFormLookup,
  Fermentable,
  Hop,
  Ingredient,
  IngredientType,
  RecipeDetailed,
} from "../../../types/recipe";
import { useWatch } from "antd/es/form/Form";

interface StepConfig {
  title: string;
  step: Step;
  items: Ingredient[];
}

interface IngredientsProps {
  form: FormInstance<RecipeDetailed>;
  onIngredientChange: (newIngredient: Ingredient) => void;
  onIngredientDelete: (ingredientId: string, type: IngredientType) => void;
}

interface IngredientSelectPayload {
  step: Step;
  ingredient?: Ingredient;
}

type SortedIngredients = Record<Step, Ingredient[]>;

const ingredientIcons: Record<IngredientType, any> = {
  cultures: yeast,
  fermentables: grain,
  hops: hop,
  non_fermentables: ingredient,
  chemistry: chemical,
};

const lookup = {
  strikewater: 0,
  mash: 1,
  boil: 2,
  fermentor: 3,
  bottle: 4,
};

const Ingredients = ({
  form,
  onIngredientChange,
  onIngredientDelete,
}: IngredientsProps) => {
  // const [selectedIngredientId, setSelectedIngredientId] = useState<any>(null);
  const [ingredientToDelete, setIngredientToDelete] =
    useState<Ingredient>(null);
  const [sortedIngredients, setSortedIngredients] = useState<StepConfig[]>([]);
  const [selectedIngredientData, setSelectedIngredientData] =
    useState<IngredientSelectPayload>(null);
  // const [ingredientList, setIngredientList] = useState<Ingredient[]>([]);
  const hops = useWatch("hops", { form, preserve: true });
  const chemistry = useWatch("chemistry", { form, preserve: true });
  const fermentables = useWatch("fermentables", { form, preserve: true });
  const nonFermentables = useWatch("non_fermentables", {
    form,
    preserve: true,
  });
  const cultures = useWatch("cultures", { form, preserve: true });

  useEffect(() => {
    const newSortedIngredients: StepConfig[] = [
      {
        title: "Strike Water",
        step: "strikewater",
        items: [],
      },
      {
        title: "Mash",
        step: "mash",
        items: [],
      },
      {
        title: "Boil",
        step: "boil",
        items: [],
      },
      {
        title: "Fermentor",
        step: "fermentor",
        items: [],
      },
      {
        title: "Packaging",
        step: "bottle",
        items: [],
      },
    ];

    hops?.forEach((hop) => {
      hop.ingredient_type = "hops";
      newSortedIngredients[lookup[hop.step]].items.push(hop);
    });
    fermentables?.forEach((fermentable) => {
      fermentable.ingredient_type = "fermentables";
      newSortedIngredients[lookup[fermentable.step]].items.push(fermentable);
    });
    cultures?.forEach((culture) => {
      culture.ingredient_type = "cultures";
      newSortedIngredients[lookup[culture.step]].items.push(culture);
    });
    nonFermentables?.forEach((non_fermentable) => {
      non_fermentable.ingredient_type = "non_fermentables";
      newSortedIngredients[lookup[non_fermentable.step]].items.push(
        non_fermentable
      );
    });
    chemistry?.forEach((chem) => {
      chem.ingredient_type = "chemistry";
      newSortedIngredients[lookup[chem.step]].items.push(chem);
    });

    setSortedIngredients(newSortedIngredients);
  }, [hops, fermentables, cultures, nonFermentables, chemistry]);

  const handleSelectIngredientToEdit = (step: Step, id?: string) => {
    const newIngredientData: IngredientSelectPayload = {
      step,
    };
    if (id) {
      newIngredientData.ingredient = sortedIngredients[lookup[step]].items.find(
        (ingredient) => id === ingredient.id
      );
    }
    setSelectedIngredientData(newIngredientData);
  };

  const formatListTitle = (text: string, step: Step) => (
    <div
      style={{
        display: "flex",
        justifyContent: "space-between",
      }}
    >
      <Typography.Title level={4}>{text} Additions</Typography.Title>
      <Button
        style={{ marginLeft: "15px" }}
        type="primary"
        onClick={() => handleSelectIngredientToEdit(step)}
      >
        Add {text} Ingredient
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

  const getDetails = (item: Ingredient, step: Step) => {
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
                  onClick={() => handleSelectIngredientToEdit(step, item.id)}
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
      {sortedIngredients.map(({ title, items, step }) => {
        return (
          <div key={step}>
            <List
              header={formatListTitle(title, step)}
              itemLayout="horizontal"
              dataSource={items}
              renderItem={(item: Ingredient) => (
                <List.Item key={item.id}>
                  <List.Item.Meta
                    avatar={
                      <Avatar src={ingredientIcons[item.ingredient_type]} />
                    }
                    description={getDetails(item, step)}
                  />
                </List.Item>
              )}
            />
            <Divider />
          </div>
        );
      })}
      {selectedIngredientData && (
        <IngredientModal
          handleCancel={() => setSelectedIngredientData(null)}
          commitIngredientChange={(newIngredient: Ingredient) => {
            onIngredientChange(newIngredient);
            setSelectedIngredientData(null);
          }}
          ingredient={selectedIngredientData.ingredient}
          step={selectedIngredientData.step}
          recipeId={form.getFieldValue("id")}
        />
      )}

      <Modal
        title="Delete Ingredient?"
        onCancel={() => setIngredientToDelete(null)}
        onOk={() => {
          onIngredientDelete(
            ingredientToDelete.id,
            ingredientToDelete.ingredient_type
          );
          setIngredientToDelete(null);
        }}
        open={!!ingredientToDelete}
      >
        <>Are you sure you want to delete this ingredient?</>
      </Modal>
    </ConfigProvider>
  );
};

export default Ingredients;
