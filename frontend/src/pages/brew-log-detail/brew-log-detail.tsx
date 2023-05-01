import React, { Children, useEffect, useState } from "react";
import Content from "../../components/content/content";
import { selectBrewSettings } from "../../redux/brew-settings";
import {
  Affix,
  Button,
  Col,
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
  Row,
  Select,
  Space,
  Tabs,
  Tooltip,
  Typography,
} from "antd";
import { Link, useLocation, useNavigate, useParams } from "react-router-dom";
import {
  processCreateUpdateBrewLog,
  refreshBrewLogList,
  selectBrewLogCount,
  selectBrewLogList,
  selectCurrentBrewLog,
  setCurrentBrewLog,
} from "../../redux/brew-log";
import {
  getBrewLogById,
  getRecipeById,
  getRecipesByUser,
} from "../../utils/api-calls";
import { setPageIsClean } from "../../redux/global-modals";
import { DATE_FORMAT } from "../../constants";
import ReadOnlyRecipe from "../../components/read-only-recipe/read-only-recipe";
import OkCancelModal from "../../components/ok-cancel-modal/ok-cancel-modal";
import { DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs, { Dayjs } from "dayjs";
import { Recipe, RecipeDetailed } from "../../types/recipe";
import { BrewLog, BrewLogStatuses, GravityReading } from "../../types/brew-log";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import ElementWithLabel from "../../components/form-layouts/element-with-label";
import { selectCurrentUser } from "../../redux/user";
import { v4 as uuid } from "uuid";

const BrewLogDetailPage = () => {
  const brewSettings = useAppSelector(selectBrewSettings);
  const user = useAppSelector(selectCurrentUser);
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [brewLog, setBrewLog] = useState<BrewLog>();
  const brewLogList = useAppSelector(selectBrewLogList);
  const brewLogCount = useAppSelector(selectBrewLogCount);
  const [loading, setLoading] = useState<boolean>(true);
  const [recipe, setRecipe] = useState<RecipeDetailed>(null);
  const [gravityReadingToDelete, setGravityReadingToDelete] =
    useState<string>(null);
  const [gravityReading, setGravityReading] = useState<GravityReading>(null);
  const [recipeList, setRecipeList] = useState<Recipe[]>([]);

  useEffect(() => {
    const onComponentLoad = async () => {
      if (brewLogList?.length === 0) {
        dispatch(refreshBrewLogList());
      }
      let workingBrewLog: BrewLog;
      if (location.pathname.includes("/brew-log/edit") && id) {
        workingBrewLog = await getBrewLogById(id);
      } else {
        workingBrewLog = {
          ...getBrewLog(),
          batch_number: brewLogCount + 1,
        };
      }
      setBrewLog(workingBrewLog);

      if (workingBrewLog.recipe) {
        const recipe = await getRecipeById(workingBrewLog.recipe);
        setRecipe(recipe);
      }
      const recipeResponse = await getRecipesByUser();
      setRecipeList(recipeResponse.results);
      setLoading(false);
    };
    onComponentLoad();
  }, [location.pathname, brewSettings, user]);

  const getBrewLog = (): BrewLog => ({
    name: "New Brew Log Entry",
    brew_date: dayjs().toISOString(),
    id: uuid(),
    status: "in_progress",
    owner: user.id,
    batch_number: 0,
    gravity_readings: [],
    brewing_notes: "",
    fermentation_notes: "",
    hop_notes: "",
    other_notes: "",
    tasting_notes: "",
    yeast_notes: "",
    packaging_notes: "",
  });

  const getDefaultGravityReading = (): GravityReading => ({
    id: uuid(),
    date: dayjs().toISOString(),
    gravity: 1,
    notes: "",
    brew_log: brewLog.id,
  });

  const handleAddGravityReading = () => {
    setGravityReading(getDefaultGravityReading());
  };

  const handleSave = () => {
    const brewLogToSave = { ...brewLog };

    if (recipe) {
      brewLogToSave.recipe = recipe.id;
    }

    brewLogToSave.brew_date = dayjs(brewLog.brew_date).format("YYYY-MM-DD");

    dispatch(processCreateUpdateBrewLog(brewLogToSave));
    dispatch(setPageIsClean(true));
    message.success("Brew Log has been saved.");
  };

  const handleFieldChange = (value: any, key: any) => {
    dispatch(setPageIsClean(false));
    const newBrewLog = { ...brewLog };
    newBrewLog[key] = value;
    setBrewLog(newBrewLog);
  };

  const handleGravityReadingChange = (value: any, key: any) => {
    const newGravityReading = { ...gravityReading };
    newGravityReading[key] = value;
    setGravityReading(newGravityReading);
  };

  const handleGravityReadingOk = () => {
    const newBrewLog = { ...brewLog };
    const idxToReplace = newBrewLog.gravity_readings.findIndex(
      (reading) => reading.id === gravityReading.id
    );
    if (idxToReplace >= 0) {
      newBrewLog.gravity_readings[idxToReplace] = gravityReading;
    } else {
      newBrewLog.gravity_readings.push(gravityReading);
    }
    setBrewLog(newBrewLog);
    setGravityReading(null);
  };

  const handleGravityReadingDelete = () => {
    const newBrewLog = { ...brewLog };
    newBrewLog.gravity_readings = newBrewLog.gravity_readings.filter(
      (g) => g.id !== gravityReadingToDelete
    );
    setBrewLog(newBrewLog);
    setGravityReadingToDelete(null);
  };

  const goBackToBrewLogList = () => {
    navigate("/brew-log/list/");
  };

  return (
    <>
      <Content
        pageTitle={!loading ? brewLog?.name ?? "" : ""}
        isLoading={loading}
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
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 10,
                      marginBottom: 50,
                    }}
                  >
                    <ElementWithLabel
                      formElement={
                        <Input
                          value={brewLog?.name}
                          onChange={(value) =>
                            handleFieldChange(value.target.value, "name")
                          }
                          style={{ maxWidth: "100%" }}
                        />
                      }
                      label="Brew Session Name"
                      orientation="column"
                    />
                    <ElementWithLabel
                      formElement={
                        <DatePicker
                          format={(date) =>
                            dayjs(date.toISOString()).format(DATE_FORMAT)
                          }
                          value={dayjs(brewLog?.brew_date)}
                          onChange={(date) =>
                            handleFieldChange(date.toISOString(), "brew_date")
                          }
                        />
                      }
                      label="Brew Date"
                      orientation="column"
                    />
                    <ElementWithLabel
                      formElement={
                        <Radio.Group
                          value={brewLog?.status}
                          onChange={(value) =>
                            handleFieldChange(value.target.value, "status")
                          }
                        >
                          <Radio.Button value="in_progress">
                            In Progress
                          </Radio.Button>
                          <Radio.Button value="complete">Complete</Radio.Button>
                        </Radio.Group>
                      }
                      label="Status"
                      orientation="column"
                    />
                    <ElementWithLabel
                      formElement={
                        <InputNumber
                          value={brewLog?.batch_number.toString()}
                          onChange={(value) =>
                            handleFieldChange(value, "batch_number")
                          }
                          min="0"
                          max="100"
                          step="1"
                        />
                      }
                      label="Batch Number"
                      orientation="column"
                    />
                  </div>
                  <ConfigProvider renderEmpty={() => null}>
                    <List
                      header={
                        <div
                          style={{
                            display: "flex",
                            justifyContent: "space-between",
                          }}
                        >
                          <Typography.Title level={4}>
                            Gravity Readings
                          </Typography.Title>
                          <Button
                            style={{ marginLeft: "15px" }}
                            type="primary"
                            onClick={handleAddGravityReading}
                          >
                            Add Gravity Reading
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
                      dataSource={brewLog?.gravity_readings}
                    />
                  </ConfigProvider>
                  <Typography.Title level={4}>Process Notes</Typography.Title>
                  <div
                    style={{
                      display: "flex",
                      flexWrap: "wrap",
                      flexDirection: "row",
                      justifyContent: "space-between",
                      gap: 10,
                      marginBottom: 50,
                    }}
                  >
                    <ElementWithLabel
                      formElement={
                        <Input.TextArea
                          value={brewLog?.brewing_notes}
                          onChange={(value) =>
                            handleFieldChange(
                              value.target.value,
                              "brewing_notes"
                            )
                          }
                        />
                      }
                      label="Brewing Notes"
                      orientation="column"
                    />
                    <ElementWithLabel
                      formElement={
                        <Input.TextArea
                          value={brewLog?.fermentation_notes}
                          onChange={(value) =>
                            handleFieldChange(
                              value.target.value,
                              "fermentation_notes"
                            )
                          }
                        />
                      }
                      label="Fermentation Notes"
                      orientation="column"
                    />
                    <ElementWithLabel
                      formElement={
                        <Input.TextArea
                          value={brewLog?.hop_notes}
                          onChange={(value) =>
                            handleFieldChange(value.target.value, "hop_notes")
                          }
                        />
                      }
                      label="Hop Notes"
                      orientation="column"
                    />
                    <ElementWithLabel
                      formElement={
                        <Input.TextArea
                          value={brewLog?.yeast_notes}
                          onChange={(value) =>
                            handleFieldChange(value.target.value, "yeast_notes")
                          }
                        />
                      }
                      label="Yeast Notes"
                      orientation="column"
                    />
                    <ElementWithLabel
                      formElement={
                        <Input.TextArea
                          value={brewLog?.other_notes}
                          onChange={(value) =>
                            handleFieldChange(value.target.value, "other_notes")
                          }
                        />
                      }
                      label="Other Notes"
                      orientation="column"
                    />
                    <ElementWithLabel
                      formElement={
                        <Input.TextArea
                          value={brewLog?.packaging_notes}
                          onChange={(value) =>
                            handleFieldChange(
                              value.target.value,
                              "packaging_notes"
                            )
                          }
                        />
                      }
                      label="Packaging Notes"
                      orientation="column"
                    />
                    <ElementWithLabel
                      formElement={
                        <Input.TextArea
                          value={brewLog?.tasting_notes}
                          onChange={(value) =>
                            handleFieldChange(
                              value.target.value,
                              "tasting_notes"
                            )
                          }
                        />
                      }
                      label="Tasting Notes"
                      orientation="column"
                    />
                  </div>
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
                    value={recipe ? recipe.name : "Select a recipe"}
                    optionFilterProp="children"
                    onChange={async (newRecipeId) => {
                      const newRecipe = await getRecipeById(newRecipeId);
                      setRecipe(newRecipe);
                    }}
                    style={{ width: 240, marginLeft: 10, marginRight: 10 }}
                  >
                    {recipeList.map((recipe) => {
                      return (
                        <Select.Option key={recipe.id} value={recipe.id}>
                          {recipe.name}
                        </Select.Option>
                      );
                    })}
                  </Select>{" "}
                  or <Link to={"/recipes/new/"}>create a new recipe</Link>.
                  <div style={{ marginTop: 20 }}>
                    {recipe ? (
                      <ReadOnlyRecipe recipe={recipe} />
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
              <Button type="primary" htmlType="submit" onClick={handleSave}>
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
      </Content>
      {/* <OkCancelModal
        onCancel={() => setRecipeId(null)}
        onSubmit={() => handleChangeRecipe(recipeId)}
        showModal={recipeId !== null}
        title="Change recipe in brew log?"
      >
        This selected recipe does not exist in your Recipe List anymore. If you
        change this, it will be lost forever. Continue?
      </OkCancelModal> */}
      <Modal
        title="Add/Edit Gravity Reading"
        onCancel={() => setGravityReading(null)}
        onOk={handleGravityReadingOk}
        open={gravityReading !== null}
      >
        <>
          <ElementWithLabel
            formElement={
              <Input
                value={gravityReading?.notes}
                onChange={(value) =>
                  handleGravityReadingChange(value.target.value, "notes")
                }
                style={{ maxWidth: "100%" }}
              />
            }
            label="Notes"
            orientation="column"
          />
          <ElementWithLabel
            formElement={
              <InputNumber
                value={gravityReading?.gravity.toString()}
                onChange={(value) =>
                  handleGravityReadingChange(value, "gravity")
                }
                min="0"
                max="2"
                step=".001"
              />
            }
            label="Gravity"
            orientation="column"
          />
          <ElementWithLabel
            formElement={
              <DatePicker
                format={(date) => dayjs(date.toISOString()).format(DATE_FORMAT)}
                value={dayjs(gravityReading?.date)}
                onChange={(date) =>
                  handleGravityReadingChange(date.toISOString(), "date")
                }
              />
            }
            label="Reading Date"
            orientation="column"
          />
        </>
      </Modal>
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
