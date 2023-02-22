import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Button, Space, Tooltip } from "antd";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import { processDeleteRecipe, refreshRecipeList } from "../../redux/recipe";
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

const RecipeListTable = () => {
  const dispatch = useAppDispatch();
  const recipeList = useAppSelector((state) => state.recipes.recipeList);
  const [idToDelete, setIdToDelete] = useState<string>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const navigate = useNavigate();
  const { fireAnalyticsEvent } = useAnalytics();

  const nameToDelete = idToDelete
    ? recipeList.find((recipe) => recipe.id === idToDelete)?.name
    : "";

  useEffect(() => {
    const getRecipeList = async () => {
      dispatch(refreshRecipeList());
      setLoading(false);
    };
    getRecipeList();
  }, []);

  const handleDeleteRecipe = async () => {
    if (idToDelete) {
      dispatch(processDeleteRecipe(idToDelete));
      fireAnalyticsEvent("Recipe Deleted", { recipeId: idToDelete });
    }
    setIdToDelete(null);
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
              onClick={() => setIdToDelete(record.id)}
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
        onCancel={() => setIdToDelete(null)}
        onSubmit={() => handleDeleteRecipe()}
        showModal={idToDelete !== null}
        title={`Delete recipe ${nameToDelete}?`}
      >
        This cannot be undone.
      </OkCancelModal>
    </>
  );
};

export default RecipeListTable;
