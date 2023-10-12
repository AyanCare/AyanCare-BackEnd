/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Questionario no Banco de Dados.
 * Data: 11/10/2023
 * Autor: Gustavo Souza Tenorio  de Barros
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/********************Selects************************** */
const selectAllQuestionario = async function () {
    let sql = 'Select * from tbl_questionario'

    let rsQuestionario = await prisma.$queryRawUnsafe(sql)

    if (rsQuestionario.length > 0) {
        let questionarios = []


        rsQuestionario.forEach(resposta => {
            let questionarioJSON = {}

            questionarioJSON.id = resposta.id

            if (resposta.resposta === 1) {
                questionarioJSON.resposta = true
            } else {
                questionarioJSON.resposta = false
            }

            questionarioJSON.id_pergunta = resposta.id_pergunta
            questionarioJSON.id_relatorio = resposta.id_relatorio

            questionarios.push(questionarioJSON)
        });

        return questionarios
    } else {
        return false
    }
}

const selectQuestionarioByID = async function (idQuestionario) {

    let sql = `SELECT * FROM tbl_questionario where id = ${idQuestionario}`
    let rsQuestionario = await prisma.$queryRawUnsafe(sql)



    if (rsQuestionario.length > 0) {

        let questionarioJSON = {}
        questionarioJSON.id = rsQuestionario[0].id
        questionarioJSON.id_pergunta = rsQuestionario[0].id_pergunta
        questionarioJSON.id_relatorio = rsQuestionario[0].id_relatorio

        if (rsQuestionario.resposta === 1) {
            questionarioJSON.resposta = true
        } else {
            questionarioJSON.resposta = false
        }
        
        return questionarioJSON
    } else {
        return false
    }

}

const selectLastId = async function () {

    let sql = 'select * from tbl_questionario order by id desc limit 1;'

    let rsQuestionario = await prisma.$queryRawUnsafe(sql)


    if (rsQuestionario.length > 0) {

        let questionarioJSON = {}
        questionarioJSON.id = rsQuestionario[0].id
        questionarioJSON.id_pergunta = rsQuestionario[0].id_pergunta
        questionarioJSON.id_relatorio = rsQuestionario[0].id_relatorio

        if (rsQuestionario.resposta === 1) {
            questionarioJSON.resposta = true
        } else {
            questionarioJSON.resposta = false
        }
       

        return questionarioJSON
    } else {
        return false
    }

}
/**************************Inserts******************************/
const insertQuestionario = async function (dadosQuestionario) {

    let sql = `insert into tbl_questionario(
        id_pergunta,
        resposta,
        id_relatorio
    ) values (
        ${dadosQuestionario.id_pergunta},
        ${dadosQuestionario.resposta},
        ${dadosQuestionario.id_relatorio}
    )`


    let resultQuestionario = await prisma.$executeRawUnsafe(sql)

    if (resultQuestionario) {
        return true
    } else {
        return false
    }
}



module.exports = {
    selectAllQuestionario,
    selectQuestionarioByID,
    selectLastId,
    insertQuestionario
}