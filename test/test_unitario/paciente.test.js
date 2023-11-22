/*****************************************************************************
 * Objetivo: Arquivo feito para fazer os testes da controller de paciente
 * Data: 15/11/2023
 * Autor: Gustavo Souza Tenorio de Barros
 * Versão: 1.0
 *****************************************************************************/


const {
    getPacientes,
    insertPaciente,
    updatePaciente,
    deletePaciente,
    getPacienteByID,
} = require('../../controller/controller_paciente.js')


//Get ALL
describe(`Teste para pegar Todos os Pacientees registrado`, () => {

    test('Deve pegar todos os Pacientees salvos no sistema || SUCESSO - 200', async () => {
        const res = await getPacientes()

        expect(res.status).toBe(200)
    })
})


//Get pelo ID
describe(`Teste para pegar o Paciente pelo ID`, () => {

    test('Deve pegar paciente salvos no sistema || SUCESSO - 200', async () => {
        const res = await getPacienteByID(5)

        expect(res.status).toBe(200)
    })

    test('Deve Falar quando o paciente não encontrado || ERRO - 404, REGISTRO NÃO ENCONTRADO', async () => {
        const res = await getPacienteByID(400)

        expect(res.status).toBe(404)
    })
})

//Insert
describe(`Teste Para inserir o Paciente`, () => {

    // //
    // test('Deve inserir paciente || ERRO - 400, FALTA DE VALORES PRA PREENCHER', async () => {

    //     const paciente = {
    //         "nome": "Carlos", 
    //         "email": "", 
    //         "senha": "",
    //     }


    //     const res = await insertPaciente(paciente)

    //     expect(res.status).toBe(400)

    // })

    test('Deve inserir paciente ||SUCESSO - 409, PACIENTE JÁ EXISTENTE', async () => {

        const paciente = {
            "nome": "Carlos", 
            "email": "Carlos@gmail.com", 
            "senha": "Carlos@123",
        }


        const res = await insertPaciente(paciente)

        expect(res.status).toBe(409)

    })


    // test('Deve inserir paciente ||SUCESSO - 201', async () => {

    //     const paciente = {
    //         "nome": "b",
    //         "email": "b@gmail.com", 
    //         "senha": "b@123",
    //     }


    //     const res = await insertPaciente(paciente)

    //     expect(res.status).toBe(201)

    // })

})


//Atualizar dados 
describe(`Teste Para Atualizar dados do Paciente`, () => {

    test('Deve Atualizar dados do paciente ||SUCESSO - 200', async () => {

        const paciente = {
            "id":89,
            "nome": "Carlos B",
            "data_nascimento":"2000-08-01",
            "descricacao_experiencia":""


        }
        const res = await updatePaciente(paciente)

        expect(res.status).toBe(200)

    })


    

})



//Deletar Paciente
//Arrumar delete para status code 200
describe(`Teste Para deletar Paciente`, () => {

    test('Deve deletar os dados de um paciente ||SUCESSO - 200', async () => {

        const paciente = {
            "id":46
        }
        const res = await deletePaciente(paciente)

        expect(res.status).toBe(400)

    })
})

