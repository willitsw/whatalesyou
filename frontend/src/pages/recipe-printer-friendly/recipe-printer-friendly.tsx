import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getRecipeById } from "../../utils/api-calls";
import Content from "../../components/content/content";
import { Button } from "antd";
import { useReactToPrint } from "react-to-print";
import ReadOnlyRecipe from "../../components/read-only-recipe/read-only-recipe";
import { Recipe } from "../../types/recipe";

const RecipePrinterFriendly = () => {
  const { id } = useParams();
  const printRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => printRef.current,
  });

  const [recipe, setRecipe] = useState<Recipe>(null);

  useEffect(() => {
    const setNewRecipe = async () => {
      const newRecipe = await getRecipeById(id);
      document.title = `Print ${newRecipe.name}`;
      setRecipe(newRecipe);
    };
    setNewRecipe();
  }, [id]);

  useEffect(() => {
    if (recipe) {
      //handlePrint();
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
