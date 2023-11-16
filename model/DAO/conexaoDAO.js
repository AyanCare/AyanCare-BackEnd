/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados das Conexões no Banco de Dados.
 * Data: 11/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllConexoes = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = `SELECT tbl_paciente_cuidador.id as id,
    tbl_paciente.foto as foto_paciente, tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente,
    tbl_cuidador.foto as foto_cuidador, tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador
    FROM tbl_paciente_cuidador
        inner join tbl_paciente
    on tbl_paciente.id = tbl_paciente_cuidador.id_paciente
        inner join tbl_cuidador
    on tbl_cuidador.id = tbl_paciente_cuidador.id_cuidador
    where tbl_paciente_cuidador.status = 1`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsConexao = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsConexao.length > 0) {
        return rsConexao
    } else {
        return false
    } 

}

const selectConexaoById = async function (idConexao) {
    let sql = `SELECT tbl_paciente_cuidador.id as id,
    tbl_paciente.foto as foto_paciente, tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente,
    tbl_cuidador.foto as foto_cuidador, tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador
    FROM tbl_paciente_cuidador
        inner join tbl_paciente
    on tbl_paciente.id = tbl_paciente_cuidador.id_paciente
        inner join tbl_cuidador
    on tbl_cuidador.id = tbl_paciente_cuidador.id_cuidador
    where tbl_paciente_cuidador.id = ${idConexao}`

    let rsConexao = await prisma.$queryRawUnsafe(sql)

    if (rsConexao.length > 0) {
        return rsConexao[0]
    } else {
        return false
    }
}

const selectConexaoByPaciente = async function (idPaciente) {
    let sql = `SELECT tbl_paciente_cuidador.id as id,
    tbl_paciente.foto as foto_paciente, tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente,
    tbl_cuidador.foto as foto_cuidador, tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador
    FROM tbl_paciente_cuidador
        inner join tbl_paciente
    on tbl_paciente.id = tbl_paciente_cuidador.id_paciente
        inner join tbl_cuidador
    on tbl_cuidador.id = tbl_paciente_cuidador.id_cuidador
    where tbl_paciente_cuidador.status = 1 and tbl_paciente.id = ${idPaciente}`

    let rsConexao = await prisma.$queryRawUnsafe(sql)

    if (rsConexao.length > 0) {
        return rsConexao
    } else {
        return false
    }
}

const selectConexaoByPacienteAndNomeCuidador = async function (idPaciente, nomeDoCuidador) {
    let sql = `SELECT tbl_paciente_cuidador.id as id,
    tbl_paciente.foto as foto_paciente, tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente,
    tbl_cuidador.foto as foto_cuidador, tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador
    FROM tbl_paciente_cuidador
        inner join tbl_paciente
    on tbl_paciente.id = tbl_paciente_cuidador.id_paciente
        inner join tbl_cuidador
    on tbl_cuidador.id = tbl_paciente_cuidador.id_cuidador
    where tbl_paciente_cuidador.status = 1 and tbl_paciente.id = ${idPaciente} and tbl_cuidador.nome like '%${nomeDoCuidador}%'`

    let rsConexao = await prisma.$queryRawUnsafe(sql)

    if (rsConexao.length > 0) {
        return rsConexao
    } else {
        return false
    }
}

const selectConexaoByCuidador = async function (idCuidador) {
    let sql = `SELECT tbl_paciente_cuidador.id as id,
    tbl_paciente.foto as foto_paciente, tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente,
    tbl_cuidador.foto as foto_cuidador, tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador
    FROM tbl_paciente_cuidador
        inner join tbl_paciente
    on tbl_paciente.id = tbl_paciente_cuidador.id_paciente
        inner join tbl_cuidador
    on tbl_cuidador.id = tbl_paciente_cuidador.id_cuidador
    where tbl_paciente_cuidador.status = 1 and tbl_cuidador.id = ${idCuidador}`

    let rsConexao = await prisma.$queryRawUnsafe(sql)

    if (rsConexao.length > 0) {
        return rsConexao
    } else {
        return false
    }
}

const selectConexaoByCuidadorAndNomePaciente = async function (idCuidador, nomeDoPaciente) {
    let sql = `SELECT tbl_paciente_cuidador.id as id,
    tbl_paciente.foto as foto_paciente, tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente,
    tbl_cuidador.foto as foto_cuidador, tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador
    FROM tbl_paciente_cuidador
        inner join tbl_paciente
    on tbl_paciente.id = tbl_paciente_cuidador.id_paciente
        inner join tbl_cuidador
    on tbl_cuidador.id = tbl_paciente_cuidador.id_cuidador
    where tbl_paciente_cuidador.status = 1 and tbl_cuidador.id = ${idCuidador} and tbl_paciente.nome like '%${nomeDoPaciente}%'`

    let rsConexao = await prisma.$queryRawUnsafe(sql)

    if (rsConexao.length > 0) {
        return rsConexao
    } else {
        return false
    }
}

const desativarConexao = async function (idPaciente, idCuidador) {
    let sql = `update tbl_paciente_cuidador set
            status = 0
        where id_paciente = ${idPaciente} and id_cuidador = ${idCuidador}
    `

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const ativarConexao = async function (idPaciente, idCuidador) {
    let sql = `update tbl_paciente_cuidador set
            status = 1
            where id_paciente = ${idPaciente} and id_cuidador = ${idCuidador}
    `

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

module.exports = {
    selectAllConexoes,
    selectConexaoById,
    selectConexaoByCuidador,
    selectConexaoByCuidadorAndNomePaciente,
    selectConexaoByPaciente,
    selectConexaoByPacienteAndNomeCuidador,
    desativarConexao,
    ativarConexao
}