import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import PageLayout from "./components/page-layout/page-layout";
import React from "react";
import { AnalyticsProvider } from "./utils/analytics";
import { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY } from "./constants";
import jwt from "jwt-decode";
import { TokenPayload } from "./types/user";
import dayjs from "dayjs";

export enum RouteSegments {
  Home = "/home",
  RecipesList = "/recipes/list",
  RecipesDetail = "/recipes/detail",
}

const App = () => {
  const refreshToken = localStorage.getItem(REFRESH_TOKEN_KEY);

  if (refreshToken) {
    const { exp } = jwt(refreshToken) as TokenPayload;
    const tokenExpirationInDays = dayjs.unix(exp).diff(dayjs(), "day");
    if (tokenExpirationInDays < 2) {
      console.log("Refresh token is about to expire - logout now");
      localStorage.removeItem(ACCESS_TOKEN_KEY);
      localStorage.removeItem(REFRESH_TOKEN_KEY);
    } else {
      console.log(
        `Refresh token will expire in ${tokenExpirationInDays} days.`
      );
    }
  } else {
    console.log("no token exists. Will be logged out.");
  }

  return (
    <Provider store={store}>
      <BrowserRouter>
        <AnalyticsProvider>
          <PageLayout />
        </AnalyticsProvider>
      </BrowserRouter>
    </Provider>
  );
};

export default App;
