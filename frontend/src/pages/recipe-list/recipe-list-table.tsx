import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Button, Space, Tooltip } from "antd";
import OkCancelModal from "../../components/ok-cancel-modal/ok-cancel-modal";

import { Breakpoint } from "antd/lib/_util/responsiveObserver";
import {
  CopyOutlined,
  DeleteOutlined,
  PrinterOutlined,
} from "@ant-design/icons";
import React from "react";
import { useAnalytics } from "../../utils/analytics";
import { Recipe } from "../../types/recipe";
import { useDeleteRecipe, useGetRecipesByUser } from "../../utils/api-calls";
import { RecipeTypesLookup } from "../../types/shared";

const RecipeListTable = () => {
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe>(null);
  const navigate = useNavigate();
  const { fireAnalyticsEvent } = useAnalytics();

  const {
    data: recipeList,
    isLoading: recipesAreLoading,
    isFetching: recipesAreFetching,
  } = useGetRecipesByUser();

  const { mutateAsync: deleteRecipe, isPending: deleteRecipeIsLoading } =
    useDeleteRecipe(recipeToDelete?.id);

  const isLoading =
    recipesAreLoading && deleteRecipeIsLoading && recipesAreFetching;

  const handleDeleteRecipe = async () => {
    await deleteRecipe();
    setRecipeToDelete(null);
  };

  const showOnlyDesktop: Breakpoint[] = ["md"];

  const columnDefinitions = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: Recipe) => (
        <Link to={"/recipes/edit/" + record.id}>{text}</Link>
      ),
    },
    {
      title: "Author",
      dataIndex: "author",
      key: "author",
      responsive: showOnlyDesktop,
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      responsive: showOnlyDesktop,
      render: (text: string) => RecipeTypesLookup[text],
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: Recipe) => (
        <Space>
          <Tooltip title="Printer Friendly Version">
            <Link to={"/recipes/print/" + record.id} target="_blank">
              <Button
                type="primary"
                shape="circle"
                icon={<PrinterOutlined />}
                onClick={() => {
                  fireAnalyticsEvent("Printer Friendly Recipe Viewed", {
                    recipeId: record.id,
                  });
                }}
              />
            </Link>
          </Tooltip>
          <Tooltip title="Duplicate">
            <Button
              type="primary"
              shape="circle"
              icon={<CopyOutlined />}
              onClick={() => {
                navigate("/recipes/duplicate/" + record.id);
                fireAnalyticsEvent("Recipe Duplicated", {
                  recipeId: record.id,
                });
              }}
            />
          </Tooltip>
          <Tooltip title="Delete">
            <Button
              type="primary"
              shape="circle"
              icon={<DeleteOutlined />}
              onClick={() =>
                setRecipeToDelete(
                  recipeList.results.find((recipe) => record.id === recipe.id)
                )
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  // todo: give default value to query so its never null
  const preparedRecipeData = recipeList?.results.map((recipe) => {
    return {
      ...recipe,
      key: recipe.id,
    };
  });

  return (
    <>
      <Button
        style={{ marginBottom: 10 }}
        type="primary"
        onClick={() => {
          navigate("/recipes/new");
          fireAnalyticsEvent("New Recipe Created");
        }}
      >
        New Recipe
      </Button>
      <Table
        columns={columnDefinitions}
        dataSource={preparedRecipeData}
        loading={isLoading}
      />
      <OkCancelModal
        onCancel={() => setRecipeToDelete(null)}
        onSubmit={() => handleDeleteRecipe()}
        showModal={recipeToDelete !== null}
        title={`Delete recipe ${recipeToDelete?.name}?`}
      >
        This cannot be undone.
      </OkCancelModal>
    </>
  );
};

export default RecipeListTable;
