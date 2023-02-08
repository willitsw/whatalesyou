import { Button, Form, Input, Modal, Space, Typography } from "antd";

import { useState } from "react";
import { FacebookOutlined, GoogleOutlined } from "@ant-design/icons";

import styles from "./index.module.css";
import {
  selectShowLoginModal,
  setShowLoginModal,
} from "../../../redux/global-modals/slice";
import { useAppSelector, useAppDispatch } from "../../../redux/hooks";
import React from "react";
import { useAnalytics } from "../../../utils/analytics";
import { loginUser } from "../../../redux/user/slice";

declare const window: any;

interface FormValues {
  username: string;
  password: string;
}

const LoginModal = () => {
  const [form] = Form.useForm();
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const showLoginModal = useAppSelector(selectShowLoginModal);
  const dispatch = useAppDispatch();
  const { fireAnalyticsEvent } = useAnalytics();

  const onCancel = () => dispatch(setShowLoginModal(false));

  const handleGoogleSignIn = async () => {
    try {
      fireAnalyticsEvent("Google Sign In");
    } catch (error) {
      console.log("google signup failed:", error);
    }
    onCancel();
  };

  const handleFacebookSignIn = async () => {
    try {
      fireAnalyticsEvent("Facebook Sign In");
    } catch (error) {
      console.log("facebook signup failed:", error);
    }
    onCancel();
  };

  const handleCreateAccount = async () => {
    setModalLoading(true);
    try {
      await form.validateFields();
      const values: FormValues = form.getFieldsValue();
      fireAnalyticsEvent("Email/Password Account Created");
    } catch (error) {
      console.log("email / password signup failed:", error);
    }
    setModalLoading(false);
    onCancel();
  };

  const handleSubmit = async () => {
    setModalLoading(true);
    try {
      await form.validateFields();
      const values: FormValues = form.getFieldsValue();
      dispatch(loginUser(values));
      fireAnalyticsEvent("Email/Password Sign In");
    } catch (error) {
      console.log("form submission failed:", error);
    }
    setModalLoading(false);
    onCancel();
  };

  return (
    <Modal
      title="Sign In"
      visible={showLoginModal}
      onOk={handleSubmit}
      onCancel={onCancel}
      confirmLoading={modalLoading}
      forceRender
    >
      <Form name="sign-up" form={form} autoComplete="off">
        <Form.Item
          label="User Name"
          name="username"
          rules={[{ required: true, message: "Username is required" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item
          label="Password"
          name="password"
          rules={[
            { required: true, message: "Password is required" },
            { min: 6, message: "Password must be minimum 6 characters." },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Button
          style={{ float: "right" }}
          onClick={handleCreateAccount}
          type="link"
        >
          Create Account
        </Button>
      </Form>
      <Space
        className={styles["other-providers"]}
        align="center"
        direction="vertical"
      >
        {/* <Typography.Title level={5}>- or -</Typography.Title>
        <Button
          icon={<GoogleOutlined />}
          type="primary"
          onClick={handleGoogleSignIn}
        >
          Sign in with Google
        </Button> */}
        {/* <Button
          icon={<FacebookOutlined />}
          type="primary"
          onClick={handleFacebookSignIn}
        >
          Sign in with Facebook
        </Button> */}
      </Space>
    </Modal>
  );
};

export default LoginModal;
