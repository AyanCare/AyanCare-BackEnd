/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados das CORES no Banco de Dados.
 * Data: 24/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllCores = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_cor'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsCor = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsCor.length > 0) {
        return rsCor
    } else {
        return false
    }

}

const selectCorById = async function (idCor) {
    let sql = `SELECT * FROM tbl_cor where id = ${idCor}`

    let rsCor = await prisma.$queryRawUnsafe(sql)

    if (rsCor.length > 0) {
        return rsCor[0]
    } else {
        return false
    }
}

module.exports = {
    selectAllCores,
    selectCorById
}
