/*****************************************************************************
 * Objetivo: Arquivo feito para fazer os testes dos endpoints da api de usuáruio
 * Data: 16/11/2023
 * Autor: Gustavo Souza Tenorio de Barros
 * Versão: 1.0
 *****************************************************************************/

const request = require("supertest");
const app = request("http://localhost:8080");

describe(`Teste de integração com controller de usuário`, () => {
    const ID = 20

    test('Deve pegar todos os usuários salvos no sistema', async () => {

        const response = await app
            .get('/v1/ayan/cuidadores')

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)


    })


    test('Deve pegar os dados de um usuário pelo ID', async () => {

        const response = await app
            .get(`/v1/ayan/cuidador/${ID}`)

        expect(response.status).toBe(200)
        expect(response.body).toBeInstanceOf(Object)
    })




    test('Deve fazer o login do usuário', async () => {

        const response = await app
            .post(`/v1/ayan/cuidador`)
            .send({
                "nome":"Bento",
                "email": "Bento@gmail.com",
                "senha": "Bento@123"
            })

        expect(response.status).toBe(409)
        expect(response.body).toBeInstanceOf(Object)
    })


})