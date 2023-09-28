/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Contatos no Banco de Dados.
 * Data: 26/09/2023
 * Autor: Gustavo Souza Tenorio  de Barros
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


const selectLastId = async function () {
    let sql = 'select * from tbl_contato order by id desc limit 1;'

    let rsContato = await prisma.$queryRawUnsafe(sql)

    if (rsCuidador.length > 0) {
        return rsContato
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}


/***********************Inserte***************************** */

const insertContato = async function( dadosContato){

    let sql = `insert into tbl_contato(
        nome,
        numero,
        local,
        id_paciente,
        id_status_contato
    ) values(
        '${dadosContato.nome}',
        '${dadosContato.numero}',
        '${dadosContato.local}',
        ${dadosContato.id_paciente},
        ${dadosContato.id_status_contato},
    )`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }


}



/****************** Updates  *********************************** */

const updateContato = async function(dadosContato){

    let sql = `update tbl_contato set 
            nome   = '${dadosContato.nome}',
            numero = '${dadosContato.numero}',
            local  = '${dadosContato.local}'
        where id = ${dadosContato.id} `
    let resultStatus = await prisma.$executeRawUnsafe(sql)
    
    if (resultStatus){
        return true
    }else{
        return false
    }
    
}



/************************** Deletes ******************************/
const deleteContato = async function (idContato) {
    let sql = `delete from tbl_contato where id = ${idContato}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}


module.exports = {
    deleteContato,
    updateContato,
    insertContato,
    selectAllContatos,
    selectContatoById,
    selectLastId
}