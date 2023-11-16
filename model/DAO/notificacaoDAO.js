/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados das NOTIFICACOES no Banco de Dados.
 * Data: 24/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require(`@prisma/client`);

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllNotificacoes = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = `SELECT tbl_notificacao.nome as nome, tbl_notificacao.descricao, date_format(tbl_notificacao.data_criacao, '%d/%m/%Y') as data_criacao, time_format(tbl_notificacao.hora_criacao, '%H:%i') as hora_criacao,
                      COALESCE(
                            CONCAT(tbl_paciente.nome, " - Paciente", 
                            IF(tbl_cuidador.nome IS NOT NULL, CONCAT(", ", tbl_cuidador.nome, " - Cuidador"), "")
                              ),
        CONCAT(tbl_cuidador.nome, " - Cuidador")
    ) as usuario
    FROM tbl_notificacao
        left join tbl_paciente_notificacao
    on tbl_paciente_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_cuidador_notificacao
    on tbl_cuidador_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_paciente
    on tbl_paciente_notificacao.id_paciente = tbl_paciente.id
        left join tbl_cuidador
    on tbl_cuidador_notificacao.id_cuidador = tbl_cuidador.id`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw(`SELECT * FROM tbl_aluno`) - Executa diretamente o script dentro do método
    let rsNotificacao = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsNotificacao.length > 0) {
        return rsNotificacao
    } else {
        return false
    }

}

const selectAllNotificacoesByPaciente = async function (idPaciente) {

    //scriptSQL para buscar todos os itens do BD
    let sql = `SELECT tbl_notificao.id as id, tbl_notificacao.nome as nome, tbl_notificacao.descricao, date_format(tbl_notificacao.data_criacao, '%d/%m/%Y') as data_criacao, time_format(tbl_notificacao.hora_criacao, '%H:%i') as hora_criacao,
                      tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente
    FROM tbl_notificacao
        left join tbl_paciente_notificacao
    on tbl_paciente_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_cuidador_notificacao
    on tbl_cuidador_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_cuidador
    on tbl_cuidador_notificacao.id_cuidador = tbl_cuidador.id
    where tbl_paciente.id = ${idPaciente}`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw(`SELECT * FROM tbl_aluno`) - Executa diretamente o script dentro do método
    let rsNotificacao = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsNotificacao.length > 0) {
        return rsNotificacao
    } else {
        return false
    }

}

const selectAllNotificacoesByCuidador = async function (idCuidador) {
    let sql = `SELECT tbl_notificao.id as id, tbl_notificacao.nome as nome, tbl_notificacao.descricao, date_format(tbl_notificacao.data_criacao, '%d/%m/%Y') as data_criacao, time_format(tbl_notificacao.hora_criacao, '%H:%i') as hora_criacao,
                      tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador
    FROM tbl_notificacao
        left join tbl_paciente_notificacao
    on tbl_paciente_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_cuidador_notificacao
    on tbl_cuidador_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_paciente
    on tbl_paciente_notificacao.id_paciente = tbl_paciente.id
    where tbl_cuidador.id = ${idCuidador}`

    let rsNotificacao = await prisma.$queryRawUnsafe(sql)

    if (rsNotificacao.length > 0) {
        return rsNotificacao[0]
    } else {
        return false
    }
}

const selectAllNotificacoesByCuidadorAndHorario = async function (idCuidador, horario) {
    let sql = `SELECT tbl_notificao.id as id, tbl_notificacao.nome as nome, tbl_notificacao.descricao, date_format(tbl_notificacao.data_criacao, '%d/%m/%Y') as data_criacao, time_format(tbl_notificacao.hora_criacao, '%H:%i') as hora_criacao,
                      tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador
    FROM tbl_notificacao
        left join tbl_paciente_notificacao
    on tbl_paciente_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_cuidador_notificacao
    on tbl_cuidador_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_cuidador
    on tbl_cuidador_notificacao.id_cuidador = tbl_cuidador.id
    where tbl_cuidador.id = ${idCuidador} and tbl_notificacao.hora_criacao = "${horario}"`

    let rsNotificacao = await prisma.$queryRawUnsafe(sql)

    if (rsNotificacao.length > 0) {
        return rsNotificacao
    } else {
        return false
    }
}

