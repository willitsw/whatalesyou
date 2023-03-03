import { Typography, Input, InputNumber, Radio } from "antd";
import React from "react";
import ElementWithLabel from "../../../components/form-layouts/element-with-label";
import { RecipeDetailed } from "../../../types/recipe";

interface GeneralInfoProps {
  recipe: RecipeDetailed;
  onValuesChange: (key: string, value: any) => void;
}

const GeneralInfo = ({ recipe, onValuesChange }: GeneralInfoProps) => {
  return (
    <>
      <Typography.Title level={4}>General Info</Typography.Title>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 10,
        }}
      >
        <ElementWithLabel
          formElement={
            <Input
              value={recipe.name}
              onChange={(value) => onValuesChange(value.target.value, "name")}
              style={{ maxWidth: "100%" }}
            />
          }
          label="Recipe Name"
          orientation="column"
        />
        <ElementWithLabel
          formElement={
            <Input
              value={recipe.author}
              onChange={(value) => onValuesChange(value.target.value, "author")}
            />
          }
          label="Author"
          orientation="column"
        />
        <ElementWithLabel
          formElement={
            <Input.TextArea
              style={{ width: 300 }}
              value={recipe.description}
              onChange={(value) =>
                onValuesChange(value.target.value, "description")
              }
            />
          }
          label="Recipe Description"
          orientation="column"
        />
        <ElementWithLabel
          formElement={
            <InputNumber
              min="0"
              max="100"
              step="0.5"
              style={{ width: 105 }}
              addonAfter={recipe.measurement_type === "metric" ? "l" : "gal"}
              value={recipe.batch_size.toString()}
              onChange={(value: string) => onValuesChange(value, "batch_size")}
            />
          }
          label="Batch Size"
          orientation="column"
        />
        <ElementWithLabel
          formElement={
            <InputNumber
              style={{ width: 105 }}
              value={recipe.efficiency.toString()}
              onChange={(value: string) => onValuesChange(value, "efficiency")}
              min="0"
              max="100"
              step="1"
              addonAfter="%"
            />
          }
          label="Efficiency"
          orientation="column"
        />
        <ElementWithLabel
          formElement={
            <Radio.Group
              value={recipe.type}
              onChange={(value) => onValuesChange(value.target.value, "type")}
            >
              <Radio.Button value="all_grain">All Grain</Radio.Button>
              <Radio.Button value="extract">Extract</Radio.Button>
            </Radio.Group>
          }
          label="Brew Type"
          orientation="column"
        />
        <ElementWithLabel
          formElement={
            <Radio.Group
              value={recipe.measurement_type}
              onChange={(value) =>
                onValuesChange(value.target.value, "measurement_type")
              }
            >
              <Radio.Button value="imperial">Imperial</Radio.Button>
              <Radio.Button value="metric">Metric</Radio.Button>
            </Radio.Group>
          }
          label="Measurement Type"
          orientation="column"
        />
      </div>
    </>
  );
};

export default GeneralInfo;
