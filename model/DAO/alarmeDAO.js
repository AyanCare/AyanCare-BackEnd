/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Alarmes de Medicamentos no Banco de Dados.
 * Data: 29/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllAlarmes = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_alarme_medicamento'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsAlarme = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsAlarme.length > 0) {
        return rsAlarme
    } else {
        return false
    }

}

const selectAlarmeById = async function (idAlarme) {
    let sql = `SELECT * FROM tbl_alarme_medicamento where id = ${idAlarme}`

    let rsAlarme = await prisma.$queryRawUnsafe(sql)

    if (rsAlarme.length > 0) {
        return rsAlarme
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = 'select * from tbl_alarme_medicamento order by id desc limit 1;'

    let rsAlarme = await prisma.$queryRawUnsafe(sql)

    if (rsAlarme.length > 0) {
        return rsAlarme
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}



/************************** Inserts ******************************/

/****************************************************************************************
VVVVV Depois fazer o tratamento para caso exista um alarme com dados parecidos!!! VVVVV
****************************************************************************************/
const insertAlarme = async function (dadosAlarme) {
    let sql = `insert into tbl_alarme_medicamento(
        dia,
        intervalo,
        horario,
        id_medicamento
    ) values (
        '${dadosAlarme.dia}',
        '${dadosAlarme.intervalo}',
        '${dadosAlarme.horario}',
        ${dadosAlarme.id_medicamento}
    )`
    //talvez ID de endereco e de genero mudem de nome

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

/************************** Updates ******************************/
const updateAlarme = async function (dadosAlarme) {
    let sql = `update tbl_alarme_medicamento set
            dia = '${dadosAlarme.dia}',
            intervalo = '${dadosAlarme.intervalo}',
            horario = '${dadosAlarme.horario}',
            id_medicamento = ${dadosAlarme.id_medicamento}
        where id = ${dadosAlarme.id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

/************************** Deletes ******************************/
const deleteAlarme = async function (idAlarme) {
    let sql = `delete from tbl_alarme_medicamento where id = ${idAlarme}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

module.exports = {
    deleteAlarme,
    insertAlarme,
    selectAlarmeById,
    selectAllAlarmes,
    selectLastId,
    updateAlarme
}