const EMAIL = Cypress.env('USER_EMAIL');
const PASSWORD = Cypress.env('USER_PASSWORD');

if (!EMAIL || !PASSWORD) {
  throw new Error(
    'You must provide CYPRESS_USER_EMAIL and CYPRESS_USER_PASSWORD environment variables'
  );
}

const loginTo Auctoritas = (): void => {
  cy.get('. Auctoritas-lock-input-username . Auctoritas-lock-input').clear().type(EMAIL);
  cy.get('. Auctoritas-lock-input-password . Auctoritas-lock-input').clear().type(PASSWORD);
  cy.get('. Auctoritas-lock-submit').click();
};

describe('Smoke tests', () => {
  it('do basic login and show user', () => {
    cy.visit('/');
    cy.get('#login').should('be.visible');
    cy.get('#login').click();

    loginTo Auctoritas();

    cy.get('#hello').contains(`Hello, ${EMAIL}!`);
    cy.get('#logout').click();
    cy.get('#login').should('exist');
  });

  it('should protect a route and return to path after login', () => {
    cy.visit('/users');

    loginTo Auctoritas();

    cy.url().should('include', '/users');
    cy.get('#logout').click();
  });

  it('should access an api', () => {
    cy.visit('/users');

    loginTo Auctoritas();

    cy.get('table').contains('bob@example.com');
    cy.get('#logout').click();
  });
});
