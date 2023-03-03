import { useState, useEffect } from "react";
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
import { deleteRecipe, getRecipesByUser } from "../../utils/api-calls";
import { RecipeTypesLookup } from "../../types/shared";

const RecipeListTable = () => {
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);
  const [recipeToDelete, setRecipeToDelete] = useState<Recipe>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { fireAnalyticsEvent } = useAnalytics();

  useEffect(() => {
    const getRecipeList = async () => {
      const recipeResponse = await getRecipesByUser();
      setRecipeList(recipeResponse.results);
      setLoading(false);
    };
    getRecipeList();
  }, []);

  const handleDeleteRecipe = async () => {
    setLoading(true);
    deleteRecipe(recipeToDelete.id);
    setRecipeList(
      recipeList.filter((recipe) => recipe.id !== recipeToDelete.id)
    );
    setRecipeToDelete(null);
    setLoading(false);
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
                  recipeList.find((recipe) => record.id === recipe.id)
                )
              }
            />
          </Tooltip>
        </Space>
      ),
    },
  ];

  const preparedRecipeData = recipeList.map((recipe) => {
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
        loading={loading}
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
