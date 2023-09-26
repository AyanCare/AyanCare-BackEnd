/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Responsaveis no Banco de Dados.
 * Data: 26/09/2023
 * Autor: Gustavo Souza
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()


/********************Selects************************** */

const selectAllResponsaveis = async function() {
    

    //ScriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_contado'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rscontado = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rscontado.length > 0) {
        return rscontado
    } else {
        return false
    }


}



/******************Select pelo ID************************ */

const selectcontadoById = async function (idContado) {
    let sql = `SELECT * FROM tbl_contado where id = ${idContado}`

    let rscontado = await prisma.$queryRawUnsafe(sql)

    if (rscontado.length > 0) {
        return rscontado
    } else {
        return false
    }
}


