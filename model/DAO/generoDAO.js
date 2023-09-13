/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos GENEROS no Banco de Dados.
 * Data: 11/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllGeneros = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_genero'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsGenero = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsGenero.length > 0) {
        return rsGenero
    } else {
        return false
    } 

}

const selectGeneroById = async function (idGenero) {
    let sql = `SELECT * FROM tbl_genero where id = ${idGenero}`

    let rsGenero = await prisma.$queryRawUnsafe(sql)

    if (rsGenero.length > 0) {
        return rsGenero
    } else {
        return false
    }
}

module.exports = {
    selectAllGeneros,
    selectGeneroById
}