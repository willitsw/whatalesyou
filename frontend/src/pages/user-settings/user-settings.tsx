import React, { useContext, useEffect, useState } from "react";
import { Form, useLocation, useNavigate, useParams } from "react-router-dom";
import { useAppDispatch, useAppSelector } from "../../redux/store";
// import {
//   createNewUser,
//   loginUser,
//   selectCurrentUser,
//   selectUserName,
//   updateExistingUser,
// } from "../../redux/user";
import { User } from "../../types/user";
import { v4 as uuid } from "uuid";
import Content from "../../components/content/content";
import ElementWithLabel from "../../components/form-layouts/element-with-label";
import { Affix, Button, Input, Space, message } from "antd";
import { isEmail } from "../../utils/validators";
import {
  UserContext,
  UserContextValue,
} from "../../components/user-context/user-context";
import { useCreateUser, useUpdateUser } from "../../utils/api-calls";
// import { createUser } from "../../utils/api-calls";

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
  const { user, loginUser }: UserContextValue = useContext(UserContext);
  const [updatedUser, setUpdatedUser] = useState<User>(null);
  const { id } = useParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState<string>(null);
  const [passwordConfirm, setPasswordConfirm] = useState<string>(null);
  const [passwordVisible, setPasswordVisible] = React.useState(false);
  const dispatch = useAppDispatch();
  const [validations, setValidations] = useState<any>({});
  const { mutateAsync: createUser } = useCreateUser({
    email: updatedUser?.email,
    first_name: updatedUser?.first_name,
    last_name: updatedUser?.last_name,
    password: password,
  });
  const { mutateAsync: updateUser } = useUpdateUser(updatedUser);

  if (user && !updatedUser) {
    setUpdatedUser(user);
  }

  const isCreateNewUser = id === "new";

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
    const newUser = { ...updatedUser };
    newUser[key] = value;
    setUpdatedUser(newUser);
  };

  const handleCreateUpdateUser = async () => {
    if (!validateForm) {
      message.error("Please fix the errors in this form and try again.");
      return;
    } else {
      if (isCreateNewUser) {
        const payload = {
          email: updatedUser.email,
          first_name: updatedUser.first_name,
          last_name: updatedUser.last_name,
          password: password,
        };
        const response = await createUser();
        if (response.code === 400) {
          message.error(`Error creating user: ${Object.values(response)[1]}`);
        } else {
          await loginUser(payload);
          navigate("/token-validator");
        }
      } else {
        await updateUser();
        message.success("User updated successfully!");
      }
    }
  };

  return (
    <Content
      pageTitle={
        isCreateNewUser
          ? "Create New User"
          : `Edit ${updatedUser?.email ?? "User"}`
      }
    >
      <ElementWithLabel
        formElement={
          <Input
            value={updatedUser?.email}
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
            value={updatedUser?.first_name}
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
            value={updatedUser?.last_name}
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
