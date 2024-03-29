import { Route, Routes } from "react-router-dom";
import HomePage from "../../pages/home/home";
import RecipeDetailPage from "../../pages/recipe-detail/recipe-detail";
import RecipeListPage from "../../pages/recipe-list/recipe-list";
import BrewSettingsPage from "../../pages/brew-settings/brew-settings";
import Footer from "../footer/footer";
import Header from "../header/header";
import React from "react";
import RecipePrinterFriendly from "../../pages/recipe-printer-friendly/recipe-printer-friendly";
import BrewLogListPage from "../../pages/brew-log-list/brew-log-list";
import BrewLogDetailPage from "../../pages/brew-log-detail/brew-log-detail";
import LoginModal from "../modals/login/login";
import UserSettingsPage from "../../pages/user-settings/user-settings";
import { TokenValidator } from "../../pages/token-validator/token-validator";
import { useCurrentUser } from "../user-context/user-context";
import { ForgotPassword } from "../../pages/forgot-password/forgot-password";
import { useAppSelector } from "../../redux/store";
import { selectShowLoginModal } from "../../redux/global-modals";

const PageLayout = () => {
  const { isAuthenticated, user } = useCurrentUser();
  const showLoginModal = useAppSelector(selectShowLoginModal);

  return (
    <>
      <Header />
      <Routes>
        {!!user && !user.is_verified ? (
          <Route path="*" element={<TokenValidator />} />
        ) : (
          <>
            <Route path={"/home"} element={<HomePage />} />
            <Route path={"/forgot-password"} element={<ForgotPassword />} />
            {isAuthenticated && (
              <>
                <Route path={"/recipes/list"} element={<RecipeListPage />} />
                <Route path={"/recipes/new"} element={<RecipeDetailPage />} />
                <Route
                  path={"/recipes/edit/:id"}
                  element={<RecipeDetailPage />}
                />
                <Route
                  path={"/recipes/duplicate/:id"}
                  element={<RecipeDetailPage />}
                />
                <Route
                  path={"/recipes/print/:id"}
                  element={<RecipePrinterFriendly />}
                />
                <Route path={"/brew-settings"} element={<BrewSettingsPage />} />
                <Route path={"/brew-log/list"} element={<BrewLogListPage />} />
                <Route path={"/brew-log/new"} element={<BrewLogDetailPage />} />
                <Route
                  path={"/brew-log/edit/:id"}
                  element={<BrewLogDetailPage />}
                />
                <Route path={"/token-validator"} element={<TokenValidator />} />
              </>
            )}
            <Route path={"/user/:id"} element={<UserSettingsPage />} />
            <Route path="*" element={<HomePage />} />
          </>
        )}
      </Routes>
      <Footer />
      {showLoginModal && <LoginModal />}
    </>
  );
};

export default PageLayout;
