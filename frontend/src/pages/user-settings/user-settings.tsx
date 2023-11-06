import React, { useEffect, useState } from "react";
import { Form, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
import {
  createNewUser,
  loginUser,
  selectCurrentUser,
  selectUserName,
  updateExistingUser,
} from "../../redux/user";
import { User } from "../../types/user";
import { v4 as uuid } from "uuid";
import Content from "../../components/content/content";
import ElementWithLabel from "../../components/form-layouts/element-with-label";
import { Affix, Button, Input, Space, message } from "antd";
import { isEmail } from "../../utils/validators";
import { createUser } from "../../utils/api-calls";

const defaultUser: User = {
  email: "",
  first_name: "",
  last_name: "",
  id: uuid(),
  is_staff: false,
  is_verified: false,
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
  const dispatch = useAppDispatch();
  const userName = useAppSelector(selectUserName);
  const [validations, setValidations] = useState<any>({});

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

  const validateForm = (key?: any, value?: any): boolean => {
    let isValid = true;
    if (!key || key === "email") {
      if (!isEmail(value)) {
        setValidations({ ...validations, email: false });
        isValid = false;
      }
    }

    return isValid;
  };

  const handleFieldChange = (value: any, key: any) => {
    const newUser = { ...user };
    newUser[key] = value;
    setUser(newUser);
  };

  const handleCreateUpdateUser = async () => {
    if (!validateForm) {
      message.error("Please fix the errors in this form and try again.");
      return;
    } else {
      if (isCreateNewUser) {
        const payload = {
          email: user.email,
          first_name: user.first_name,
          last_name: user.last_name,
          password: password,
        };
        const response = await createUser(payload);
        if (response.code === 400) {
          message.error(`Error creating user: ${Object.values(response)[1]}`);
        } else {
          dispatch(loginUser(payload));
          navigate("/token-validator");
        }
      } else {
        dispatch(updateExistingUser(user));
      }
    }
  };

  return (
    <Content
      pageTitle={isCreateNewUser ? "Create New User" : `Edit ${userName}`}
    >
      <ElementWithLabel
        formElement={
          <Input
            value={user?.email}
            onChange={(value) => handleFieldChange(value.target.value, "email")}
            style={{ width: 300 }}
          />
        }
        errorMsg={
          validations.email === false &&
          "You must provide a valid email address"
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
                value={password}
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
                value={passwordConfirm}
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
          <Button type="primary" onClick={handleCreateUpdateUser}>
            {isCreateNewUser ? "Create" : "Save User"}
          </Button>
          <Button onClick={() => navigate("/home")}>Go Home</Button>
        </Space>
      </Affix>
    </Content>
  );
};

export default UserSettingsPage;