const selectAllNotificacoesByPacienteAndHorario = async function (idPaciente, horario) {
    let sql = `SELECT tbl_notificao.id as id, tbl_notificacao.nome as nome, tbl_notificacao.descricao, date_format(tbl_notificacao.data_criacao, '%d/%m/%Y') as data_criacao, time_format(tbl_notificacao.hora_criacao, '%H:%i') as hora_criacao,
                      tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente
    FROM tbl_notificacao
        left join tbl_paciente_notificacao
    on tbl_paciente_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_cuidador_notificacao
    on tbl_cuidador_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_paciente
    on tbl_paciente_notificacao.id_paciente = tbl_paciente.id
    where tbl_paciente.id = ${idPaciente} and tbl_notificacao.hora_criacao = "${horario}"`

    let rsNotificacao = await prisma.$queryRawUnsafe(sql)

    if (rsNotificacao.length > 0) {
        return rsNotificacao
    } else {
        return false
    }
}

const selectNotificacaoById = async function (idNotificacao) {
    let sql = `SELECT tbl_notificacao.nome as nome, tbl_notificacao.descricao, date_format(tbl_notificacao.data_criacao, '%d/%m/%Y') as data_criacao, time_format(tbl_notificacao.hora_criacao, '%H:%i') as hora_criacao,
                      COALESCE(
                            CONCAT(tbl_paciente.nome, " - Paciente", 
                            IF(tbl_cuidador.nome IS NOT NULL, CONCAT(", ", tbl_cuidador.nome, " - Cuidador"), "")
                              ),
        CONCAT(tbl_cuidador.nome, " - Cuidador"), null
    ) as usuario
    FROM tbl_notificacao
        left join tbl_paciente_notificacao
    on tbl_paciente_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_cuidador_notificacao
    on tbl_cuidador_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_paciente
    on tbl_paciente_notificacao.id_paciente = tbl_paciente.id
        left join tbl_cuidador
    on tbl_cuidador_notificacao.id_cuidador = tbl_cuidador.id
    where tbl_notificacao.id = ${idNotificacao}`

    let rsNotificacao = await prisma.$queryRawUnsafe(sql)

    if (rsNotificacao.length > 0) {
        return rsNotificacao[0]
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = `SELECT tbl_notificao.id as id, tbl_notificacao.nome as nome, tbl_notificacao.descricao, date_format(tbl_notificacao.data_criacao, '%d/%m/%Y') as data_criacao, time_format(tbl_notificacao.hora_criacao, '%H:%i') as hora_criacao
    FROM tbl_notificacao
    order by id desc limit 1`

    let rsNotificacao = await prisma.$queryRawUnsafe(sql)

    if (rsNotificacao.length > 0) {
        return rsNotificacao[0]
    } else {
        return false
    }
}

const insertNotificacaoInPaciente = async function (idCor) {
    let sql = `SELECT * FROM tbl_notificacao where id = ${idCor}`

    let rsNotificacao = await prisma.$queryRawUnsafe(sql)

    if (rsNotificacao.length > 0) {
        return rsNotificacao[0]
    } else {
        return false
    }
}

const insertNotificacaoInCuidador = async function (idCor) {
    let sql = `SELECT * FROM tbl_notificacao where id = ${idCor}`

    let rsNotificacao = await prisma.$queryRawUnsafe(sql)

    if (rsNotificacao.length > 0) {
        return rsNotificacao[0]
    } else {
        return false
    }
}

const insertNotificacaoInCuidadorAndPaciente = async function (idCor) {
    let sql = `SELECT * FROM tbl_notificacao where id = ${idCor}`

    let rsNotificacao = await prisma.$queryRawUnsafe(sql)

    if (rsNotificacao.length > 0) {
        return rsNotificacao[0]
    } else {
        return false
    }
}

module.exports = {
    selectAllNotificacoes,
    selectAllNotificacoesByCuidador,
    selectAllNotificacoesByPaciente,
    selectAllNotificacoesByCuidadorAndHorario,
    selectAllNotificacoesByPacienteAndHorario,
    selectNotificacaoById
}
