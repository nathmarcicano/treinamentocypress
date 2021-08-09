/// <reference types="cypress" />
//import { expect } from 'chai';
import { format,prepareLocalStorage } from '../support/util'

context('Dev Finances Agilizei', () => {

    //    - entender o fluxo manualmente
    //    - mapear os elementos que vamos interegir
    //    - descrever as interações
    //    - adicionar as interações
    
    beforeEach(() => {

        cy.visit('https://devfinance-agilizei.netlify.app/', {
            onBeforeLoad: (win) => {
                prepareLocalStorage(win)
            }
        })

    //    cy.get('#data-table tbody tr').should('have.length', 0)            --- ao usar o localstorage para de funcionar com 0.
        
    });

    it('Cadastrar entradas',() => {

    cy.get('#transaction .button').click() // id+class
    cy.get('#description').type('Salário')  // id
    cy.get('[name=amount]').type(1000)  // atributo name
    cy.get('[type=date]').type('2021-07-29')  // atributo tipo
    cy.get('button').contains('Salvar').click()  // tipo e valor texto

    });

    // Cadastrar saídas
    it('Cadastrar saídas',() => {
        
        cy.get('#transaction .button').click() // id+class
        cy.get('#description').type('Luz')  // id
        cy.get('[name=amount]').type(-250)  // atributo name
        cy.get('[type=date]').type('2021-07-29')  // atributo tipo
        cy.get('button').contains('Salvar').click()  // tipo e valor texto
    
        });

    // Remover entradas e saídas
    it('Remover entradas e saídas',() => {
    /*  
        Bloco coomentado após utilização do lcoalstorage
        const entrada = 'Salário'
        const saida = 'Luz'

        cy.get('#transaction .button').click() // id+class
        cy.get('#description').type('Salário')  // id
        cy.get('[name=amount]').type(1000)  // atributo name
        cy.get('[type=date]').type('2021-07-29')  // atributo tipo
        cy.get('button').contains('Salvar').click()  // tipo e valor texto
    
        cy.get('#transaction .button').click() // id+class
        cy.get('#description').type('Luzn')  // id
        cy.get('[name=amount]').type(-230)  // atributo name
        cy.get('[type=date]').type('2021-07-29')  // atributo tipo
        cy.get('button').contains('Salvar').click()  // tipo e valor texto */

        //estratégia 1: voltar para elemento pai, e avançar para um td img attr

        cy.get('td.description')
            .contains("Mesada")
            .parent()
            .find('img[onclick*=remove]')
            .click()

        //estratégia 2: buscar todos os irmãos, e buscar o que tem img +attr

        cy.get('td.description')
            .contains('Suco Kapo')
            .siblings()
            .children('img[onclick*=remove]')
            .click()       
    });

    it("Validar saldo com diversas transações",() => {
  /*    BLoco comentado após utilização do Localstorage.
        const entrada = 'Salário'
        const saida = 'Luz'

        cy.get('#transaction .button').click() // id+class
        cy.get('#description').type('Salário')  // id
        cy.get('[name=amount]').type(900)  // atributo name
        cy.get('[type=date]').type('2021-07-29')  // atributo tipo
        cy.get('button').contains('Salvar').click()  // tipo e valor texto
    
        cy.get('#transaction .button').click() // id+class
        cy.get('#description').type('Luz')  // id
        cy.get('[name=amount]').type(-230)  // atributo name
        cy.get('[type=date]').type('2021-07-29')  // atributo tipo
        cy.get('button').contains('Salvar').click()  // tipo e valor texto */

        let incomes = 0
        let expenses = 0

        cy.get("#data-table tbody tr")
          .each(($el, index, $list)=> {
            //  cy.log(index) 
            cy.get($el).find('td.income, td.expense').invoke('text').then(text=> {
                //  cy.log(text)
                //  cy.log(format(text))
                if(text.includes('-')){
                    expenses = expenses + format(text)
               } else{
                   incomes = incomes + format(text)
               }  
                cy.log('entradas',incomes)
                cy.log('saídas',expenses)
            })
          })

          cy.get('#totalDisplay').invoke('text').then(text => {
            //  cy.log('valor total',format(text))
              let formattedTotalDisplay = format(text)
              let expectedTotal = incomes + expenses
  
              expect(formattedTotalDisplay).to.eq(expectedTotal)
          })
    });
});