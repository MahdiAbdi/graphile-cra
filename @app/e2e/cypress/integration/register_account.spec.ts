/// <reference types="Cypress" />

context("RegisterAccount", () => {
  it("can navigate to registration page", () => {
    // Setup
    cy.visit(Cypress.env("FRONTEND_URL"));

    // Action
    cy.getCy("header-login-button").click();
    cy.getCy("loginpage-button-register").click();

    // Assertions
    cy.location("pathname").should("equal", "/register");
    cy.getCy("registerpage-name-label").should("exist");
  });

  it("requires the form be filled", () => {
    // Setup
    cy.visit(Cypress.env("FRONTEND_URL") + "/register");

    // Action
    cy.getCy("registerpage-submit-button").click();

    // Assertions
    cy.getCy("registerpage-name-label").should("exist");
    cy.contains("Registration failed");
    cy.contains("input your name");
    cy.contains("input your password");
  });

  context("Account creation", () => {
    beforeEach(() => cy.serverCommand("clearTestUsers"));

    it("enables account creation", () => {
      // Setup
      cy.visit(Cypress.env("FRONTEND_URL") + "/register");

      // Action
      cy.getCy("registerpage-input-name").type("Test User");
      cy.getCy("registerpage-input-username").type("testuser");
      cy.getCy("registerpage-input-email").type("test.user@example.com");
      cy.getCy("registerpage-input-password").type("Really Good Password");
      cy.getCy("registerpage-input-password2").type("Really Good Password");
      cy.getCy("registerpage-submit-button").click();

      // Assertions
      cy.location("pathname").should("equal", "/"); // Should be on homepage
      cy.getCy("header-login-button").should("not.exist"); // Should be logged in
    });

    it("prevents creation if username is in use", () => {
      // Setup
      cy.serverCommand("createUser", { username: "testuser" });
      cy.visit(Cypress.env("FRONTEND_URL") + "/register");

      // Action
      cy.getCy("registerpage-input-name").type("Test User");
      cy.getCy("registerpage-input-username").type("testuser");
      cy.getCy("registerpage-input-email").type("test.user@example.com");
      cy.getCy("registerpage-input-password").type("Really Good Password");
      cy.getCy("registerpage-input-password2").type("Really Good Password");
      cy.getCy("registerpage-submit-button").click();

      // Assertions
      cy.contains("account with this username").should("exist");
      cy.getCy("header-login-button").should("exist"); // Should be logged in
    });
  });
});
