import Content from "../../components/content/content";
import React, { useState } from "react";
import { Button, Form, Input, Typography, message } from "antd";
import {
  forgotPasswordValidationCodeReset,
  processForgotPassword,
} from "../../utils/api-calls";
import { useForm } from "antd/es/form/Form";
import { ResetPasswordRequest } from "../../types/user";
import { useCurrentUser } from "../../components/user-context/user-context";
import { useNavigate } from "react-router-dom";
import { useAppDispatch } from "../../redux/store";
import { setShowLoginModal } from "../../redux/global-modals";

export const ForgotPassword = () => {
  const [form] = useForm<ResetPasswordRequest>();
  const { logoutUser } = useCurrentUser();
  const [codeSent, setCodeSent] = useState<boolean>(false);
  const [email, setEmail] = useState<string>("");
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleResetCode = async () => {
    const result = await forgotPasswordValidationCodeReset(email);
    if (result.ok) {
      message.success(
        `If the email you supplied is registered, you will receive a new code. Please enter it below with your new password.`
      );
      setCodeSent(true);
    } else {
      message.error(
        "There was a problem generating your new validation code. Please try again."
      );
    }
  };

  const handleSubmitResetPassword = async (values: ResetPasswordRequest) => {
    console.log("hit it");
    if (values.code && values.password) {
      const result = await processForgotPassword({ ...values, email });
      if (result.ok) {
        message.success(`The password was reset! Please login again.`);
        logoutUser();
        navigate("/home/");
        dispatch(setShowLoginModal(true));
      } else {
        message.error(
          "There was a problem resetting your password. Please try again."
        );
      }
    }
  };

  return (
    <Content pageTitle="Forgot your password?">
      <Typography.Paragraph>
        {!codeSent
          ? "Enter your email, and send a code to it:"
          : "Enter the code sent to your email, and choose a new password"}
      </Typography.Paragraph>
      <Form
        form={form}
        name="forgot-password"
        onFinish={handleSubmitResetPassword}
        autoComplete="off"
        layout="vertical"
      >
        {!codeSent ? (
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <Form.Item label="Email" rules={[{ required: true }]}>
              <Input
                onChange={(e) => setEmail(e.target.value)}
                style={{ width: 250 }}
              />
            </Form.Item>
            <Button
              type="text"
              style={{ marginBottom: 25, marginLeft: 10 }}
              onClick={handleResetCode}
            >
              Send Code
            </Button>
          </div>
        ) : (
          <>
            <Form.Item label="Verification Code" name="code">
              <Input style={{ width: 250 }} />
            </Form.Item>
            <Form.Item label="Password" name="password">
              <Input.Password style={{ width: 250 }} />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              rules={[
                {
                  required: true,
                  message: "Please confirm your password!",
                },
                ({ getFieldValue }) => ({
                  validator(_, value) {
                    if (!value || getFieldValue("password") === value) {
                      return Promise.resolve();
                    }
                    return Promise.reject(
                      new Error(
                        "The new password that you entered do not match!"
                      )
                    );
                  },
                }),
              ]}
            >
              <Input.Password style={{ width: 250 }} />
            </Form.Item>
            <div
              style={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "flex-start",
                gap: 10,
              }}
            >
              <Button type="primary" htmlType="submit">
                Submit
              </Button>
              <Button type="text" onClick={handleResetCode}>
                Send Another Code
              </Button>
            </div>
          </>
        )}
      </Form>
    </Content>
  );
};
