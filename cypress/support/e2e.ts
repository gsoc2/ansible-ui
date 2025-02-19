/// <reference types="cypress" />
// import 'cypress-axe';
import '@cypress/code-coverage/support';
import './commands';

before(function () {
  const devBaseUrlPort = Cypress.config().baseUrl?.split(':').slice(-1).toString();
  if (devBaseUrlPort === '4101') {
    cy.createGlobalOrganization();
    cy.createGlobalProject();
  }
});

// AWX E2E Port: 4101
// AWX Component Port: 4201
// HUB E2E Port: 4102
// HUB Component Port: 4202
// EDA E2E Port: 4103
// EDA Component Port: 4203

Cypress.on('uncaught:exception', (_err, _runnable) => {
  // returning false here prevents Cypress from
  // failing the test
  // fixes problems with monaco loading workers
  return false;
});
