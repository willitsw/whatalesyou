import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Content from "../../components/content/content";
import {
  Form,
  Button,
  Space,
  Divider,
  Affix,
  message,
  Col,
  Row,
  Tabs,
} from "antd";
import { getStats } from "../../utils/beer-math";
import GeneralInfo from "./general/general-info";
import StatsSection from "./statistics/stats";
import { setPageIsClean } from "../../redux/global-modals";
import React from "react";
import Ingredients from "./ingredients/ingredients";
import { useAnalytics } from "../../utils/analytics";
import dayjs from "dayjs";
import { Ingredient, IngredientType, RecipeDetailed } from "../../types/recipe";
import { Stats } from "../../types/stats";
import { useAppDispatch } from "../../redux/store";
import { v4 as uuid } from "uuid";
import { useCreateUpdateRecipe, useGetRecipeById } from "../../utils/api-calls";
import { useCurrentUser } from "../../components/user-context/user-context";
import brewSettings from "../brew-settings/brew-settings";
import { UserResponse } from "../../types/user";

const getDefaultRecipe = (user: UserResponse): RecipeDetailed => ({
  id: uuid(),
  name: "New Recipe",
  description: "",
  author:
    user.first_name && user.last_name
      ? `${user.first_name} ${user.last_name}`
      : user.email,
  batch_size: user.settings.batch_size,
  owner: user.id,
  type: "all_grain",
  measurement_type: user.settings.measurement_type,
  efficiency: user.settings.brewhouse_efficiency,
  created_at: dayjs().toISOString(),
  updated_at: dayjs().toISOString(),
  chemistry: [],
  cultures: [],
  fermentables: [],
  hops: [],
  non_fermentables: [],
});

const duplicateRecipe = (oldRecipe: RecipeDetailed): RecipeDetailed => {
  const newRecipeId = uuid();
  return {
    ...oldRecipe,
    id: newRecipeId,
    name: `Copy of ${oldRecipe.name}`,
    created_at: dayjs().toISOString(),
    updated_at: dayjs().toISOString(),
    chemistry: oldRecipe.chemistry.map((c) => ({
      ...c,
      recipe: newRecipeId,
      id: null,
    })),
    fermentables: oldRecipe.fermentables.map((c) => ({
      ...c,
      recipe: newRecipeId,
      id: null,
    })),
    cultures: oldRecipe.cultures.map((c) => ({
      ...c,
      recipe: newRecipeId,
      id: null,
    })),
    hops: oldRecipe.hops.map((c) => ({
      ...c,
      recipe: newRecipeId,
      id: null,
    })),
  };
};

const getDefaultStats = (): Stats => ({
  abv: 0,
  ibu: 0,
  og: 0,
  fg: 0,
  srm: 0,
  strikeWater: 0,
  hotLiquor: 0,
  waterLoss: 0,
});

const RecipeDetailPage = () => {
  const { user } = useCurrentUser();
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [stats, setStats] = useState<Stats>(getDefaultStats());
  const [isDesktop] = useState<boolean>(
    window.matchMedia("(min-width: 1200px)").matches
  );
  const { fireAnalyticsEvent } = useAnalytics();
  const [workingRecipe, setWorkingRecipe] = useState<RecipeDetailed>();

  const { data: recipe, isLoading: recipeIsLoading } = useGetRecipeById(id);

  const { mutateAsync: createUpdateRecipe } =
    useCreateUpdateRecipe(workingRecipe);

  const isLoading = recipeIsLoading;

  if (!workingRecipe && !recipeIsLoading && user) {
    if (location.pathname.includes("duplicate") && recipe) {
      setWorkingRecipe(duplicateRecipe(recipe));
    } else if (location.pathname.includes("new")) {
      setWorkingRecipe(getDefaultRecipe(user));
    } else if (location.pathname.includes("edit") && recipe) {
      setWorkingRecipe(recipe);
    }
  }

  useEffect(() => {
    if (workingRecipe && brewSettings) {
      setStats(getStats(workingRecipe, user.settings));
    } else {
      setStats(getDefaultStats());
    }
  }, [workingRecipe, brewSettings]);

  const handleSave = async () => {
    await createUpdateRecipe();
    dispatch(setPageIsClean(true));
    message.success(`${workingRecipe?.name} has been saved.`);
    fireAnalyticsEvent("Recipe Saved", { recipeId: workingRecipe.id });
  };

  const goBackToRecipeList = () => {
    navigate("/recipes/list/");
  };

  const handleFieldChange = (value: any, key: any) => {
    dispatch(setPageIsClean(false));
    const newRecipe = { ...workingRecipe };
    newRecipe[key] = value;
    setWorkingRecipe(newRecipe);
  };

  const handleUpdateIngredient = (newIngredient: Ingredient) => {
    const updatedRecipe: RecipeDetailed = { ...workingRecipe };

    const ingredientIdToUpdate = updatedRecipe[
      newIngredient.ingredient_type
    ].findIndex(({ id }) => newIngredient.id === id);

    if (ingredientIdToUpdate >= 0 && newIngredient.id) {
      updatedRecipe[newIngredient.ingredient_type][ingredientIdToUpdate] =
        newIngredient;
    } else {
      updatedRecipe[newIngredient.ingredient_type].push(newIngredient as any);
    }

    setWorkingRecipe(updatedRecipe);
  };

  const handleDeleteIngredient = (idToDelete: string, type: IngredientType) => {
    const updatedRecipe: RecipeDetailed = { ...workingRecipe };
    updatedRecipe[type] = updatedRecipe[type].filter(
      (ingredient) => ingredient.id !== idToDelete
    ) as any;
    setWorkingRecipe(updatedRecipe);
  };

  const getLayout = () => {
    const formSections = (
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "General Info",
            children: (
              <GeneralInfo
                onValuesChange={handleFieldChange}
                recipe={workingRecipe}
              />
            ),
          },
          {
            key: "2",
            label: "Ingredients",
            children: (
              <Ingredients
                recipe={workingRecipe}
                onIngredientChange={handleUpdateIngredient}
                onIngredientDelete={handleDeleteIngredient}
              />
            ),
          },
        ]}
      />
    );

    if (isDesktop) {
      return (
        <Row justify="start" gutter={[24, 0]}>
          <Col xs={24} sm={24} md={24} lg={16} xl={16}>
            {formSections}
          </Col>
          <Col xs={0} sm={0} md={0} lg={8} xl={8}>
            <Affix offsetTop={10}>
              <StatsSection stats={stats} recipe={workingRecipe} />
            </Affix>
          </Col>
        </Row>
      );
    }

    return (
      <>
        {formSections}
        <StatsSection stats={stats} recipe={workingRecipe} />
        <Divider />
      </>
    );
  };

  return (
    <Content
      isLoading={isLoading}
      pageTitle={!isLoading ? workingRecipe?.name ?? "" : ""}
    >
      {getLayout()}
      <Affix offsetBottom={10} style={{ float: "right" }}>
        <Space>
          <Form.Item>
            <Button type="primary" onClick={handleSave}>
              Save
            </Button>
          </Form.Item>
          <Form.Item>
            <Button onClick={goBackToRecipeList}>Back to Recipe List</Button>
          </Form.Item>
        </Space>
      </Affix>
    </Content>
  );
};

export default RecipeDetailPage;
