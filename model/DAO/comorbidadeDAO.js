/**************************************************************************************
* Objetivo: Responsável pela manipulação de dados das COMORBIDADES no Banco de Dados.
* Data: 26/09/2023
* Autor: Lohannes da Silva Costa
* Versão: 1.0
**************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllComorbidades = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_comorbidade'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsComorbidade = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsComorbidade.length > 0) {
        return rsComorbidade
    } else {
        return false
    }

}

const selectComorbidadeById = async function (idComorbidade) {
    let sql = `SELECT * FROM tbl_comorbidade where id = ${idComorbidade}`

    let rsComorbidade = await prisma.$queryRawUnsafe(sql)

    if (rsComorbidade.length > 0) {
        return rsComorbidade
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = 'select * from tbl_comorbidade order by id desc limit 1;'

    let rsComorbidade = await prisma.$queryRawUnsafe(sql)

    if (rsComorbidade.length > 0) {
        return rsComorbidade
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

/************************** Inserts ******************************/

/****************************************************************************************
VVVVV Depois fazer o tratamento para caso exista um comorbidade com dados parecidos!!! VVVVV
****************************************************************************************/
const insertComorbidade = async function (dadosComorbidade) {
    let sql = `insert into tbl_comorbidade(
        nome
    ) values (
        '${dadosComorbidade.nome}'
    )`
    //talvez ID de endereco e de genero mudem de nome

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const insertComorbidadeIntoPaciente = async function (dadosComorbidade){

    let sql = `insert into tbl_comorbidade_paciente(
        id_comorbidade,
        id_paciente
    ) values (
        ${dadosComorbidade.id_comorbidade},
        ${dadosComorbidade.id_paciente}
    )`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

/************************** Updates ******************************/
const updateComorbidade = async function (dadosComorbidade) {
    let sql = `update tbl_comorbidade set
            nome = '${dadosComorbidade.nome}'
        where id = ${dadosComorbidade.id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

/************************** Deletes ******************************/
const deleteComorbidade = async function (idComorbidade) {
    let sql = `delete from tbl_comorbidade where id = ${idComorbidade}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const deleteComorbidadeOfPaciente = async function (idComorbidade){
    let sql = `delete from tbl_comorbidade_paciente where id_comorbidade = ${idComorbidade}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    }else{
        return false
    }
}

module.exports = {
    deleteComorbidade,
    insertComorbidade,
    selectAllComorbidades,
    selectComorbidadeById,
    selectLastId,
    updateComorbidade,
    deleteComorbidadeOfPaciente,
    insertComorbidadeIntoPaciente
}