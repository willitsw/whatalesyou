import React from "react";
import { Col, Descriptions, Divider, List, Row, Typography } from "antd";
import { RecipeDetailed } from "../../types/recipe";
import { sortIngredientsByStep } from "../../utils/recipe-utils";

interface ReadOnlyRecipeProps {
  recipe: RecipeDetailed;
}

const ReadOnlyRecipe = ({ recipe }: ReadOnlyRecipeProps) => {
  const { strikewater, mash, boil, fermentor, bottle } = sortIngredientsByStep([
    ...recipe.chemistry,
    ...recipe.cultures,
    ...recipe.fermentables,
    ...recipe.hops,
    ...recipe.non_fermentables,
  ]);

  return (
    <>
      <style type="text/css" media="print">
        {"@page { size: auto; margin: 10mm !important; }"}
      </style>
      <Typography.Title level={2}>{recipe.name}</Typography.Title>
      <Descriptions
        title={<Typography.Title level={3}>General Info</Typography.Title>}
      >
        {recipe.description && (
          <Descriptions.Item span={3} label="Description">
            {recipe.description}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Author">{recipe.author}</Descriptions.Item>
        <Descriptions.Item label="Batch Size">
          {recipe.batch_size}
        </Descriptions.Item>
        <Descriptions.Item label="Target Efficiency">
          {recipe.efficiency}
        </Descriptions.Item>
        {recipe.created_at && (
          <Descriptions.Item label="Created On">
            {recipe.created_at}
          </Descriptions.Item>
        )}
        <Descriptions.Item label="Recipe Type">{recipe.type}</Descriptions.Item>
      </Descriptions>
      <Typography.Title level={3}>Ingredients</Typography.Title>
      <Row>
        <Col xs={12} sm={12} md={8} lg={8} xl={8}>
          {recipe.fermentables.length > 0 && (
            <>
              <List
                header={
                  <Typography.Title level={5}>
                    - Fermentables -
                  </Typography.Title>
                }
                dataSource={recipe.fermentables.map((fermentable) => {
                  return `${fermentable.amount} ${fermentable.amount_type} ${fermentable.name} (${fermentable.type} - ${fermentable.lovibond} Lov)`;
                })}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
            </>
          )}
        </Col>
        <Col xs={12} sm={12} md={8} lg={8} xl={8}>
          {recipe.hops.length > 0 && (
            <>
              <List
                header={<Typography.Title level={5}>- Hops -</Typography.Title>}
                dataSource={recipe.hops.map((hop) => {
                  return `${hop.amount} ${hop.amount_type} ${hop.name} ${hop.alpha_acid} AA`;
                })}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
            </>
          )}
        </Col>
        <Col xs={12} sm={12} md={8} lg={8} xl={8}>
          {recipe.cultures.length > 0 && (
            <>
              <List
                header={
                  <Typography.Title level={5}>- Cultures -</Typography.Title>
                }
                dataSource={recipe.cultures.map((culture) => {
                  return `${culture.amount} ${culture.amount_type ?? ""} ${
                    culture.name
                  } - ${culture.attenuation}% attenuation`;
                })}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
            </>
          )}
        </Col>
        <Col xs={12} sm={12} md={8} lg={8} xl={8}>
          {recipe.non_fermentables.length > 0 && (
            <>
              <List
                header={
                  <Typography.Title level={5}>- Misc. -</Typography.Title>
                }
                dataSource={recipe.non_fermentables.map((misc) => {
                  return `${misc.amount} ${misc.amount_type ?? ""} ${
                    misc.name
                  }`;
                })}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
            </>
          )}
        </Col>
        <Col xs={12} sm={12} md={8} lg={8} xl={8}>
          {recipe.chemistry.length > 0 && (
            <>
              <List
                header={
                  <Typography.Title level={5}>- Chemistry -</Typography.Title>
                }
                dataSource={recipe.chemistry.map((chemical) => {
                  return `${chemical.amount} ${chemical.amount_type ?? ""} ${
                    chemical.name
                  }`;
                })}
                renderItem={(item) => <List.Item>{item}</List.Item>}
              />
              <Divider />
            </>
          )}
        </Col>
      </Row>
      <Typography.Title level={3}>Steps</Typography.Title>
      {strikewater.length > 0 && (
        <>
          <List
            header={
              <Typography.Title level={5}>
                - Strike Water Preparation -
              </Typography.Title>
            }
            dataSource={strikewater.map((step, index) => {
              const stepNumber = index + 1;
              return `${stepNumber}. Add ${step.amount} ${
                step.amount_type ?? ""
              } ${step.name}. ${step.notes ?? ""}`;
            })}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <Divider />
        </>
      )}
      {mash.length > 0 && (
        <>
          <List
            header={<Typography.Title level={5}>- Mash -</Typography.Title>}
            dataSource={mash.map((step, index) => {
              const stepNumber = index + 1;
              return `${stepNumber}. Add ${step.amount} ${
                step.amount_type ?? ""
              } ${step.name}. ${step.notes ?? ""}`;
            })}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <Divider />
        </>
      )}
      {boil.length > 0 && (
        <>
          <List
            header={<Typography.Title level={5}>- Boil -</Typography.Title>}
            dataSource={boil.map((step, index) => {
              const stepNumber = index + 1;
              return `${stepNumber}. At ${
                step.timing
              } minutes left in boil, add ${step.amount} ${
                step.amount_type ?? ""
              } ${step.name}. ${step.notes ?? ""}`;
            })}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <Divider />
        </>
      )}
      {fermentor.length > 0 && (
        <>
          <List
            header={
              <Typography.Title level={5}>- Fermentation -</Typography.Title>
            }
            dataSource={fermentor.map((step, index) => {
              const stepNumber = index + 1;
              return `${stepNumber}. At ${
                step.timing
              } days into fermentation, add ${step.amount} ${
                step.amount_type ?? ""
              } ${step.name}. ${step.notes ?? ""}`;
            })}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <Divider />
        </>
      )}
      {bottle.length > 0 && (
        <>
          <List
            header={
              <Typography.Title level={5}>- Packaging -</Typography.Title>
            }
            dataSource={bottle.map((step, index) => {
              const stepNumber = index + 1;
              return `${stepNumber}. Add ${step.amount} ${
                step.amount_type ?? ""
              } ${step.name}. ${step.notes ?? ""}`;
            })}
            renderItem={(item) => <List.Item>{item}</List.Item>}
          />
          <Divider />
        </>
      )}
    </>
  );
};

export default ReadOnlyRecipe;
