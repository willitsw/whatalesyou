import { Button, Form, Input, Modal, Space } from "antd";

import { useEffect, useState } from "react";

import styles from "./login.module.css";
import {
  selectShowLoginModal,
  setShowLoginModal,
} from "../../../redux/global-modals";
import { useAppSelector, useAppDispatch } from "../../../redux/store";
import React from "react";
import { useAnalytics } from "../../../utils/analytics";
import { TokenRequest } from "../../../types/user";
import { useNavigate } from "react-router-dom";
import { useCurrentUser } from "../../user-context/user-context";

const LoginModal = () => {
  const [form] = Form.useForm();
  const { loginUser } = useCurrentUser();
  const [modalLoading, setModalLoading] = useState<boolean>(false);
  const showLoginModal = useAppSelector(selectShowLoginModal);
  const dispatch = useAppDispatch();
  const { fireAnalyticsEvent } = useAnalytics();
  const navigate = useNavigate();

  const onCancel = () => dispatch(setShowLoginModal(false));

  useEffect(() => {
    const onKeyDown = (e) => {
      if (e.key === "Enter") {
        handleSubmit();
      }
    };

    window.addEventListener("keydown", onKeyDown);
    return () => window.removeEventListener("keydown", onKeyDown);
  }, []);

  const handleSubmit = async () => {
    setModalLoading(true);
    try {
      await form.validateFields();
      const values: TokenRequest = form.getFieldsValue();
      loginUser(values);
      fireAnalyticsEvent("Email/Password Sign In");
      onCancel();
    } catch (error) {
      console.log("form submission failed:", error);
    }
    setModalLoading(false);
  };

  return (
    <Form name="sign-in" form={form} autoComplete="off">
      <Modal
        title="Sign In"
        open={showLoginModal}
        onOk={handleSubmit}
        onCancel={onCancel}
        confirmLoading={modalLoading}
        forceRender
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[
            { required: true, message: "Email is required" },
            { type: "email", message: "Email is invalid" },
          ]}
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
          onClick={() => {
            navigate("/user/new");
            onCancel();
          }}
          type="link"
        >
          Create Account
        </Button>

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
    </Form>
  );
};

export default LoginModal;
