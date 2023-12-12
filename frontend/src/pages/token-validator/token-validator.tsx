import Content from "../../components/content/content";
import React from "react";
import { Button, Form, Input, Typography, message } from "antd";
import { resetValidationCode, validateEmailToken } from "../../utils/api-calls";
import { useForm } from "antd/es/form/Form";
import { EmailValidationRequest } from "../../types/user";
import { FormFlex } from "../../components/form-layouts/form-flex";
import { useCurrentUser } from "../../components/user-context/user-context";

export const TokenValidator = () => {
  const [form] = useForm<EmailValidationRequest>();
  const { user, logoutUser } = useCurrentUser();

  const handleSubmitVerificationCode = async (
    values: EmailValidationRequest
  ) => {
    const result = await validateEmailToken(values);
    if (result.ok) {
      window.location.reload();
    } else {
      message.error(
        "Invalid token supplied, please try again or send a new token."
      );
    }
  };

  const handleResetCode = async () => {
    const result = await resetValidationCode();
    if (result.ok) {
      message.success(
        `A new validation code was sent to your email (${user.email}). Please check your email and enter the new code.`
      );
    } else {
      message.error(
        "There was a problem generating your new validation code. Please try again."
      );
    }
  };

  return (
    <Content pageTitle="Verify Token">
      <Typography.Paragraph>
        Please enter the verification code sent by email when you created this
        account:
      </Typography.Paragraph>
      <Form
        form={form}
        name="token-validator"
        onFinish={handleSubmitVerificationCode}
        autoComplete="off"
        layout="vertical"
      >
        <FormFlex>
          <Form.Item
            label="Verification Code"
            name="token"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>
        </FormFlex>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            justifyContent: "flex-start",
            gap: 10,
          }}
        >
          <Button
            type="primary"
            htmlType="submit"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                form.submit();
              }
            }}
          >
            Submit
          </Button>
          <Button type="text" onClick={handleResetCode}>
            Send New Code
          </Button>
          <Button type="text" onClick={logoutUser}>
            Logout
          </Button>
        </div>
      </Form>
    </Content>
  );
};
