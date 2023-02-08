import { BrowserRouter } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./redux/store";
import PageLayout from "./components/page-layout";
import React from "react";
import { AnalyticsProvider } from "./utils/analytics";

export enum RouteSegments {
  Home = "/home",
  RecipesList = "/recipes/list",
  RecipesDetail = "/recipes/detail",
}

const App = () => {
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
