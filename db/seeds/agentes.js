/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('agentes').del()
  await knex('agentes').insert([
    {id: 1, nome: "Rommel Carneiro", dataDeIncorporacao: "1992-10-04", cargo: "Delegado"},
    {id: 2, nome: "Ana Paula", dataDeIncorporacao: "2005-05-15", cargo: "Investigadora"},
    {id: 3, nome: "Carlos Silva", dataDeIncorporacao: "2010-03-20", cargo: "Agente"}
  ]);
};
