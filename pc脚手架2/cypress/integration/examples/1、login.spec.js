describe('Post Resource', () => {
  it('Creating a New Post', () => {
    cy.visit('#/login');

    cy.get('.inputAccount').type('1').should('have.value', 'zyz011');
    cy.wait(500);

    cy.get('.inputPassword').type('1').should('have.value', 'zyz1231');
    cy.wait(500);

    cy.get('#select').click();
    cy.wait(500);
    cy.get('.select-data').contains('中文').click();
    cy.wait(500);
    cy.get('.picturePlace').contains('结构性存款');
    cy.wait(500);

    cy.get('#select').click();
    cy.wait(500);
    cy.get('.select-data').contains('繁體').click();
    cy.wait(500);
    cy.get('.picturePlace').contains('結構性存款');

    cy.wait(500);
    cy.get('#select').click();
    cy.wait(500);
    cy.get('.select-data').contains('English').click();
    cy.wait(500);
    cy.get('.picturePlace').contains('Structured Products');
    
    
  });
});