import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import {
  Layout,
  Menu,
  Image,
  Avatar,
  Dropdown,
  Button,
  Typography,
  MenuProps,
} from "antd";
import beerIcon from "./beer-icon.png";
import { useAppSelector, useAppDispatch } from "../../redux/hooks";
import { selectCurrentUser, userIsAuthenticated } from "../../redux/user/slice";
import {
  LoginOutlined,
  LogoutOutlined,
  UserOutlined,
  MoneyCollectOutlined,
} from "@ant-design/icons";
import {
  selectPageIsClean,
  setPageIsClean,
  setShowLoginModal,
} from "../../redux/global-modals/slice";
import React from "react";
import { useAnalytics } from "../../utils/analytics";

const Header = () => {
  const { Header } = Layout;
  const [currentPage, setCurrentPage] = useState("");
  const location = useLocation();
  const isAuthenticated = useAppSelector(userIsAuthenticated);
  const currentUser = useAppSelector(selectCurrentUser);
  const pageIsClean = useAppSelector(selectPageIsClean);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isPhone] = useState<boolean>(
    window.matchMedia("(max-width: 500px)").matches
  );
  const { fireAnalyticsEvent } = useAnalytics();

  useEffect(() => {
    if (!isAuthenticated) {
      setCurrentPage("/home");
    } else if (location.pathname.includes("recipes")) {
      setCurrentPage("/recipes/list");
    } else if (location.pathname.includes("brew-settings")) {
      setCurrentPage("/brew-settings");
    } else if (location.pathname.includes("brew-log")) {
      setCurrentPage("/brew-log/list");
    } else {
      setCurrentPage("/home");
    }

    if (!pageIsClean) {
      dispatch(setPageIsClean(true));
    }
  }, [location, isAuthenticated]);

  const handleMenuClick = (newMenuItem: any) => {
    navigate(newMenuItem.key);
  };

  const handleSignOut = () => {
    navigate("/home");
  };

  const getUserMenuItems = (): MenuProps["items"] => {
    if (!isAuthenticated) {
      return [
        {
          key: "login",
          icon: <LoginOutlined />,
          label: (
            <Button
              type="link"
              onClick={() => dispatch(setShowLoginModal(true))}
            >
              Login
            </Button>
          ),
        },
        {
          key: "donate",
          icon: <MoneyCollectOutlined />,
          label: (
            <Button
              type="link"
              href="https://www.paypal.com/donate/?hosted_button_id=UJZ4HJW2BWWLG"
              target="_blank"
              onClick={() =>
                fireAnalyticsEvent("Donate button clicked", {
                  source: "header",
                })
              }
            >
              Donate
            </Button>
          ),
        },
      ];
    } else {
      return [
        {
          key: "logout",
          icon: <LogoutOutlined />,
          label: (
            <Button type="link" onClick={handleSignOut}>
              Logout
            </Button>
          ),
        },
        {
          key: "donate",
          icon: <MoneyCollectOutlined />,
          label: (
            <Button
              type="link"
              href="https://www.paypal.com/donate/?hosted_button_id=UJZ4HJW2BWWLG"
              target="_blank"
              onClick={() =>
                fireAnalyticsEvent("Donate button clicked", {
                  source: "header",
                })
              }
            >
              Donate
            </Button>
          ),
        },
      ];
    }
  };

  const userMenuItems = getUserMenuItems();

  const menuStyle: any = { justifyContent: "flex-end", flexGrow: 1 };
  if (isPhone) {
    menuStyle.width = 100;
  }

  return (
    <Header>
      <div
        className="beer-max-width"
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          margin: "auto",
        }}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            marginRight: "20px",
          }}
        >
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "flex-end",
            }}
          >
            <Image
              style={{ paddingBottom: "5px", marginRight: 10 }}
              width={40}
              src={beerIcon}
              preview={false}
            />
            <Typography.Title
              style={{ color: "rgba(255, 255, 255, 0.85)", marginLeft: 10 }}
              level={isPhone ? 5 : 3}
            >
              What Ales You
            </Typography.Title>
          </div>
          <Menu
            theme="dark"
            mode="horizontal"
            onClick={handleMenuClick}
            selectedKeys={[currentPage]}
            style={menuStyle}
            items={[
              { key: "/home", label: "Home", disabled: !isAuthenticated },
              {
                key: "/recipes/list",
                label: "Recipes",
                disabled: !isAuthenticated,
              },
              {
                key: "/brew-log/list",
                label: "Brew Log",
                disabled: !isAuthenticated,
              },
              {
                key: "/brew-settings",
                label: "Brew Settings",
                disabled: !isAuthenticated,
              },
            ]}
          />
        </div>
        <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
          <div style={{ paddingTop: 0, cursor: "pointer" }}>
            <Avatar size="large" icon={<UserOutlined />} />
          </div>
        </Dropdown>
      </div>
    </Header>
  );
};

export default Header;
