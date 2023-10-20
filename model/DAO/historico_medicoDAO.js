/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos HISTORICOS MEDICOS no Banco de Dados.
 * Data: 20/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllHistoricos = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_historico_medico'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsHistorico = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsHistorico.length > 0) {
        return rsHistorico
    } else {
        return false
    }

}

const selectHistoricoById = async function (idHistorico) {
    let sql = `SELECT * FROM tbl_historico_medico where id = ${idHistorico}`

    let rsHistorico = await prisma.$queryRawUnsafe(sql)

    if (rsHistorico.length > 0) {
        return rsHistorico[0]
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = 'select * from tbl_historico_medico order by id desc limit 1;'

    let rsHistorico = await prisma.$queryRawUnsafe(sql)

    if (rsHistorico.length > 0) {
        return rsHistorico[0]
    } else {
        return false
    }
    
    //retorna o ultimo id inserido no banco de dados
}

const selectHistoricoByPaciente = async function (idPaciente) {
    let sql = `select * from tbl_historico_medico where id_paciente = ${idPaciente}`

    let rsHistorico = await prisma.$queryRawUnsafe(sql)

    if (rsHistorico.length > 0) {
        return rsHistorico
    } else {
        return false
    }
}

/************************** Inserts ******************************/

const insertHistorico = async function (dadosHistorico) {
    let sql = `insert into tbl_historico_medico(
        historico_medico,
        id_paciente
    ) values (
        '${dadosHistorico.historico_medico}',
        ${dadosHistorico.id_paciente}
    )`
    //talvez ID de endereco e de genero mudem de nome

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

/************************** Updates ******************************/
const updateHistorico = async function (dadosHistorico) {
    let sql = `update tbl_historico_medico set
            historico_medico = '${dadosHistorico.historico_medico}'
        where id = ${dadosHistorico.id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

/************************** Deletes ******************************/
const deleteHistorico = async function (idHistorico) {
    let sql = `delete from tbl_historico_medico where id = ${idHistorico}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

module.exports = {
    deleteHistorico,
    insertHistorico,
    selectAllHistoricos,
    selectLastId,
    selectHistoricoById,
    updateHistorico,
    selectHistoricoByPaciente
}
