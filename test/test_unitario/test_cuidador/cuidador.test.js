// /*****************************************************************************
//  * Objetivo: Arquivo feito para fazer os testes da controller de cuidador
//  * Data: 14/11/2023
//  * Autor: Gustavo Souza Tenorio de Barros
//  * Versão: 1.0
//  *****************************************************************************/


// const {
//     getCuidadores,
//     insertCuidador,
//     updateCuidador,
//     deleteCuidador,
//     getCuidadorByID,
// } = require('../../../controller/controller_cuidador.js')


// //Get ALL
// describe(`Teste para pegar Todos os Cuidadores registrado`, () => {

//     test('Deve pegar todos os Cuidadores salvos no sistema || SUCESSO - 200', async () => {
//         const res = await getCuidadores()

//         expect(res.status).toBe(200)
//     })
// })


// //Get pelo ID
// describe(`Teste para pegar o Cuidador pelo ID`, () => {

//     test('Deve pegar cuidador salvos no sistema || SUCESSO - 200', async () => {
//         const res = await getCuidadorByID(5)

//         expect(res.status).toBe(200)
//     })

//     test('Deve pegar cuidador salvo no sistema || ERRO - 404, REGISTRO NÃO ENCONTRADO', async () => {
//         const res = await getCuidadorByID(400)

//         expect(res.status).toBe(404)
//     })
// })

// //Insert
// describe(`Teste Para inserir o Cuidador`, () => {

//     //
//     test('Deve inserir cuidador || ERRO - 400, FALTA DE VALORES PRA PREENCHER', async () => {

//         const cuidador = {
//             "nome": "Carlos", 
//             "email": "", 
//             "senha": "",
//         }


//         const res = await insertCuidador(cuidador)

//         expect(res.status).toBe(400)

//     })

//     test('Deve inserir cuidador ||SUCESSO - 409, CUIDADOR JÁ EXISTENTE', async () => {

//         const cuidador = {
//             "nome": "Carlos", 
//             "email": "Carlos@gmail.com", 
//             "senha": "Carlos@123",
//         }


//         const res = await insertCuidador(cuidador)

//         expect(res.status).toBe(409)

//     })


//     // test('Deve inserir cuidador ||SUCESSO - 201', async () => {

//     //     const cuidador = {
//     //         "nome": "b",
//     //         "email": "b@gmail.com", 
//     //         "senha": "b@123",
//     //     }


//     //     const res = await insertCuidador(cuidador)

//     //     expect(res.status).toBe(201)

//     // })

// })


// //Atualizar dados 
// describe(`Teste Para Atualizar dados do Cuidador`, () => {

//     test('Deve Atualizar dados do cuidador ||SUCESSO - 200', async () => {

//         const cuidador = {
//             "id":46,
//             "nome": "Carlos A",
//             "data_nascimento":"1999-08-01",
//             "descricacao_experiencia":""


//         }
//         const res = await updateCuidador(cuidador)

//         expect(res.status).toBe(200)

//     })


    

// })



// //Deletar Cuidador
// //Arrumar delete para status code 200
// describe(`Teste Para deletar Cuidador`, () => {

//     test('Deve deletar os dados de um cuidador ||SUCESSO - 200', async () => {

//         const cuidador = {
//             "id":46
//         }
//         const res = await deleteCuidador(cuidador)

//         expect(res.status).toBe(400)

//     })
// })

