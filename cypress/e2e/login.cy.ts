import constants from "../../frontend/src/constants";

describe("Login / User Creation", () => {
  beforeEach(() => {
    cy.visit("/");
  });
  it("has a logged in and logged out state", () => {
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
  });
});
