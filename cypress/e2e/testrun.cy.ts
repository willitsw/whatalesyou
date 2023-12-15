import constants from "../../frontend/src/constants";

describe("template spec", () => {
  it("passes", () => {
    cy.visit(Cypress.env("baseUrl"));
  });
});
