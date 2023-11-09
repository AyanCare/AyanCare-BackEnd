/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados que irão para o calendário no Banco de Dados.
 * Data: 17/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllEventosByPacienteMonthly = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_sintoma'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsSintoma = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsSintoma.length > 0) {
        return rsSintoma
    } else {
        return false
    }

}

const selectAllEventosByCuidadorMonthly = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_sintoma'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsSintoma = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsSintoma.length > 0) {
        return rsSintoma
    } else {
        return false
    }

}

const selectAllEventosAndAlarmesByPacienteDiary = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_sintoma'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsSintoma = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsSintoma.length > 0) {
        return rsSintoma
    } else {
        return false
    }

}

const selectAllEventosAndAlarmesByCuidadorDiary = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_sintoma'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsSintoma = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsSintoma.length > 0) {
        return rsSintoma
    } else {
        return false
    }

}

module.exports = {
    selectAllEventosAndAlarmesByCuidadorDiary,
    selectAllEventosAndAlarmesByPacienteDiary,
    selectAllEventosByCuidadorMonthly,
    selectAllEventosByPacienteMonthly
}
