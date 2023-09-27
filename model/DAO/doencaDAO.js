/**************************************************************************************
* Objetivo: Responsável pela manipulação de dados das Doenças Crônicas no Banco de Dados.
* Data: 27/09/2023
* Autor: Lohannes da Silva Costa
* Versão: 1.0
**************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllDoencas = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_doenca_cronica'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsDoenca = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsDoenca.length > 0) {
        return rsDoenca
    } else {
        return false
    }

}

const selectDoencaById = async function (idDoenca) {
    let sql = `SELECT * FROM tbl_doenca_cronica where id = ${idDoenca}`

    let rsDoenca = await prisma.$queryRawUnsafe(sql)

    if (rsDoenca.length > 0) {
        return rsDoenca
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = 'select * from tbl_doenca_cronica order by id desc limit 1;'

    let rsDoenca = await prisma.$queryRawUnsafe(sql)

    if (rsDoenca.length > 0) {
        return rsDoenca
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

/************************** Inserts ******************************/

/****************************************************************************************
VVVVV Depois fazer o tratamento para caso exista um doenca com dados parecidos!!! VVVVV
****************************************************************************************/
const insertDoenca = async function (dadosDoenca) {
    let sql = `insert into tbl_doenca_cronica(
        nome,
        grau
    ) values (
        '${dadosDoenca.nome}',
        '${dadosDoenca.grau}'
    )`
    //talvez ID de endereco e de genero mudem de nome

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const insertDoencaIntoPaciente = async function (dadosDoenca){

    let sql = `insert into tbl_comorbidade_paciente(
        id_doenca_cronica,
        id_paciente
    ) values (
        ${dadosDoenca.id_doenca},
        ${dadosDoenca.id_paciente}
    )`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

/************************** Updates ******************************/
const updateDoenca = async function (dadosDoenca) {
    let sql = `update tbl_doenca_cronica set
            nome = '${dadosDoenca.nome}',
            grau = '${dadosDoenca.grau}'
        where id = ${dadosDoenca.id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

/************************** Deletes ******************************/
const deleteDoenca = async function (idDoenca) {
    let sql = `delete from tbl_doenca_cronica where id = ${idDoenca}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const deleteDoencaOfPaciente = async function (idDoenca){
    let sql = `delete from tbl_doenca_paciente where id_doenca_cronica = ${idDoenca}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    }else{
        return false
    }
}

module.exports = {
    deleteDoenca,
    insertDoenca,
    selectAllDoencas,
    selectDoencaById,
    selectLastId,
    updateDoenca,
    deleteDoencaOfPaciente,
    insertDoencaIntoPaciente
}