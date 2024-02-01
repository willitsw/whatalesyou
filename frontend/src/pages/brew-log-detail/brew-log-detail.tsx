import React, { useState } from "react";
import Content from "../../components/content/content";
import {
  Affix,
  Button,
  ConfigProvider,
  DatePicker,
  Descriptions,
  Form,
  Input,
  InputNumber,
  List,
  message,
  Modal,
  Radio,
  Select,
  Space,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  useCreateUpdateBrewLog,
  useGetBrewLogsById,
  useGetBrewLogsByUser,
  useGetRecipeById,
  useGetRecipesByUser,
} from "../../utils/api-calls";
import { DATE_FORMAT } from "../../constants";
import { DeleteOutlined, EditOutlined, PlusOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import {
  BrewLog,
  BrewLogListResponse,
  GravityReading,
} from "../../types/brew-log";
import { v4 as uuid } from "uuid";
import { useCurrentUser } from "../../components/user-context/user-context";
import { useForm, useWatch } from "antd/es/form/Form";
import { User } from "../../types/user";
import { FormFlex } from "../../components/form-layouts/form-flex";
import ReadOnlyRecipe from "../../components/read-only-recipe/read-only-recipe";
import { GravityReadingModal } from "./gravity-reading-modal";

const getDefaultBrewLog = (
  user: User,
  brewLogList: BrewLogListResponse
): BrewLog => ({
  name: "New Brew Log Entry",
  brew_date: dayjs(),
  id: uuid(),
  status: "in_progress",
  owner: user.id,
  batch_number: (brewLogList?.count || 0) + 1,
  gravity_readings: [],
  brewing_notes: "",
  fermentation_notes: "",
  hop_notes: "",
  other_notes: "",
  tasting_notes: "",
  yeast_notes: "",
  packaging_notes: "",
});

const BrewLogDetailPage = () => {
  const { user } = useCurrentUser();
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: brewLogList, isLoading: brewLogListIsLoading } =
    useGetBrewLogsByUser();
  const [gravityReadingToDelete, setGravityReadingToDelete] =
    useState<string>(null);
  const [gravityReading, setGravityReading] = useState<GravityReading>(null);
  const [form] = useForm<BrewLog>();
  const [recipeId, setRecipeId] = useState<string>();

  const logName = useWatch("name", form);
  const gravityReadings = useWatch("gravity_readings", form);

  console.log("current selected gravity reading", gravityReading);
  console.log("all gravity reading", form.getFieldValue("gravity_readings"));
  const { data: recipeFromSelectBox } = useGetRecipeById(recipeId);

  const { data: recipeList, isLoading: recipeListIsLoading } =
    useGetRecipesByUser();

  const { data: brewLog, isLoading: brewLogIsLoading } = useGetBrewLogsById(id);

  const { mutateAsync: processCreateUpdateBrewLog } = useCreateUpdateBrewLog();

  const loading =
    recipeListIsLoading || brewLogIsLoading || brewLogListIsLoading;

  const getDefaultGravityReading = (): GravityReading => ({
    id: uuid(),
    date: dayjs().toISOString(),
    gravity: 1,
    notes: "",
    brew_log: form.getFieldValue("id"),
  });

  const handleAddGravityReading = () => {
    setGravityReading(getDefaultGravityReading());
  };

  const handleSave = () => {
    const values: BrewLog = form.getFieldsValue(true);
    processCreateUpdateBrewLog({
      ...values,
      brew_date: dayjs(values.brew_date).format("YYYY-MM-DD"),
      recipe: recipeFromSelectBox ?? brewLog?.recipe ?? null,
    });
    message.success("Brew Log has been saved.");
  };

  const handleGravityReadingOk = (gravityReadingIncoming: GravityReading) => {
    const committedGravityReading: GravityReading = {
      ...gravityReading,
      ...gravityReadingIncoming,
      date: dayjs(gravityReadingIncoming.date).toISOString(),
    };
    const newGravityReadings = form.getFieldValue("gravity_readings");
    const idxToReplace = newGravityReadings.findIndex(
      (reading) => reading.id === committedGravityReading.id
    );
    if (idxToReplace >= 0) {
      newGravityReadings[idxToReplace] = committedGravityReading;
    } else {
      newGravityReadings.push(committedGravityReading);
    }
    form.setFieldValue("gravity_readings", newGravityReadings);
    setGravityReading(null);
  };

  const handleGravityReadingDelete = () => {
    let newGravityReadings = form.getFieldValue("gravity_readings");
    newGravityReadings = newGravityReadings.filter(
      (g) => g.id !== gravityReadingToDelete
    );
    form.setFieldValue("gravity_readings", newGravityReadings);
    setGravityReadingToDelete(null);
  };

  const goBackToBrewLogList = () => {
    navigate("/brew-log/list/");
  };

  const recipeToShow = recipeFromSelectBox ?? brewLog?.recipe ?? null;

  return (
    <>
      <Content pageTitle={!loading ? logName ?? "" : ""} isLoading={loading}>
        <Form
          form={form}
          initialValues={
            brewLog
              ? {
                  ...brewLog,
                  brew_date: dayjs(brewLog.brew_date, "YYYY-MM-DD"),
                }
              : getDefaultBrewLog(user, brewLogList)
          }
          name="brew-log-detail"
          onFinish={handleSave}
          autoComplete="off"
          layout="vertical"
          preserve
        >
          <Tabs
            defaultActiveKey="1"
            items={[
              {
                key: "1",
                label: "Log Data",
                children: (
                  <>
                    <Typography.Title level={4}>General Info</Typography.Title>
                    <FormFlex>
                      <Form.Item
                        label="Brew Session Name"
                        name="name"
                        rules={[{ required: true }]}
                      >
                        <Input />
                      </Form.Item>
                      <Form.Item
                        label="Brew Date"
                        name="brew_date"
                        rules={[{ required: true }]}
                      >
                        <DatePicker format={DATE_FORMAT} />
                      </Form.Item>
                      <Form.Item
                        label="Status"
                        name="status"
                        rules={[{ required: true }]}
                      >
                        <Radio.Group>
                          <Radio.Button value="in_progress">
                            In Progress
                          </Radio.Button>
                          <Radio.Button value="complete">Complete</Radio.Button>
                        </Radio.Group>
                      </Form.Item>
                      <Form.Item
                        label="Batch Number"
                        name="batch_number"
                        rules={[{ required: true }]}
                      >
                        <InputNumber min="0" max="100" step="1" />
                      </Form.Item>
                    </FormFlex>
                    <ConfigProvider renderEmpty={() => null}>
                      <List
                        header={
                          <div
                            style={{
                              display: "flex",
                              justifyContent: "space-between",
                            }}
                          >
                            <Button
                              type="primary"
                              onClick={handleAddGravityReading}
                              icon={<PlusOutlined />}
                            >
                              Gravity Reading
                            </Button>
                          </div>
                        }
                        renderItem={(item: GravityReading) => (
                          <List.Item>
                            <List.Item.Meta
                              description={
                                <Descriptions
                                  title={
                                    <div
                                      style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      {item.notes}
                                      <Space>
                                        <Tooltip title="Edit">
                                          <Button
                                            shape="circle"
                                            icon={<EditOutlined />}
                                            onClick={() =>
                                              setGravityReading(item)
                                            }
                                          />
                                        </Tooltip>
                                        <Tooltip title="Delete">
                                          <Button
                                            shape="circle"
                                            icon={<DeleteOutlined />}
                                            onClick={() =>
                                              setGravityReadingToDelete(item.id)
                                            }
                                          />
                                        </Tooltip>
                                      </Space>
                                    </div>
                                  }
                                >
                                  <Descriptions.Item label="Date">
                                    {dayjs(item.date).format(DATE_FORMAT)}
                                  </Descriptions.Item>
                                  <Descriptions.Item label="Gravity">
                                    {item.gravity}
                                  </Descriptions.Item>
                                </Descriptions>
                              }
                            />
                          </List.Item>
                        )}
                        dataSource={form.getFieldValue("gravity_readings")}
                      />
                    </ConfigProvider>
                    <Typography.Title level={4}>Process Notes</Typography.Title>
                    <FormFlex>
                      <Form.Item label="Brewing Notes" name="brewing_notes">
                        <Input.TextArea style={{ width: 300 }} />
                      </Form.Item>
                      <Form.Item
                        label="Fermentation Notes"
                        name="fermentation_notes"
                      >
                        <Input.TextArea style={{ width: 300 }} />
                      </Form.Item>
                      <Form.Item label="Hop Notes" name="hop_notes">
                        <Input.TextArea style={{ width: 300 }} />
                      </Form.Item>
                      <Form.Item label="Yeast Notes" name="yeast_notes">
                        <Input.TextArea style={{ width: 300 }} />
                      </Form.Item>
                      <Form.Item label="Other Notes" name="other_notes">
                        <Input.TextArea style={{ width: 300 }} />
                      </Form.Item>
                      <Form.Item label="Packaging Notes" name="packaging_notes">
                        <Input.TextArea style={{ width: 300 }} />
                      </Form.Item>
                      <Form.Item label="Tasting Notes" name="tasting_notes">
                        <Input.TextArea style={{ width: 300 }} />
                      </Form.Item>
                    </FormFlex>
                  </>
                ),
              },
              {
                key: "2",
                label: "Recipe",
                children: (
                  <>
                    Select an existing recipe:
                    <Select
                      value={
                        recipeToShow ? recipeToShow.name : "Select a recipe"
                      }
                      optionFilterProp="children"
                      onChange={async (newRecipeId) => {
                        setRecipeId(newRecipeId);
                      }}
                      style={{ width: 240, marginLeft: 10, marginRight: 10 }}
                    >
                      {recipeList?.results.map((recipe) => {
                        return (
                          <Select.Option key={recipe.id} value={recipe.id}>
                            {recipe.name}
                          </Select.Option>
                        );
                      })}
                    </Select>{" "}
                    or <Link to={"/recipes/new/"}>create a new recipe</Link>.
                    <div style={{ marginTop: 20 }}>
                      {recipeToShow ? (
                        <ReadOnlyRecipe recipe={recipeToShow} />
                      ) : (
                        "No recipe is selected. Please choose one from the dropdown above."
                      )}
                    </div>
                  </>
                ),
              },
            ]}
          />
          <Affix offsetBottom={10} style={{ float: "right" }}>
            <Space>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Save
                </Button>
              </Form.Item>
              <Form.Item>
                <Button onClick={goBackToBrewLogList}>
                  Back to Brew Log List
                </Button>
              </Form.Item>
            </Space>
          </Affix>
        </Form>
      </Content>
      {!!gravityReading && (
        <GravityReadingModal
          onCancel={() => setGravityReading(null)}
          onOk={handleGravityReadingOk}
          gravityReading={gravityReading}
        />
      )}
      <Modal
        title="Delete Gravity Reading?"
        onCancel={() => setGravityReadingToDelete(null)}
        onOk={handleGravityReadingDelete}
        open={gravityReadingToDelete !== null}
      >
        Are you sure you want to delete this gravity reading?
      </Modal>
    </>
  );
};

export default BrewLogDetailPage;
