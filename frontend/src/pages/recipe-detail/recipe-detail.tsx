import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import Content from "../../components/content/content";
import { getRecipeById, createUpdateRecipe } from "../../utils/api-calls";
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
import { selectBrewSettings } from "../../redux/brew-settings";
import React from "react";
import Ingredients from "./ingredients/ingredients";
import { useAnalytics } from "../../utils/analytics";
import dayjs from "dayjs";
import { Ingredient, IngredientType, RecipeDetailed } from "../../types/recipe";
import { Stats } from "../../types/stats";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import { v4 as uuid } from "uuid";
import { selectCurrentUser } from "../../redux/user";

const defaultRecipe = {
  id: uuid(),
  name: "New Recipe",
  description: "",
  author: "",
  batch_size: 5,
  owner: "",
  type: "all_grain",
  measurement_type: "imperial",
  efficiency: 70,
  created_at: dayjs().toISOString(),
  updated_at: dayjs().toISOString(),
  chemistry: [],
  cultures: [],
  fermentables: [],
  hops: [],
  non_fermentables: [],
} as RecipeDetailed;

const defaultStats: Stats = {
  abv: 0,
  ibu: 0,
  og: 0,
  fg: 0,
  srm: 0,
  strikeWater: 0,
  hotLiquor: 0,
  waterLoss: 0,
};

const RecipeDetailPage = () => {
  const brewSettings = useAppSelector(selectBrewSettings);
  const user = useAppSelector(selectCurrentUser);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [recipe, setRecipe] = useState<RecipeDetailed>();
  const [stats, setStats] = useState<Stats>(defaultStats);
  const [loading, setLoading] = useState<boolean>(true);
  const [isDesktop] = useState<boolean>(
    window.matchMedia("(min-width: 1200px)").matches
  );
  const { fireAnalyticsEvent } = useAnalytics();

  useEffect(() => {
    const onComponentLoad = async () => {
      let workingRecipe: RecipeDetailed;
      if (location.pathname.includes("/recipes/duplicate") && id) {
        workingRecipe = await getRecipeById(id);
        workingRecipe.id = uuid();
        workingRecipe.name = `Copy of ${workingRecipe.name}`;
      } else if (location.pathname.includes("/recipes/edit") && id) {
        workingRecipe = await getRecipeById(id);
      } else {
        workingRecipe = { ...defaultRecipe };

        workingRecipe.owner = user.id;
        workingRecipe.batch_size = brewSettings.batch_size;
        workingRecipe.efficiency = brewSettings.brewhouse_efficiency;
        workingRecipe.measurement_type = brewSettings.measurement_type;
      }
      setRecipe(workingRecipe);
      setLoading(false);
    };
    if (brewSettings && user) {
      onComponentLoad();
    }
  }, [location.pathname, brewSettings, user]);

  useEffect(() => {
    if (recipe && brewSettings) {
      setStats(getStats(recipe, brewSettings));
    }
  }, [recipe, brewSettings]);

  const handleSaveFailed = () => {
    message.error(
      "Form could not be saved. Please address any validation errors."
    );
  };

  const handleSave = async () => {
    setLoading(true);
    await createUpdateRecipe(recipe);
    dispatch(setPageIsClean(true));
    setLoading(false);
    message.success(`${recipe.name} has been saved.`);
    fireAnalyticsEvent("Recipe Saved", { recipeId: recipe.id });
  };

  const goBackToRecipeList = () => {
    navigate("/recipes/list/");
  };

  const handleFieldChange = (value: any, key: any) => {
    dispatch(setPageIsClean(false));
    const newRecipe = { ...recipe };
    newRecipe[key] = value;
    setRecipe(newRecipe);
  };

  const handleUpdateIngredient = (newIngredient: Ingredient) => {
    const updatedRecipe: RecipeDetailed = { ...recipe };

    const ingredientIdToUpdate = updatedRecipe[
      newIngredient.ingredient_type
    ].findIndex(({ id }) => newIngredient.id === id);

    if (ingredientIdToUpdate >= 0 && newIngredient.id) {
      updatedRecipe[newIngredient.ingredient_type][ingredientIdToUpdate] =
        newIngredient;
    } else {
      updatedRecipe[newIngredient.ingredient_type].push(newIngredient as any);
    }

    setRecipe(updatedRecipe);
  };

  const handleDeleteIngredient = (idToDelete: string, type: IngredientType) => {
    const updatedRecipe: RecipeDetailed = { ...recipe };
    updatedRecipe[type] = updatedRecipe[type].filter(
      (ingredient) => ingredient.id !== idToDelete
    ) as any;
    setRecipe(updatedRecipe);
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
              <GeneralInfo onValuesChange={handleFieldChange} recipe={recipe} />
            ),
          },
          {
            key: "2",
            label: "Ingredients",
            children: (
              <Ingredients
                recipe={recipe}
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
              <StatsSection stats={stats} recipe={recipe} />
            </Affix>
          </Col>
        </Row>
      );
    }

    return (
      <>
        {formSections}
        <StatsSection stats={stats} recipe={recipe} />
        <Divider />
      </>
    );
  };

  return (
    <Content isLoading={loading} pageTitle={!loading ? recipe?.name ?? "" : ""}>
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
