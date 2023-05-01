import React, { useEffect, useState } from "react";
import { Form, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppSelector } from "../../redux/store";
import { selectCurrentUser } from "../../redux/user";
import { User } from "../../types/user";
import { v4 as uuid } from "uuid";
import Content from "../../components/content/content";
import ElementWithLabel from "../../components/form-layouts/element-with-label";
import { Affix, Button, Input, Space } from "antd";

const defaultUser: User = {
  email: "",
  first_name: "",
  last_name: "",
  id: uuid(),
  is_staff: false,
};

const UserSettingsPage = () => {
  const location = useLocation();
  const currentUser = useAppSelector(selectCurrentUser);
  const [user, setUser] = useState<User>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>(null);
  const [passwordConfirm, setPasswordConfirm] = useState<string>(null);
  const [passwordVisible, setPasswordVisible] = React.useState(false);

  const isCreateNewUser = id === "new";

  useEffect(() => {
    const onComponentLoad = async () => {
      if (isCreateNewUser) {
        setUser(defaultUser);
      } else {
        setUser({ ...currentUser });
      }
    };
    if (currentUser) {
      onComponentLoad();
    }
  }, [location.pathname, currentUser]);

  const handleFieldChange = (value: any, key: any) => {
    const newUser = { ...user };
    newUser[key] = value;
    setUser(newUser);
  };

  return (
    <Content
      pageTitle={
        isCreateNewUser ? "Create New User" : `Edit ${currentUser?.email}`
      }
    >
      <ElementWithLabel
        formElement={
          <Input
            value={user?.email}
            onChange={(value) => handleFieldChange(value.target.value, "email")}
            style={{ width: 300, marginBottom: 20 }}
          />
        }
        label="Email"
        orientation="column"
      />
      <ElementWithLabel
        formElement={
          <Input
            value={user?.first_name}
            onChange={(value) =>
              handleFieldChange(value.target.value, "first_name")
            }
            style={{ width: 300, marginBottom: 20 }}
          />
        }
        label="First Name"
        orientation="column"
      />
      <ElementWithLabel
        formElement={
          <Input
            value={user?.last_name}
            onChange={(value) =>
              handleFieldChange(value.target.value, "last_name")
            }
            style={{ width: 300, marginBottom: 20 }}
          />
        }
        label="Last Name"
        orientation="column"
      />
      {isCreateNewUser && (
        <>
          <ElementWithLabel
            formElement={
              <Input.Password
                value={user?.last_name}
                onChange={(value) => setPassword(value.target.value)}
                style={{ width: 300, marginBottom: 20 }}
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
              />
            }
            label="Password"
            orientation="column"
          />
          <ElementWithLabel
            formElement={
              <Input.Password
                value={user?.last_name}
                onChange={(value) => setPasswordConfirm(value.target.value)}
                visibilityToggle={{
                  visible: passwordVisible,
                  onVisibleChange: setPasswordVisible,
                }}
                style={{ width: 300, marginBottom: 20 }}
              />
            }
            label="Confirm Password"
            orientation="column"
          />
        </>
      )}
      <Affix offsetBottom={10} style={{ float: "right" }}>
        <Space>
          <Button type="primary">
            {isCreateNewUser ? "Create" : "Save User"}
          </Button>
          <Button onClick={() => navigate("/home")}>Go Home</Button>
        </Space>
      </Affix>
    </Content>
  );
};

export default UserSettingsPage;
