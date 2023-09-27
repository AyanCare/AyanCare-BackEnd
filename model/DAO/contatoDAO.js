/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Contatos no Banco de Dados.
 * Data: 26/09/2023
 * Autor: Gustavo Souza
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()


/********************Selects************************** */

const selectAllContatos = async function() {
    

    //ScriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_contato'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsContato = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsContato.length > 0) {
        return rsContato
    } else {
        return false
    }
}



/******************Select pelo ID************************ */

const selectContatoById = async function (idContato) {
    let sql = `SELECT * FROM tbl_contato where id = ${idContato}`

    let rsContato = await prisma.$queryRawUnsafe(sql)

    if (rsContato.length > 0) {
        return rsContato
    } else {
        return false
    }
}


