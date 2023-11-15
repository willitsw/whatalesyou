import React, { useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import Content from "../../components/content/content";
import { Button } from "antd";
import { useReactToPrint } from "react-to-print";
import ReadOnlyRecipe from "../../components/read-only-recipe/read-only-recipe";
import { useGetRecipeById } from "../../utils/api-calls";

const RecipePrinterFriendly = () => {
  const { id } = useParams();
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const { data: recipe } = useGetRecipeById(id);
  document.title = `Print ${recipe?.name ?? "Recipe"}`;

  useEffect(() => {
    if (recipe) {
      handlePrint();
    }
  }, [recipe]);

  return (
    <Content
      isLoading={!recipe}
      pageTitle="Print Recipe"
      navElement={
        <Button type="primary" onClick={handlePrint}>
          Print
        </Button>
      }
    >
      <div style={{ padding: 20 }} ref={printRef}>
        <ReadOnlyRecipe recipe={recipe} />
      </div>
    </Content>
  );
};

export default RecipePrinterFriendly;
