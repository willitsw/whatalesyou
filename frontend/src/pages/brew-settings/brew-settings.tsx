import { CheckOutlined, CloseOutlined } from "@ant-design/icons";
import {
  Affix,
  Button,
  Divider,
  Form,
  InputNumber,
  message,
  Radio,
  Switch,
  Typography,
} from "antd";
import Content from "../../components/content/content";
import React from "react";
import { BrewSettings } from "../../types/brew-settings";
import { useCreateUpdateBrewSettings } from "../../utils/api-calls";
import { useCurrentUser } from "../../components/user-context/user-context";
import { useForm } from "antd/es/form/Form";

const BrewSettings = () => {
  const { user, refreshUser } = useCurrentUser();
  const [form] = useForm<BrewSettings>();
  const measurementType = Form.useWatch("measurement_type", form);
  const doSparge = Form.useWatch("do_sparge", form);

  const {
    mutateAsync: createUpdateBrewSettings,
    isPending: createUpdateBrewSettingsIsLoading,
  } = useCreateUpdateBrewSettings();

  const handleSave = async (values: BrewSettings) => {
    await createUpdateBrewSettings({ ...user.settings, ...values });
    await refreshUser();
    message.success("Brew Settings have been updated.");
  };

  return (
    <Content
      isLoading={createUpdateBrewSettingsIsLoading}
      pageTitle="Brew Settings"
    >
      <Form
        form={form}
        initialValues={user.settings}
        name="brew-settings"
        onFinish={handleSave}
        autoComplete="off"
        layout="vertical"
      >
        <Typography.Title level={4}>General Defaults</Typography.Title>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: 20,
            marginLeft: 20,
            marginRight: 20,
            flexWrap: "wrap",
          }}
        >
          <Form.Item
            label="Batch Size"
            name="batch_size"
            rules={[{ required: true }]}
          >
            <InputNumber
              min="0"
              max="100"
              step="0.5"
              style={{ width: 100 }}
              addonAfter={measurementType === "metric" ? "l" : "gal"}
            />
          </Form.Item>
          <Form.Item
            label="Boil Time"
            name="boil_time"
            rules={[{ required: true }]}
          >
            <InputNumber min={0} style={{ width: 100 }} addonAfter="min" />
          </Form.Item>
          <Form.Item
            label="Efficiency"
            name="brewhouse_efficiency"
            rules={[{ required: true }]}
          >
            <InputNumber
              min={0}
              max={100}
              style={{ width: 100 }}
              addonAfter="%"
            />
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
        </div>
        <Divider />
        <Typography.Title level={4}>Water Loss Constants</Typography.Title>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: 20,
            marginLeft: 20,
            marginRight: 20,
            flexWrap: "wrap",
          }}
        >
          <Form.Item
            label="Grain Water Loss"
            name="water_loss_per_grain_unit"
            rules={[{ required: true }]}
          >
            <InputNumber
              min="0"
              max="100"
              step="0.1"
              style={{ width: 120 }}
              addonAfter={measurementType === "metric" ? "l/kg" : "qt/lb"}
            />
          </Form.Item>
          <Form.Item
            label="Fermenter Dead Space"
            name="water_loss_fermentor_trub"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: 120 }}
              min="0"
              max="100"
              step="0.1"
              addonAfter={measurementType === "metric" ? "lit" : "gal"}
            />
          </Form.Item>
          <Form.Item
            label="Kettle Dead Space"
            name="water_loss_kettle_trub"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: 120 }}
              min="0"
              max="100"
              step="0.1"
              addonAfter={measurementType === "metric" ? "lit" : "gal"}
            />
          </Form.Item>
          <Form.Item
            label="Evaporation Water Loss"
            name="water_loss_per_boil_unit"
            rules={[{ required: true }]}
          >
            <InputNumber
              style={{ width: 120 }}
              min="0"
              max="100"
              step="0.1"
              addonAfter={measurementType === "metric" ? "lit/hr" : "gal/hr"}
            />
          </Form.Item>
        </div>
        <Divider />
        <Typography.Title level={4}>Mash Settings</Typography.Title>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: 20,
            marginLeft: 20,
            marginRight: 20,
            flexWrap: "wrap",
          }}
        >
          <Form.Item
            label="Sparging"
            name="do_sparge"
            rules={[{ required: true }]}
          >
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
            />
          </Form.Item>

          {doSparge && (
            <Form.Item
              label="Mash Thickness"
              name="mash_thickness_target"
              rules={[{ required: true }]}
            >
              <InputNumber
                min="0"
                max="100"
                step="0.1"
                style={{ width: 100 }}
                addonAfter={measurementType === "metric" ? "l/kg" : "qt/lb"}
              />
            </Form.Item>
          )}
        </div>
        <Divider />
        <Affix offsetBottom={10} style={{ float: "right" }}>
          <Form.Item>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Affix>
      </Form>
    </Content>
  );
};

export default BrewSettings;
