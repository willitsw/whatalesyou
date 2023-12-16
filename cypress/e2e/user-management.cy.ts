import constants, {
  AUTOMATION_USER_PREFIX,
} from "../../frontend/src/constants";

describe("Login / User Creation", () => {
  before(() => {
    cy.logout();
  });
  beforeEach(() => {
    cy.visit("/");
  });
  it("can login and logout", () => {
    // Check the login and logout test helper api
    cy.findByRole("menuitem", { name: /Recipes/i }).should(
      "have.class",
      "ant-menu-item-disabled"
    );
    cy.login();
    cy.findByRole("menuitem", { name: /Recipes/i }).should(
      "not.have.class",
      "ant-menu-item-disabled"
    );
    cy.logout();
    cy.findByRole("menuitem", { name: /Recipes/i }).should(
      "have.class",
      "ant-menu-item-disabled"
    );

    // Create a new user
    cy.findByTestId("user-menu").click();
    cy.findByRole("menuitem", { name: /Create New User/i }).click();
    cy.findByRole("textbox", { name: "Email" }).type(
      `${AUTOMATION_USER_PREFIX}create@whatalesyou.net`
    );
    cy.findByRole("textbox", { name: "First Name" }).type(`Johnny`);
    cy.findByRole("textbox", { name: "Last Name" }).type(`Johnny`);
    cy.findByTestId("password").type(`password`);
    cy.findByTestId("confirm-password").type(`password`);
    cy.findByRole("button", { name: "Create" }).click();

    // Enter the verification code
    cy.findByRole("textbox", { name: "Verification Code" }).type(`ABCDE`);
    cy.findByRole("button", { name: "Submit" }).click();
    cy.findByRole("menuitem", { name: /Recipes/i }).should(
      "not.have.class",
      "ant-menu-item-disabled"
    );

    // log out
    cy.findByTestId("user-menu").click();
    cy.findByRole("menuitem", { name: /Logout/i }).click();
    cy.findByRole("menuitem", { name: /Recipes/i }).should(
      "have.class",
      "ant-menu-item-disabled"
    );

    // log in again
    cy.findByTestId("user-menu").click();
    cy.findByRole("menuitem", { name: /Login/i }).click();
    cy.findByRole("textbox", { name: "Email" }).type(
      `${AUTOMATION_USER_PREFIX}create@whatalesyou.net`
    );
    cy.findByTestId("password").type(`password`);
    cy.findByRole("button", { name: "OK" }).click();
    cy.findByRole("menuitem", { name: /Recipes/i }).should(
      "not.have.class",
      "ant-menu-item-disabled"
    );
  });
});
