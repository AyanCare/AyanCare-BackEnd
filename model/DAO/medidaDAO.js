/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados das MEDIDAS no Banco de Dados.
 * Data: 19/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllMedidas = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_medida'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsMedida = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsMedida.length > 0) {
        return rsMedida
    } else {
        return false
    } 

}

const selectMedidaById = async function (idMedida) {
    let sql = `SELECT * FROM tbl_medida where id = ${idMedida}`

    let rsMedida = await prisma.$queryRawUnsafe(sql)

    if (rsMedida.length > 0) {
        return rsMedida
    } else {
        return false
    }
}

module.exports = {
    selectAllMedidas,
    selectMedidaById
}
