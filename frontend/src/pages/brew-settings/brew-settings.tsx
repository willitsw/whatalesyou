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
import { useState } from "react";
import Content from "../../components/content/content";
import { setPageIsClean } from "../../redux/global-modals";
import { useAppDispatch } from "../../redux/store";
import React from "react";
import { BrewSettings } from "../../types/brew-settings";
import ElementWithLabel from "../../components/form-layouts/element-with-label";
import { useCreateUpdateBrewSettings } from "../../utils/api-calls";
import { useCurrentUser } from "../../components/user-context/user-context";

const defaultBrewSettings: BrewSettings = {
  batch_size: 0,
  boil_time: 0,
  brewhouse_efficiency: 0,
  do_sparge: true,
  id: "",
  mash_thickness_target: 0,
  measurement_type: "imperial",
  water_loss_fermentor_trub: 0,
  water_loss_kettle_trub: 0,
  water_loss_per_boil_unit: 0,
  water_loss_per_grain_unit: 0,
};

const BrewSettings = () => {
  const [localBrewSettings, setLocalBrewSettings] =
    useState<BrewSettings>(defaultBrewSettings);
  const { user } = useCurrentUser();

  const {
    mutateAsync: createUpdateBrewSettings,
    isPending: createUpdateBrewSettingsIsLoading,
  } = useCreateUpdateBrewSettings(localBrewSettings);

  if (user.settings && !localBrewSettings.id) {
    setLocalBrewSettings(user.settings);
  }

  const dispatch = useAppDispatch();

  const handleSave = async () => {
    await createUpdateBrewSettings();
    message.success("Brew Settings have been updated.");
    dispatch(setPageIsClean(true));
  };

  const handleFieldChange = (value: any, key: any) => {
    dispatch(setPageIsClean(false));
    const newBrewSettings = { ...localBrewSettings };
    newBrewSettings[key] = value;
    setLocalBrewSettings(newBrewSettings);
  };

  return (
    <Content
      isLoading={createUpdateBrewSettingsIsLoading}
      pageTitle="Brew Settings"
    >
      <Typography.Title level={4}>General Defaults</Typography.Title>
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
          label="Batch Size"
          formElement={
            <InputNumber
              value={localBrewSettings.batch_size.toString()}
              onChange={(value: string) =>
                handleFieldChange(value, "batch_size")
              }
              min="0"
              max="100"
              step="0.5"
              addonAfter={
                localBrewSettings.measurement_type === "metric" ? "l" : "gal"
              }
            />
          }
          orientation="column"
        />
        <ElementWithLabel
          label="Boil Time"
          formElement={
            <InputNumber
              value={localBrewSettings.boil_time.toString()}
              onChange={(value: string) =>
                handleFieldChange(value, "boil_time")
              }
              addonAfter="min"
            />
          }
          orientation="column"
        />
        <ElementWithLabel
          label="Efficiency"
          formElement={
            <InputNumber
              value={localBrewSettings.brewhouse_efficiency.toString()}
              onChange={(value: string) =>
                handleFieldChange(value, "brewhouse_efficiency")
              }
              addonAfter="%"
            />
          }
          orientation="column"
        />
        <ElementWithLabel
          label="Measurement Type"
          formElement={
            <Radio.Group
              value={localBrewSettings.measurement_type}
              onChange={(value) =>
                handleFieldChange(value.target.value, "measurement_type")
              }
            >
              <Radio.Button value="imperial">Imperial</Radio.Button>
              <Radio.Button value="metric">Metric</Radio.Button>
            </Radio.Group>
          }
          orientation="column"
        />
      </div>
      <Divider />
      <Typography.Title level={4}>Water Loss Constants</Typography.Title>
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
          label="Grain Water Loss"
          formElement={
            <InputNumber
              value={localBrewSettings.water_loss_per_grain_unit.toString()}
              onChange={(value: string) =>
                handleFieldChange(value, "water_loss_per_grain_unit")
              }
              min="0"
              max="100"
              step="0.1"
              addonAfter={
                localBrewSettings.measurement_type === "metric"
                  ? "l/kg"
                  : "qt/lb"
              }
            />
          }
          orientation="column"
        />
        <ElementWithLabel
          label="Fermenter Dead Space"
          formElement={
            <InputNumber
              value={localBrewSettings.water_loss_fermentor_trub.toString()}
              onChange={(value: string) =>
                handleFieldChange(value, "water_loss_fermentor_trub")
              }
              addonAfter={
                localBrewSettings.measurement_type === "metric" ? "lit" : "gal"
              }
            />
          }
          orientation="column"
        />
        <ElementWithLabel
          label="Kettle Dead Space"
          formElement={
            <InputNumber
              value={localBrewSettings.water_loss_kettle_trub.toString()}
              onChange={(value: string) =>
                handleFieldChange(value, "water_loss_kettle_trub")
              }
              addonAfter={
                localBrewSettings.measurement_type === "metric" ? "lit" : "gal"
              }
            />
          }
          orientation="column"
        />
        <ElementWithLabel
          label="Evaporation Water Loss"
          formElement={
            <InputNumber
              value={localBrewSettings.water_loss_per_boil_unit.toString()}
              onChange={(value: string) =>
                handleFieldChange(value, "water_loss_per_boil_unit")
              }
              addonAfter={
                localBrewSettings.measurement_type === "metric"
                  ? "lit/hr"
                  : "gal/hr"
              }
            />
          }
          orientation="column"
        />
      </div>
      <Divider />
      <Typography.Title level={4}>Mash Settings</Typography.Title>
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
          label="Sparging"
          formElement={
            <Switch
              checkedChildren={<CheckOutlined />}
              unCheckedChildren={<CloseOutlined />}
              checked={localBrewSettings.do_sparge}
              onChange={(value) => handleFieldChange(value, "do_sparge")}
            />
          }
          orientation="column"
        />
        {localBrewSettings.do_sparge && (
          <ElementWithLabel
            label="Mash Thickness"
            formElement={
              <InputNumber
                value={localBrewSettings.mash_thickness_target.toString()}
                onChange={(value: string) =>
                  handleFieldChange(value, "mash_thickness_target")
                }
                min="0"
                max="100"
                step="0.1"
                style={{ width: 115 }}
                addonAfter={
                  localBrewSettings.measurement_type === "metric"
                    ? "l/kg"
                    : "qt/lb"
                }
              />
            }
            orientation="column"
          />
        )}
      </div>
      <Divider />
      <Affix offsetBottom={10} style={{ float: "right" }}>
        <Form.Item>
          <Button type="primary" onClick={handleSave}>
            Save
          </Button>
        </Form.Item>
      </Affix>
    </Content>
  );
};

export default BrewSettings;
