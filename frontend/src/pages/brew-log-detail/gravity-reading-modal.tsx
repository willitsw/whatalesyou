import { Modal, Input, InputNumber, DatePicker, Form } from "antd";
import React from "react";
import { GravityReading } from "../../types/brew-log";
import { useForm } from "antd/es/form/Form";
import { FormFlex } from "../../components/form-layouts/form-flex";
import { DATE_FORMAT } from "../../constants";
import dayjs from "dayjs";

interface GravityReadingModalProps {
  onCancel: () => void;
  onOk: (gravityReading: GravityReading) => void;
  gravityReading: GravityReading;
}

export const GravityReadingModal = ({
  onCancel,
  onOk,
  gravityReading,
}: GravityReadingModalProps) => {
  const [form] = useForm<GravityReading>();

  return (
    <Modal
      title="Add/Edit Gravity Reading"
      onCancel={onCancel}
      onOk={() => onOk(form.getFieldsValue())}
      open
    >
      <Form
        form={form}
        initialValues={{
          ...gravityReading,
          date: gravityReading.date ? dayjs(gravityReading.date) : dayjs(),
        }}
        name="gravity-reading-crud"
        autoComplete="off"
        layout="vertical"
        preserve
      >
        <FormFlex>
          <Form.Item label="Notes" name="notes" rules={[{ required: true }]}>
            <Input style={{ maxWidth: "100%" }} />
          </Form.Item>
          <Form.Item
            label="Gravity"
            name="gravity"
            rules={[{ required: true }]}
          >
            <InputNumber min="0" max="2" step=".001" />
          </Form.Item>
          <Form.Item
            label="Reading Date"
            name="date"
            rules={[{ required: true }]}
          >
            <DatePicker format={DATE_FORMAT} />
          </Form.Item>
        </FormFlex>
      </Form>
    </Modal>
  );
};
