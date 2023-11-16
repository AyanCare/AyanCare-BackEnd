/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos  Status Alarmes no Banco de Dados.
 * Data: 02/11/2023
 * Autor: Gustavo Souza Tenorio  de Barros
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()


/********************Selects************************** */

const selectAllStatusAlarme = async function() {
    

    //ScriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_status_alarme'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsStatusAlarme = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsStatusAlarme.length > 0) {
        return rsStatusAlarme

    } else {
        return false
    }
}

const selectStatusAlarmeById = async function(id){

    //scriptSQL para buscar todos os itens do BD
    let sql = `SELECT * FROM tbl_status_alarme where id = ${id}`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsStatusAlarme = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsStatusAlarme.length > 0) {
        return rsStatusAlarme[0]
    } else {
        return false
    } 


}


module.exports = {
    selectAllStatusAlarme,
    selectStatusAlarmeById
}
