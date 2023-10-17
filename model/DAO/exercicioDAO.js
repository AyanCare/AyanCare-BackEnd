/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos EXERCICIOS no Banco de Dados.
 * Data: 17/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllExercicios = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_exercicio'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsExercicio = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsExercicio.length > 0) {
        return rsExercicio
    } else {
        return false
    }

}

const selectExercicioById = async function (idExercicio) {
    let sql = `SELECT * FROM tbl_exercicio where id = ${idExercicio}`

    let rsExercicio = await prisma.$queryRawUnsafe(sql)

    if (rsExercicio.length > 0) {
        return rsExercicio[0]
    } else {
        return false
    }
}

module.exports = {
    selectAllExercicios,
    selectExercicioById
}
