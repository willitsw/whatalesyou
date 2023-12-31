import {
  Typography,
  Input,
  InputNumber,
  Radio,
  FormInstance,
  Form,
} from "antd";
import React from "react";
import { RecipeDetailed } from "../../../types/recipe";
import { FormFlex } from "../../../components/form-layouts/form-flex";
import { useWatch } from "antd/es/form/Form";

interface GeneralInfoProps {
  form: FormInstance<RecipeDetailed>;
}

const GeneralInfo = ({ form }: GeneralInfoProps) => {
  const measurementType = useWatch("measurement_type", form);
  return (
    <>
      <Typography.Title level={4}>General Info</Typography.Title>
      <FormFlex>
        <Form.Item label="Recipe Name" name="name" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Author" name="author" rules={[{ required: true }]}>
          <Input />
        </Form.Item>
        <Form.Item label="Recipe Description" name="description">
          <Input.TextArea style={{ width: 300 }} />
        </Form.Item>
        <Form.Item
          label="Batch Size"
          name="batch_size"
          rules={[{ required: true }]}
        >
          <InputNumber
            min="0"
            max="100"
            step="0.5"
            style={{ width: 120 }}
            addonAfter={measurementType === "metric" ? "l" : "gal"}
          />
        </Form.Item>
        <Form.Item
          label="Efficiency"
          name="efficiency"
          rules={[{ required: true }]}
        >
          <InputNumber
            style={{ width: 120 }}
            min="0"
            max="100"
            step="1"
            addonAfter="%"
          />
        </Form.Item>
        <Form.Item label="Brew Type" name="type" rules={[{ required: true }]}>
          <Radio.Group>
            <Radio.Button value="all_grain">All Grain</Radio.Button>
            <Radio.Button value="extract">Extract</Radio.Button>
          </Radio.Group>
        </Form.Item>
        <Form.Item
          label="Measurement Type"
          name="measurement_type"
          rules={[{ required: true }]}
        >
          <Radio.Group>
            <Radio.Button value="imperial">Imperial</Radio.Button>
            <Radio.Button value="metric">Metric</Radio.Button>
          </Radio.Group>
        </Form.Item>
      </FormFlex>
    </>
  );
};

export default GeneralInfo;
