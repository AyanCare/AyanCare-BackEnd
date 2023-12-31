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
    on tbl_cuidador_notificacao.id_cuidador = tbl_cuidador.id
    order by tbl_notificacao.id desc`

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

const selectNotificacoesByCuidadorAndPaciente = async function (idPaciente, idCuidador) {

    //scriptSQL para buscar todos os itens do BD
    let sql = `SELECT tbl_notificacao.nome as nome, tbl_notificacao.descricao, date_format(tbl_notificacao.data_criacao, '%d/%m/%Y') as data_criacao, time_format(tbl_notificacao.hora_criacao, '%H:%i') as hora_criacao,
                      tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador,
		      tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente
    FROM tbl_notificacao
        left join tbl_paciente_notificacao
    on tbl_paciente_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_cuidador_notificacao
    on tbl_cuidador_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_paciente
    on tbl_paciente_notificacao.id_paciente = tbl_paciente.id
        left join tbl_cuidador
    on tbl_cuidador_notificacao.id_cuidador = tbl_cuidador.id
    where tbl_paciente.id = ${idPaciente} and tbl_cuidador.id = ${idCuidador}
    order by tbl_notificacao.id desc `

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
    let sql = `SELECT tbl_notificacao.id as id, tbl_notificacao.nome as nome, tbl_notificacao.descricao, date_format(tbl_notificacao.data_criacao, '%d/%m/%Y') as data_criacao, time_format(tbl_notificacao.hora_criacao, '%H:%i') as hora_criacao,
                      tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente
    FROM tbl_notificacao
        left join tbl_paciente_notificacao
    on tbl_paciente_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_cuidador_notificacao
    on tbl_cuidador_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_paciente
    on tbl_paciente_notificacao.id_paciente = tbl_paciente.id
    where tbl_paciente.id = ${idPaciente}
    order by tbl_notificacao.id desc `

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
    let sql = `SELECT tbl_notificacao.id as id, tbl_notificacao.nome as nome, tbl_notificacao.descricao, date_format(tbl_notificacao.data_criacao, '%d/%m/%Y') as data_criacao, time_format(tbl_notificacao.hora_criacao, '%H:%i') as hora_criacao,
                      tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador
    FROM tbl_notificacao
        left join tbl_paciente_notificacao
    on tbl_paciente_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_cuidador_notificacao
    on tbl_cuidador_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_cuidador
    on tbl_cuidador_notificacao.id_cuidador = tbl_cuidador.id
    where tbl_cuidador.id = ${idCuidador}
    order by tbl_notificacao.id desc`

    let rsNotificacao = await prisma.$queryRawUnsafe(sql)

    if (rsNotificacao.length > 0) {
        return rsNotificacao
    } else {
        return false
    }
}

const selectAllNotificacoesByCuidadorAndHorario = async function (idCuidador, horario) {
    let sql = `SELECT tbl_notificacao.id as id, tbl_notificacao.nome as nome, tbl_notificacao.descricao, date_format(tbl_notificacao.data_criacao, '%d/%m/%Y') as data_criacao, time_format(tbl_notificacao.hora_criacao, '%H:%i') as hora_criacao,
                      tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador
    FROM tbl_notificacao
        left join tbl_paciente_notificacao
    on tbl_paciente_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_cuidador_notificacao
    on tbl_cuidador_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_cuidador
    on tbl_cuidador_notificacao.id_cuidador = tbl_cuidador.id
    where tbl_cuidador.id = ${idCuidador} and time_format(tbl_notificacao.hora_criacao, '%H:%i') = "${horario}"
    order by tbl_notificacao.id desc `

    let rsNotificacao = await prisma.$queryRawUnsafe(sql)

    if (rsNotificacao.length > 0) {
        return rsNotificacao
    } else {
        return false
    }
}

const selectAllNotificacoesByPacienteAndHorario = async function (idPaciente, horario) {
    let sql = `SELECT tbl_notificacao.id as id, tbl_notificacao.nome as nome, tbl_notificacao.descricao, date_format(tbl_notificacao.data_criacao, '%d/%m/%Y') as data_criacao, time_format(tbl_notificacao.hora_criacao, '%H:%i') as hora_criacao,
                      tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente
    FROM tbl_notificacao
        left join tbl_paciente_notificacao
    on tbl_paciente_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_cuidador_notificacao
    on tbl_cuidador_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_paciente
    on tbl_paciente_notificacao.id_paciente = tbl_paciente.id
    where tbl_paciente.id = ${idPaciente} and time_format(tbl_notificacao.hora_criacao, '%H:%i') = "${horario}"
    order by tbl_notificacao.id desc `

    let rsNotificacao = await prisma.$queryRawUnsafe(sql)

    if (rsNotificacao.length > 0) {
        return rsNotificacao
    } else {
        return false
    }
}

const selectAllModificacoesDePaciente = async function (idCuidador) {
    let sql = `SELECT tbl_notificacao.id as id, tbl_notificacao.nome as nome, tbl_notificacao.descricao, date_format(tbl_notificacao.data_criacao, '%d/%m/%Y') as data_criacao, time_format(tbl_notificacao.hora_criacao, '%H:%i') as hora_criacao,
                      tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador,
                      tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente
    FROM tbl_notificacao
        left join tbl_paciente_notificacao
    on tbl_paciente_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_cuidador_notificacao
    on tbl_cuidador_notificacao.id_notificacao = tbl_notificacao.id
        left join tbl_cuidador
    on tbl_cuidador_notificacao.id_cuidador = tbl_cuidador.id
		left join tbl_paciente
    on tbl_paciente_notificacao.id_paciente = tbl_paciente.id
    where tbl_notificacao.nome like "Modificação feita:%" and tbl_cuidador.id = ${idCuidador}
    order by tbl_notificacao.id desc;`

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
    where tbl_notificacao.id = ${idNotificacao}
    order by tbl_notificacao.id desc `

    let rsNotificacao = await prisma.$queryRawUnsafe(sql)

    if (rsNotificacao.length > 0) {
        return rsNotificacao[0]
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = `SELECT tbl_notificacao.id as id, tbl_notificacao.nome as nome, tbl_notificacao.descricao, date_format(tbl_notificacao.data_criacao, '%d/%m/%Y') as data_criacao, time_format(tbl_notificacao.hora_criacao, '%H:%i') as hora_criacao
    FROM tbl_notificacao
    order by tbl_notificacao.id desc limit 1`

    let rsNotificacao = await prisma.$queryRawUnsafe(sql)

    if (rsNotificacao.length > 0) {
        return rsNotificacao[0]
    } else {
        return false
    }
}

const insertNotificacao = async function (dadosNotificacao) {
    console.log(dadosNotificacao);

    let sql = `call procInsertNotificacao(
        "${dadosNotificacao.nome}", 
        "${dadosNotificacao.descricao}", 
        ${dadosNotificacao.id_cuidador}, 
        ${dadosNotificacao.id_paciente});`

    console.log(sql);

    let rsNotificacao = await prisma.$executeRawUnsafe(sql)

    if (rsNotificacao) {
        return true
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
    selectNotificacaoById,
    selectLastId,
    insertNotificacao,
    selectAllModificacoesDePaciente,
    selectNotificacoesByCuidadorAndPaciente
}
