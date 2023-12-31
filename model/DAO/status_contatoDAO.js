/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos  Status Contatos no Banco de Dados.
 * Data: 26/09/2023
 * Autor: Gustavo Souza Tenorio  de Barros
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()


/********************Selects************************** */

const selectAllStatusContato = async function() {
    

    //ScriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_status_contato'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsStatusContato = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsStatusContato.length > 0) {
        return rsStatusContato

    } else {
        return false
    }
}

const selectStatusContatoById = async function(id){

    //scriptSQL para buscar todos os itens do BD
    let sql = `SELECT * FROM tbl_status_contato where id = ${id}`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsStatusContato = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsStatusContato.length > 0) {
        return rsStatusContato[0]
    } else {
        return false
    } 


}

const insertStatusContato = async function(dadoStatus){

    //scriptSQL para buscar todos os itens do BD
    let sql = `insert into tbl_status_contato (nome) values ('${dadoStatus.nome}')`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsStatusContato = await prisma.$executeRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsStatusContato) {
        return true
    } else {
        return false
    } 


}


module.exports = {
    selectAllStatusContato,
    selectStatusContatoById,
    insertStatusContato
}
