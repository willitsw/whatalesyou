import constants from "../../frontend/src/constants";

describe("template spec", () => {
  it("passes", () => {
    cy.visit(constants.cypressBaseUrl);
  });
});
