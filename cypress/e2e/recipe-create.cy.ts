describe("Recipe Creation", () => {
  before(() => {
    cy.visit("/");
    cy.login();
  });

  it("can create a new recipe", () => {
    cy.findByRole("menuitem", { name: /Recipes/i }).click();
    cy.findByText("No data").should("exist");
    cy.findByRole("button", { name: "New Recipe" }).click();

    cy.findByRole("tab", { name: "Ingredients" }).click({ force: true });
    cy.findByRole("button", { name: "Add Strike Water Ingredient" }).click();
    cy.wait(100);

    // verify strike water step attributes
    cy.findByLabelText("Brewing Step").click({ force: true });
    cy.findByTestId("brewing-step Strike Water").click({ force: true });
    cy.findByLabelText("Ingredient Type").should("exist");
    cy.findByLabelText("Name").should("exist");
    cy.findByLabelText("Amount").should("exist");
    cy.findByLabelText("Amount Type").should("exist");
    cy.findByLabelText("Notes").should("exist");
    cy.findByLabelText("Timing").should("not.exist");

    // verify mash step attributes
    cy.findByLabelText("Brewing Step").click({ force: true });
    cy.findByTestId("brewing-step Mash").click({ force: true });
    cy.findByLabelText("Ingredient Type").should("exist");
    cy.findByLabelText("Name").should("exist");
    cy.findByLabelText("Amount").should("exist");
    cy.findByLabelText("Amount Type").should("exist");
    cy.findByLabelText("Notes").should("exist");
    cy.findByLabelText("Timing").should("not.exist");

    // verify boil step attributes
    cy.findByLabelText("Brewing Step").click({ force: true });
    cy.findByTestId("brewing-step Boil").click({ force: true });
    cy.findByLabelText("Ingredient Type").should("exist");
    cy.findByLabelText("Name").should("exist");
    cy.findByLabelText("Amount").should("exist");
    cy.findByLabelText("Amount Type").should("exist");
    cy.findByLabelText("Notes").should("exist");
    cy.findByLabelText("Timing").should("exist");

    // verify fermentor step attributes
    cy.findByLabelText("Brewing Step").click({ force: true });
    cy.findByTestId("brewing-step Fermentor").click({ force: true });
    cy.findByLabelText("Ingredient Type").should("exist");
    cy.findByLabelText("Name").should("exist");
    cy.findByLabelText("Amount").should("exist");
    cy.findByLabelText("Amount Type").should("exist");
    cy.findByLabelText("Notes").should("exist");
    cy.findByLabelText("Timing").should("exist");

    // verify boil step attributes
    cy.findByLabelText("Brewing Step").click({ force: true });
    cy.findByTestId("brewing-step Bottle").click({ force: true });
    cy.findByLabelText("Ingredient Type").should("exist");
    cy.findByLabelText("Name").should("exist");
    cy.findByLabelText("Amount").should("exist");
    cy.findByLabelText("Amount Type").should("exist");
    cy.findByLabelText("Notes").should("exist");
    cy.findByLabelText("Timing").should("not.exist");

    // verify chemistry type attributes
    cy.findByLabelText("Ingredient Type").click({ force: true });
    cy.findByTestId("ingredient-type Chemistry").click({ force: true });
    cy.findByLabelText("Name").should("exist");
    cy.findByLabelText("Amount").should("exist");
    cy.findByLabelText("Amount Type").should("exist");
    cy.findByLabelText("Notes").should("exist");

    // verify hop type attributes
    cy.findByLabelText("Ingredient Type").click({ force: true });
    cy.findByTestId("ingredient-type Hop").click({ force: true });
    cy.findByLabelText("Name").should("exist");
    cy.findByLabelText("Amount").should("exist");
    cy.findByLabelText("Amount Type").should("exist");
    cy.findByLabelText("Bitterness").should("exist");
    cy.findByLabelText("Notes").should("exist");

    // verify culture type attributes
    cy.findByLabelText("Ingredient Type").click({ force: true });
    cy.findByTestId("ingredient-type Culture").click({ force: true });
    cy.findByLabelText("Name").should("exist");
    cy.findByLabelText("Amount").should("exist");
    cy.findByLabelText("Amount Type").should("exist");
    cy.findByLabelText("Attenuation").should("exist");
    cy.findByLabelText("Yeast Form").should("exist");
    cy.findByLabelText("Notes").should("exist");

    // verify fermentable type attributes
    cy.findByLabelText("Ingredient Type").click({ force: true });
    cy.findByTestId("ingredient-type Fermentable").click({ force: true });
    cy.findByLabelText("Name").should("exist");
    cy.findByLabelText("Amount").should("exist");
    cy.findByLabelText("Amount Type").should("exist");
    cy.findByLabelText("Type").should("exist");
    cy.findByLabelText("Color").should("exist");
    cy.findByLabelText("Gravity").should("exist");
    cy.findByLabelText("Notes").should("exist");

    // verify non-fermentable type attributes
    cy.findByLabelText("Ingredient Type").click({ force: true });
    cy.findByTestId("ingredient-type Non Fermentable").click({ force: true });
    cy.findByLabelText("Name").should("exist");
    cy.findByLabelText("Amount").should("exist");
    cy.findByLabelText("Amount Type").should("exist");
    cy.findByLabelText("Notes").should("exist");

    cy.findByRole("button", { name: "Cancel" }).click();

    // add a strike water ingredient
    cy.findByRole("button", { name: "Add Strike Water Ingredient" }).click();
    cy.wait(100);
    cy.findByLabelText("Name").type("Gypsum");
    cy.findByLabelText("Amount").type("6");
    cy.findByLabelText("Notes").type("add while heating up the strike water");
    cy.findByRole("button", { name: "OK" }).click();

    // add a mash ingredient
    cy.findByRole("button", { name: "Add Mash Ingredient" }).click();
    cy.wait(100);
    cy.findByLabelText("Name").type("Pal");
    cy.findByText("Pale Ale Malt").click({ force: true });
    cy.findByLabelText("Type").click({ force: true });
    cy.findByLabelText("Amount").type("9.5");
    cy.findByLabelText("Notes").type("The main malt");
    cy.findByRole("button", { name: "OK" }).click();

    // add a boil ingredient
    cy.findByRole("button", { name: "Add Boil Ingredient" }).click();
    cy.wait(100);
    cy.findByLabelText("Name").type("Ap");
    cy.findAllByText("Apollo").last().click({ force: true });
    cy.findByLabelText("Timing").clear().type("45");
    cy.findByLabelText("Amount").type("1.5");
    cy.findByLabelText("Notes").type("The main hop");
    cy.findByRole("button", { name: "OK" }).click();

    // add a fermentor ingredient
    cy.findByRole("button", { name: "Add Fermentor Ingredient" }).click();
    cy.wait(100);
    cy.findByLabelText("Name").type("US05");
    cy.findByLabelText("Timing")
      .clear({ force: true })
      .type("2", { force: true });
    cy.findByLabelText("Attenuation")
      .clear({ force: true })
      .type("71", { force: true });
    cy.findByLabelText("Amount").type("1.5");
    cy.findByLabelText("Notes").type("The main yeast");
    cy.findByRole("button", { name: "OK" }).click();

    // add a packaging ingredient
    cy.findByRole("button", { name: "Add Packaging Ingredient" }).click();
    cy.wait(100);
    cy.findByLabelText("Name").type("Orange Slices");
    cy.findByLabelText("Amount").type("25");
    cy.findByLabelText("Notes").type("The main slices");
    cy.findByRole("button", { name: "OK" }).click();

    // verify the ingredients are displayed
    // strike water
    cy.findByText("Gypsum").should("exist");
    cy.findByText("6 g").should("exist");
    cy.findByText("add while heating up the strike water").should("exist");

    // mash
    cy.findByText("Pale Ale Malt").should("exist");
    cy.findByText("9.5 lb").should("exist");
    cy.findByText("3").should("exist");
    cy.findByText("Grain").should("exist");
    cy.findByText("1.036").should("exist");
    cy.findByText("The main malt").should("exist");

    // boil
    cy.findByText("Apollo").should("exist");
    cy.findByText("45 min").should("exist");
    cy.findByText("1.5 oz").should("exist");
    cy.findByText("19.5").should("exist");
    cy.findByText("The main hop").should("exist");

    // boil
    cy.findByText("US05").should("exist");
    cy.findByText("2 days").should("exist");
    cy.findByText("1.5 each").should("exist");
    cy.findByText("71%").should("exist");
    cy.findByText("The main yeast").should("exist");
    cy.findByText("Dry").should("exist");

    // packaging
    cy.findByText("Orange Slices").should("exist");
    cy.findByText("25 each").should("exist");
    cy.findByText("The main slices").should("exist");

    cy.findByRole("tab", { name: "General Info" }).click({ force: true });
    // fill in the recipe
    cy.findByRole("textbox", { name: "Recipe Name" }).clear().type("Pale Ale");
    cy.findByRole("textbox", { name: "Author" }).clear().type("Johnny B");
    cy.findByRole("textbox", { name: "Recipe Description" })
      .clear()
      .type("A description!");
    cy.findByRole("spinbutton", { name: "Batch Size" }).clear().type("4.5");
    cy.findByRole("spinbutton", { name: "Efficiency" }).clear().type("71");
    cy.findByRole("radio", { name: "Extract" }).check({ force: true });

    // save and go back to recipe list
    cy.findByRole("button", { name: "Save" }).click();
    cy.findByRole("button", { name: "Back to Recipe List" }).click();

    // go back to recipe and verify the details
    cy.findByRole("link", { name: "Pale Ale" }).click();
    cy.findByRole("textbox", { name: "Recipe Name" }).should(
      "have.value",
      "Pale Ale"
    );
    cy.findByRole("textbox", { name: "Author" }).should(
      "have.value",
      "Johnny B"
    );
    cy.findByRole("textbox", { name: "Recipe Description" }).should(
      "have.value",
      "A description!"
    );
    cy.findByRole("spinbutton", { name: "Batch Size" }).should(
      "have.value",
      "4.5"
    );
    cy.findByRole("spinbutton", { name: "Efficiency" }).should(
      "have.value",
      "71"
    );
    cy.findByRole("radio", { name: "Extract" }).should("be.checked");
    cy.findByRole("radio", { name: "Imperial" }).should("be.checked");

    // delete the recipe
    // cy.findByRole('button', {name:'Delete Recipe'})
  });
});
