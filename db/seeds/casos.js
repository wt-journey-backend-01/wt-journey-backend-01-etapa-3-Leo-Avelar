/**
 * @param { import("knex").Knex } knex
 * @returns { Promise<void> } 
 */
exports.seed = async function(knex) {
  await knex('casos').del()
  await knex('casos').insert([
    {id: 1, titulo: "Homicidio", descricao: "Disparos foram reportados às 22:33 do dia 10/07/2007 na região do bairro União, resultando na morte da vítima, um homem de 45 anos.", status: "aberto", agente_id: 1},
    {id: 2, titulo: "Furto", descricao: "Relato de furto em residência na Rua das Flores, ocorrido no dia 15/08/2020.", status: "solucionado", agente_id: 2},
    {id: 3, titulo: "Roubo", descricao: "Roubo de veículo na Avenida Central, ocorrido no dia 20/09/2021.", status: "aberto", agente_id: 3}
  ]);
};