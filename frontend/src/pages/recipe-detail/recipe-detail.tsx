import { useEffect, useState } from "react";
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
import React from "react";
import Ingredients from "./ingredients/ingredients";
import { useAnalytics } from "../../utils/analytics";
import dayjs from "dayjs";
import { Ingredient, IngredientType, RecipeDetailed } from "../../types/recipe";
import { Stats } from "../../types/stats";
import { v4 as uuid } from "uuid";
import { useCreateUpdateRecipe, useGetRecipeById } from "../../utils/api-calls";
import { useCurrentUser } from "../../components/user-context/user-context";
import { UserResponse } from "../../types/user";
import { useForm, useWatch } from "antd/es/form/Form";

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
  const [stats, setStats] = useState<Stats>(getDefaultStats());
  const [isDesktop] = useState<boolean>(
    window.matchMedia("(min-width: 1200px)").matches
  );
  const { fireAnalyticsEvent } = useAnalytics();
  const [form] = useForm<RecipeDetailed>();
  const measurementType = useWatch("measurement_type", form);

  const { data: recipe, isLoading: recipeIsLoading } = useGetRecipeById(id);

  const { mutateAsync: createUpdateRecipe } = useCreateUpdateRecipe();

  const isLoading = recipeIsLoading;

  useEffect(() => {
    if (recipe) {
      setStats(getStats(recipe, user.settings));
    }
  }, [recipe]);

  const handleSave = async () => {
    const values: RecipeDetailed = form.getFieldsValue(true);
    let recipePayload: RecipeDetailed;

    if (location.pathname.includes("duplicate")) {
      const newRecipe = duplicateRecipe(recipe);
      recipePayload = { ...newRecipe, ...values };
    } else if (location.pathname.includes("new")) {
      const newRecipe = getDefaultRecipe(user);
      recipePayload = { ...newRecipe, ...values };
    } else if (location.pathname.includes("edit")) {
      recipePayload = { ...recipe, ...values };
    }
    await createUpdateRecipe(recipePayload);
    message.success("Recipe has been saved.");
    fireAnalyticsEvent("Recipe Saved", { recipeId: recipePayload.id });
  };

  const goBackToRecipeList = () => {
    navigate("/recipes/list/");
  };

  const handleUpdateIngredient = (newIngredient: Ingredient) => {
    const allIngredientTypes: IngredientType[] = [
      "hops",
      "chemistry",
      "cultures",
      "fermentables",
      "non_fermentables",
    ];
    allIngredientTypes.forEach((type) =>
      handleDeleteIngredient(newIngredient.id, type)
    );

    const ingredientList: Ingredient[] = [
      ...form.getFieldValue(newIngredient.ingredient_type),
    ];

    ingredientList.push(newIngredient);

    form.setFieldValue(newIngredient.ingredient_type, ingredientList);
    handleRunStats();
  };

  const handleDeleteIngredient = (idToDelete: string, type: IngredientType) => {
    const values = form
      .getFieldValue(type)
      .filter((item: Ingredient) => item.id !== idToDelete);

    form.setFieldValue(type, values);
  };

  const handleRunStats = () => {
    setStats(getStats(form.getFieldsValue(true), user.settings));
  };

  const getLayout = () => {
    const formSections = (
      <Tabs
        defaultActiveKey="1"
        items={[
          {
            key: "1",
            label: "General Info",
            children: <GeneralInfo form={form} />,
          },
          {
            key: "2",
            label: "Ingredients",
            children: (
              <Ingredients
                form={form}
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
            <Affix offsetTop={100}>
              <StatsSection stats={stats} measurementType={measurementType} />
            </Affix>
          </Col>
        </Row>
      );
    }

    return (
      <>
        {formSections}
        <StatsSection stats={stats} measurementType={measurementType} />
        <Divider />
      </>
    );
  };

  return (
    <Content
      isLoading={isLoading}
      pageTitle={!isLoading ? recipe?.name ?? "New Recipe" : ""}
    >
      <Form
        form={form}
        initialValues={recipe ?? getDefaultRecipe(user)}
        name="recipe-detail"
        onFinish={handleSave}
        autoComplete="off"
        layout="vertical"
        onFieldsChange={handleRunStats}
        preserve
      >
        {getLayout()}
        <div style={{ position: "fixed", bottom: "10px", right: "20px" }}>
          <Space>
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
            <Form.Item>
              <Button onClick={goBackToRecipeList}>Back to Recipe List</Button>
            </Form.Item>
          </Space>
        </div>
      </Form>
    </Content>
  );
};

export default RecipeDetailPage;
