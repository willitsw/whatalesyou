import React, { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { User, UserForm } from "../../types/user";
import Content from "../../components/content/content";
import { Affix, Button, Input, Space, message, Form } from "antd";
import { useCurrentUser } from "../../components/user-context/user-context";
import { useCreateUser, useUpdateUser } from "../../utils/api-calls";

const UserSettingsPage = () => {
  const { user, loginUser } = useCurrentUser();
  const [updatedUser, setUpdatedUser] = useState<User>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const { mutateAsync: createUser } = useCreateUser();
  const { mutateAsync: updateUser } = useUpdateUser();
  const [form] = Form.useForm<UserForm>();

  const validateMessages = {
    required: "${label} is required!",
    types: {
      email: "${label} is not a valid email!",
      number: "${label} is not a valid number!",
    },
    number: {
      range: "${label} must be between ${min} and ${max}",
    },
  };

  if (user && !updatedUser) {
    setUpdatedUser(user);
  }

  const isCreateNewUser = id === "new";

  const handleCreateUpdateUser = async (values: UserForm) => {
    if (isCreateNewUser) {
      await createUser(values);
      await loginUser(values);
      navigate("/token-validator");
    } else {
      await updateUser({ ...user, ...values });
      message.success("Successfully updated user!");
      navigate("/home");
    }
  };

  return (
    <Content
      isLoading={!isCreateNewUser && !user}
      pageTitle={
        isCreateNewUser
          ? "Create New User"
          : `Edit ${updatedUser?.email ?? "User"}`
      }
    >
      <Form
        form={form}
        initialValues={user}
        name="user-settings"
        onFinish={handleCreateUpdateUser}
        autoComplete="off"
        validateMessages={validateMessages}
        style={{ maxWidth: 600 }}
      >
        <Form.Item
          label="Email"
          name="email"
          rules={[{ required: true, type: "email" }]}
        >
          <Input />
        </Form.Item>
        <Form.Item label="First Name" name="first_name">
          <Input />
        </Form.Item>
        <Form.Item label="Last Name" name="last_name">
          <Input />
        </Form.Item>
        {isCreateNewUser && (
          <>
            <Form.Item
              label="Password"
              name="password"
              data-testid="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password />
            </Form.Item>
            <Form.Item
              name="confirm"
              label="Confirm Password"
              dependencies={["password"]}
              hasFeedback
              data-testid="confirm-password"
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
              <Input.Password />
            </Form.Item>
          </>
        )}
        <Affix offsetBottom={10}>
          <div
            style={{
              float: "right",
              display: "flex",
              flexDirection: "row",
              gap: "5px",
              flexWrap: "wrap",
            }}
          >
            <Button type="primary" htmlType="submit">
              {isCreateNewUser ? "Create" : "Save User"}
            </Button>
            <Button onClick={() => navigate("/home")}>Go Home</Button>
            {!isCreateNewUser && (
              <Button
                style={{ float: "right" }}
                onClick={() => {
                  navigate("/forgot-password");
                }}
                type="link"
              >
                Change Password?
              </Button>
            )}
          </div>
        </Affix>
      </Form>
    </Content>
  );
};

export default UserSettingsPage;
