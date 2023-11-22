import Content from "../../components/content/content";
import React, { useState } from "react";
import ElementWithLabel from "../../components/form-layouts/element-with-label";
import { Button, Input, Typography, message } from "antd";
import { useNavigate } from "react-router-dom";
import { validateEmailToken } from "../../utils/api-calls";

export const TokenValidator = () => {
  const [verificationCode, setVerificationCode] = useState<string>("");
  const navigate = useNavigate();

  const handleSubmitVerificationCode = async () => {
    const result = await validateEmailToken({ token: verificationCode });
    if (!result.ok) {
      navigate("/home");
    } else {
      message.error(
        "Invalid token supplied, please try again or generate a new token."
      );
    }
  };

  return (
    <Content pageTitle="Verify Token">
      <Typography.Paragraph>
        Please enter the verification code sent by email:
      </Typography.Paragraph>
      <ElementWithLabel
        formElement={
          <Input
            value={verificationCode}
            onChange={(value) => setVerificationCode(value.target.value)}
            style={{ width: 300 }}
          />
        }
        label="Verification Code"
        orientation="column"
      />
      <Button type="primary" onClick={handleSubmitVerificationCode}>
        Submit
      </Button>
    </Content>
  );
};
