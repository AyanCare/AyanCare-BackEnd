/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos EVENTOS RECORRENTES no Banco de Dados.
 * Data: 05/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/

const selectEventoById = async function (idEvento) {
    let sql = `SELECT tbl_paciente.nome as paciente, tbl_cuidador.nome as cuidador,
        tbl_nome_descricao_local_evento.nome as nome, tbl_nome_descricao_local_evento.descricao as descricao, tbl_nome_descricao_local_evento.local as local,
        tbl_dia_semana_evento.horario as horario, tbl_dia_semana_evento.status as status, 
        tbl_dia_semana.dia as dia
    FROM tbl_dia_semana_evento
        inner join tbl_nome_descricao_local_evento
    on tbl_nome_descricao_local_evento.id = tbl_dia_semana_evento.id_nome_descricao_local_evento
        inner join tbl_dia_semana
    on tbl_dia_semana.id = tbl_dia_semana_evento.id_dia_semana
        inner join tbl_paciente_cuidador
    on tbl_paciente_cuidador.id = tbl_dia_semana_evento.id_paciente_cuidador
        inner join tbl_paciente
    on tbl_paciente.id = tbl_paciente_cuidador.id_paciente
        inner join tbl_cuidador
    on tbl_cuidador.id = tbl_paciente_cuidador.id_cuidador
    WHERE tbl_nome_descricao_local_evento.id = ${idEvento}`

    let rsEvento = await prisma.$queryRawUnsafe(sql)

    if (rsEvento.length > 0) {
        return rsEvento[0]
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = `SELECT tbl_paciente.nome as paciente, tbl_cuidador.nome as cuidador,
    tbl_nome_descricao_local_evento.nome as nome, tbl_nome_descricao_local_evento.descricao as descricao, tbl_nome_descricao_local_evento.local as local,
    tbl_dia_semana_evento.horario as horario, tbl_dia_semana_evento.status as status, 
    tbl_dia_semana.dia as dia
FROM tbl_dia_semana_evento
    inner join tbl_nome_descricao_local_evento
on tbl_nome_descricao_local_evento.id = tbl_dia_semana_evento.id_nome_descricao_local_evento
    inner join tbl_dia_semana
on tbl_dia_semana.id = tbl_dia_semana_evento.id_dia_semana
    inner join tbl_paciente_cuidador
on tbl_paciente_cuidador.id = tbl_dia_semana_evento.id_paciente_cuidador
    inner join tbl_paciente
on tbl_paciente.id = tbl_paciente_cuidador.id_paciente
    inner join tbl_cuidador
on tbl_cuidador.id = tbl_paciente_cuidador.id_cuidador
order by tbl_nome_descricao_local_evento.id desc limit 1`

    let rsEvento = await prisma.$queryRawUnsafe(sql)

    if (rsEvento.length > 0) {
        return rsEvento[0]
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

/************************** Inserts ******************************/

//call procInsertEventoSemanal('passeio', null, 'rua pitanga', '12:00', 1, 1, 0, 2, 1, 3, 0, 4, 0, 5, 1, 6, 1, 7, 0);

const insertEvento = async function (dadosEvento) {
    let sql = `call procInsertEventoSemanal(
        '${dadosEvento.nome}',
        '${dadosEvento.descricao}',
        '${dadosEvento.local}',
        '${dadosEvento.hora}',
        ${dadosEvento.id_paciente_cuidador},
        1,
        ${dadosEvento.domingo},
        2,
        ${dadosEvento.segunda},
        3,
        ${dadosEvento.terca},
        4,
        ${dadosEvento.quarta},
        5,
        ${dadosEvento.quinta},
        6,
        ${dadosEvento.sexta},
        7,
        ${dadosEvento.domingo}
    )`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

/************************** Updates ******************************/
const updateEvento = async function (dadosEvento) {
    let sql = `call procUpdateEventoSemanal(
        ${dadosEvento.id}, 
        '${dadosEvento.nome}', 
        '${dadosEvento.descricao}', 
        '${dadosEvento.local}', 
        '${dadosEvento.hora}', 
        ${dadosEvento.id_paciente_cuidador}, 
        1, 
        1, 
        ${dadosEvento.sabado}, 
        2, 
        2, 
        ${dadosEvento.segunda}, 
        3, 
        3, 
        ${dadosEvento.terca}, 
        4, 
        4, 
        ${dadosEvento.quarta}, 
        5, 
        5, 
        ${dadosEvento.quinta}, 
        6, 
        6, 
        ${dadosEvento.sexta}, 
        7, 
        7, 
        ${dadosEvento.domingo}
    );`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
} 

/************************** Deletes ******************************/
const deleteEvento = async function (idCuidador) {
    let sql = `delete from tbl_cuidador where id = ${idCuidador}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

module.exports = {
    deleteEvento,
    insertEvento,
    selectEventoById,
    selectLastId,
    updateEvento
}
