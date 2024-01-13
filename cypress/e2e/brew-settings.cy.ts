describe("Brew Settings", () => {
  before(() => {
    cy.visit("/");
    cy.login();
  });

  it("can change brew settings", () => {
    // Verify brew settings are applying to new recipes
    cy.findByRole("menuitem", { name: "Recipes" }).click();
    cy.findByRole("button", { name: "New Recipe" }).click();
    cy.findByRole("textbox", { name: "Author" }).should(
      "have.value",
      "Joe Bob"
    );
    cy.findByRole("spinbutton", { name: "Batch Size" }).should(
      "have.value",
      "5.0"
    );
    cy.findByRole("spinbutton", { name: "Efficiency" }).should(
      "have.value",
      "65"
    );
    cy.findByRole("radio", { name: "All Grain" }).should("be.checked");
    cy.findByRole("radio", { name: "Imperial" }).should("be.checked");

    // Verify starting brew settings for new users
    cy.findByRole("menuitem", { name: "Brew Settings" }).click();
    cy.findByRole("spinbutton", { name: "Batch Size" }).should(
      "have.value",
      "5.0"
    );
    cy.findByRole("spinbutton", { name: "Boil Time" }).should(
      "have.value",
      "60"
    );
    cy.findByRole("spinbutton", { name: "Efficiency" }).should(
      "have.value",
      "65"
    );
    cy.findByRole("radio", { name: "Imperial" }).should("be.checked");
    cy.findByRole("spinbutton", { name: "Grain Water Loss" }).should(
      "have.value",
      "0.5"
    );
    cy.findByRole("spinbutton", { name: "Fermenter Dead Space" }).should(
      "have.value",
      "0.25"
    );
    cy.findByRole("spinbutton", { name: "Kettle Dead Space" }).should(
      "have.value",
      "0.25"
    );
    cy.findByRole("spinbutton", { name: "Evaporation Water Loss" }).should(
      "have.value",
      "1.5"
    );

    // Change the Brew Settings
    cy.findByRole("spinbutton", { name: "Batch Size" }).clear().type("4.5");
    cy.findByRole("spinbutton", { name: "Boil Time" }).clear().type("45");
    cy.findByRole("spinbutton", { name: "Efficiency" }).clear().type("75");
    cy.findByRole("radio", { name: "Metric" }).check({ force: true });
    cy.findByRole("spinbutton", { name: "Grain Water Loss" })
      .clear()
      .type(".4");
    cy.findByRole("spinbutton", { name: "Fermenter Dead Space" })
      .clear()
      .type(".3");
    cy.findByRole("spinbutton", { name: "Kettle Dead Space" })
      .clear()
      .type(".35");
    cy.findByRole("spinbutton", { name: "Evaporation Water Loss" })
      .clear()
      .type("2");
    cy.findByRole("button", { name: "Save" }).click();

    cy.findByRole("menuitem", { name: "Recipes" }).click();
    cy.findByRole("menuitem", { name: "Brew Settings" }).click();

    // Verify brew settings were saved
    cy.findByRole("spinbutton", { name: "Batch Size" }).should(
      "have.value",
      "4.5"
    );
    cy.findByRole("spinbutton", { name: "Boil Time" }).should(
      "have.value",
      "45"
    );
    cy.findByRole("spinbutton", { name: "Efficiency" }).should(
      "have.value",
      "75"
    );
    cy.findByRole("radio", { name: "Metric" }).should("be.checked");
    cy.findByRole("spinbutton", { name: "Grain Water Loss" }).should(
      "have.value",
      "0.4"
    );
    cy.findByRole("spinbutton", { name: "Fermenter Dead Space" }).should(
      "have.value",
      "0.3"
    );
    cy.findByRole("spinbutton", { name: "Kettle Dead Space" }).should(
      "have.value",
      "0.35"
    );
    cy.findByRole("spinbutton", { name: "Evaporation Water Loss" }).should(
      "have.value",
      "2.0"
    );

    // Verify saved brew settings are applying to new recipes
    cy.findByRole("menuitem", { name: "Recipes" }).click();
    cy.findByRole("button", { name: "New Recipe" }).click();
    cy.findByRole("spinbutton", { name: "Batch Size" }).should(
      "have.value",
      "4.5"
    );
    cy.findByRole("spinbutton", { name: "Efficiency" }).should(
      "have.value",
      "75"
    );
    cy.findByRole("radio", { name: "Metric" }).should("be.checked");
  });
});
