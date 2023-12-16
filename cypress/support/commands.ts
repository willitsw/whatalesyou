/// <reference types="cypress" />
// ***********************************************
// This example commands.ts shows you how to
// create various custom commands and overwrite
// existing commands.
//
// For more comprehensive examples of custom
// commands please read more here:
// https://on.cypress.io/custom-commands
// ***********************************************
//
//
// -- This is a parent command --
// Cypress.Commands.add('login', (email, password) => { ... })
//
//
// -- This is a child command --
// Cypress.Commands.add('drag', { prevSubject: 'element'}, (subject, options) => { ... })
//
//
// -- This is a dual command --
// Cypress.Commands.add('dismiss', { prevSubject: 'optional'}, (subject, options) => { ... })
//
//
// -- This will overwrite an existing command --
// Cypress.Commands.overwrite('visit', (originalFn, url, options) => { ... })
//

import "@testing-library/cypress/add-commands";
import { ACCESS_TOKEN_KEY } from "../../frontend/src/constants";

Cypress.Commands.add("login", () => {
  cy.request("POST", "http://localhost:8000/api/setup-test-user/").then(
    (response) => {
      window.localStorage.setItem(ACCESS_TOKEN_KEY, response.body.token);
    }
  );
  cy.reload();
});

Cypress.Commands.add("logout", () => {
  cy.request("POST", "http://localhost:8000/api/delete-test-user/");
  window.localStorage.removeItem(ACCESS_TOKEN_KEY);
  cy.reload();
});

Cypress.Commands.overwrite("visit", (originalFn, url, options) => {
  cy.intercept("https://youtube.com/*", (req) => req.destroy()).then(() =>
    originalFn(url, options)
  );
});
