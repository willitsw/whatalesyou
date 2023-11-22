import { useState, useEffect } from "react";
import { useNavigate, useLocation, Link } from "react-router-dom";
import {
  Menu,
  Image,
  Avatar,
  Dropdown,
  Button,
  Typography,
  MenuProps,
  Affix,
} from "antd";
import beerIcon from "./beer-icon.png";
import { useAppSelector, useAppDispatch } from "../../redux/store";
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
} from "../../redux/global-modals";
import React from "react";
import { useAnalytics } from "../../utils/analytics";
import { useCurrentUser } from "../user-context/user-context";

const Header = () => {
  const [currentPage, setCurrentPage] = useState("");
  const location = useLocation();
  const pageIsClean = useAppSelector(selectPageIsClean);
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const [isPhone] = useState<boolean>(
    window.matchMedia("(max-width: 500px)").matches
  );
  const { fireAnalyticsEvent } = useAnalytics();
  const { logoutUser, isAuthenticated, user: currentUser } = useCurrentUser();

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
    logoutUser();
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
              onClick={() => {
                dispatch(setShowLoginModal(true));
                navigate("/home");
              }}
            >
              Login
            </Button>
          ),
        },
        {
          key: "create-new-account",
          icon: <UserOutlined />,
          label: (
            <Button
              type="link"
              onClick={() => {
                navigate("/user/new");
              }}
            >
              Create New User
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
              style={{ color: "#1677ff" }}
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
          key: "user",
          icon: <UserOutlined />,
          label: (
            <Button
              type="link"
              onClick={() => {
                navigate(`/user/${currentUser.id}`);
              }}
            >
              User Settings
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

  const menuStyle: any = {
    justifyContent: "flex-end",
    flexGrow: 1,
    width: 600,
    alignItems: "stretch",
    marginRight: 10,
  };
  if (isPhone) {
    menuStyle.width = 50;
    menuStyle.flexGrow = 0;
  }

  return (
    <Affix offsetTop={0}>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          backgroundColor: "#001529",
          paddingLeft: "20px",
          paddingRight: "20px",
          alignItems: "center",
          height: "70px",
        }}
      >
        <Link style={{ textDecoration: "none" }} to="/home">
          <div
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              paddingTop: "10px",
              paddingBottom: "10px",
            }}
          >
            <Image
              style={{ paddingBottom: "5px", marginRight: 10 }}
              width={40}
              src={beerIcon}
              preview={false}
            />
            <Typography.Title
              style={{
                color: "rgba(255, 255, 255, 0.85)",
                marginLeft: 10,
                marginBottom: 0,
              }}
              level={isPhone ? 5 : 3}
            >
              What Ales You
            </Typography.Title>
          </div>
        </Link>
        <div
          style={{
            display: "flex",
            flexDirection: "row",
            height: "70px",
          }}
        >
          <Menu
            theme="dark"
            mode="horizontal"
            onClick={handleMenuClick}
            selectedKeys={[currentPage]}
            style={menuStyle}
            items={[
              {
                key: "/home",
                label: "Home",
                disabled: !isAuthenticated,
                style: { paddingTop: isPhone ? 0 : 12 },
              },
              {
                key: "/recipes/list",
                label: "Recipes",
                disabled: !isAuthenticated,
                style: { paddingTop: isPhone ? 0 : 12 },
              },
              {
                key: "/brew-log/list",
                label: "Brew Log",
                disabled: !isAuthenticated,
                style: { paddingTop: isPhone ? 0 : 12 },
              },
              {
                key: "/brew-settings",
                label: "Brew Settings",
                disabled: !isAuthenticated,
                style: { paddingTop: isPhone ? 0 : 12 },
              },
            ]}
          />
          <Dropdown menu={{ items: userMenuItems }} trigger={["click"]}>
            <div
              style={{
                paddingTop: "15px",
                paddingBottom: "10px",
                cursor: "pointer",
              }}
            >
              <Avatar size="large" icon={<UserOutlined />} />
            </div>
          </Dropdown>
        </div>
      </div>
    </Affix>
  );
};

export default Header;
