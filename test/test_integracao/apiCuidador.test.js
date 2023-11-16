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


    



//     test('Deve fazer o cadastro de usuário', async () => {

//         const response = await app
//             .post(`/v1/sbook/registro-usuario`)
//             .send({
//                 "nome_usuario": "Millena",
//                 "cpf_usuario": "123-253-423-85",
//                 "data_nascimento_usuario": "2003/10/29",
//                 "email_usuario": "millenamills42@gmail.com",
//                 "senha_usuario": "temporaria2",
//                 "cep_endereco": "06420-340",
//                 "logradouro_endereco": "Rua Elton",
//                 "bairro_endereco": "Centro",
//                 "cidade_endereco": "Jandira",
//                 "estado_endereco": "SP"
//             })

//         expect(response.status).toBe(201)
//         expect(response.body).toBeInstanceOf(Object)
//     })

//     test('Deve atualizar os dados do usuário', async () => {

//         const response = await app
//             .put(`/v1/sbook/atualizar-usuario`)
//             .send({
//                 "id_usuario": 20,
//                 "id_endereco": 20,
//                 "nome_usuario": "Millena Mills",
//                 "cpf_usuario": "128-403-234-80",
//                 "data_nascimento_usuario": "2003/10/29",
//                 "email_usuario": "millenamills@gmail.com",
//                 "senha_usuario": "temporaria2",
//                 "cep_endereco": "06420-340",
//                 "logradouro_endereco": "Rua Elton",
//                 "bairro_endereco": "Centro",
//                 "cidade_endereco": "Jandira",
//                 "estado_endereco": "SP"
//             })

//         expect(response.status).toBe(200)
//         expect(response.body).toBeInstanceOf(Object)
//     })

//     test('Deve trocar a foto de perfil do usuário', async () => {

//         const response = await app
//             .put(`/v1/sbook/atualizar-foto-usuario`)
//             .send({"id": 20, "foto": "https://i.pinimg.com/originals/b1/85/54/b1855492768711416e253cc496bae52a.png"})

//         expect(response.status).toBe(200)
//         expect(response.body).toBeInstanceOf(Object)
//     })
// })