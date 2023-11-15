import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Table, Button, Space, Tooltip } from "antd";
import { useAppSelector, useAppDispatch } from "../../redux/store";
import OkCancelModal from "../../components/ok-cancel-modal/ok-cancel-modal";

import { DeleteOutlined } from "@ant-design/icons";
import React from "react";
import dayjs from "dayjs";
import { DATE_FORMAT } from "../../constants";
import { useAnalytics } from "../../utils/analytics";
import { Breakpoint } from "antd/es/_util/responsiveObserver";
import { BrewLog, BrewLogStatuses } from "../../types/brew-log";
import { BrewLogStatusLookup } from "../../types/shared";
import { useDeleteBrewLog, useGetBrewLogsByUser } from "../../utils/api-calls";

const BrewLogListTable = () => {
  const [idToDelete, setIdToDelete] = useState<string>(null);
  const { data: brewLogList, isLoading: brewLogListIsLoading } =
    useGetBrewLogsByUser();
  const { mutateAsync: processDeleteBrewLog } = useDeleteBrewLog(idToDelete);
  const navigate = useNavigate();
  const { fireAnalyticsEvent } = useAnalytics();

  const loading = brewLogListIsLoading;

  const handleDeleteBrewLog = async () => {
    if (idToDelete) {
      processDeleteBrewLog();
      fireAnalyticsEvent("Brew Log Deleted", { brewLogId: idToDelete });
    }
    setIdToDelete(null);
  };

  const showOnlyDesktop: Breakpoint[] = ["md"];

  const columnDefinitions = [
    {
      title: "Brew Session",
      dataIndex: "name",
      key: "name",
      render: (text: string, record: BrewLog) => (
        <Link to={"/brew-log/edit/" + record.id}>{text}</Link>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
    },
    {
      title: "Brew Date",
      dataIndex: "brewDate",
      key: "brewDate",
      responsive: showOnlyDesktop,
      render: (text: string) => dayjs(text).format(DATE_FORMAT),
    },
    {
      title: "Action",
      key: "action",
      render: (text: string, record: BrewLog) => (
        <Space>
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

  const preparedBrewLogData = brewLogList?.results.map((brewLog) => {
    return {
      ...brewLog,
      key: brewLog.id,
      status: BrewLogStatusLookup[brewLog.status] as BrewLogStatuses,
    };
  });

  return (
    <>
      <Button
        style={{ marginBottom: 10 }}
        type="primary"
        onClick={() => {
          navigate("/brew-log/new");
          fireAnalyticsEvent("Brew Log Created");
        }}
      >
        New Brew Log
      </Button>
      <Table
        columns={columnDefinitions}
        dataSource={preparedBrewLogData}
        loading={loading}
      />
      <OkCancelModal
        onCancel={() => setIdToDelete(null)}
        onSubmit={() => handleDeleteBrewLog()}
        showModal={idToDelete !== null}
        title="Delete brew log?"
      >
        This cannot be undone.
      </OkCancelModal>
    </>
  );
};

export default BrewLogListTable;
