/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos EVENTOS ÚNICOS no Banco de Dados.
 * Data: 05/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()



/************************** Selects ******************************/

const selectAllEventos = async function () {
    let sql = `select tbl_evento_unitario.id as id,
    tbl_paciente.nome as paciente,
    tbl_cuidador.nome as cuidador,
    tbl_evento_unitario.nome as nome, tbl_evento_unitario.descricao as descricao, tbl_evento_unitario.local as local, time_format(tbl_evento_unitario.horario, '%T') as horario, DATE_FORMAT(tbl_evento_unitario.dia,'%d/%m/%Y') as dia, DATE_FORMAT(tbl_evento_unitario.dia,'%d') as dia_unico, DATE_FORMAT(tbl_evento_unitario.dia,'%m') as mes,
    tbl_cor.hex as cor
from tbl_evento_unitario
    left join tbl_paciente_evento_unitario
on tbl_evento_unitario.id = tbl_paciente_evento_unitario.id_evento_unitario
    left join tbl_cuidador_evento_unitario
on tbl_evento_unitario.id = tbl_cuidador_evento_unitario.id_evento_unitario
    left join tbl_paciente
on tbl_paciente_evento_unitario.id_paciente = tbl_paciente.id
    left join tbl_cuidador
on tbl_cuidador.id = tbl_cuidador_evento_unitario.id_cuidador
    inner join tbl_cor
on tbl_cor.id = tbl_evento_unitario.id_cor`

    let rsEvento = await prisma.$queryRawUnsafe(sql)

    if (rsEvento.length > 0) {
        return rsEvento
    } else {
        return false
    }
}

const selectEventoById = async function (idEvento) {
    let sql = `select tbl_evento_unitario.id as id,
    tbl_paciente.nome as paciente,
    tbl_cuidador.nome as cuidador,
    tbl_evento_unitario.nome as nome, tbl_evento_unitario.descricao as descricao, tbl_evento_unitario.local as local, time_format(tbl_evento_unitario.horario, '%T') as horario, DATE_FORMAT(tbl_evento_unitario.dia,'%d/%m/%Y') as dia, DATE_FORMAT(tbl_evento_unitario.dia,'%d') as dia_unico, DATE_FORMAT(tbl_evento_unitario.dia,'%m') as mes,
    tbl_cor.hex as cor
from tbl_evento_unitario
    left join tbl_paciente_evento_unitario
on tbl_evento_unitario.id = tbl_paciente_evento_unitario.id_evento_unitario
    left join tbl_cuidador_evento_unitario
on tbl_evento_unitario.id = tbl_cuidador_evento_unitario.id_evento_unitario
    left join tbl_paciente
on tbl_paciente_evento_unitario.id_paciente = tbl_paciente.id
    left join tbl_cuidador
on tbl_cuidador.id = tbl_cuidador_evento_unitario.id_cuidador
    inner join tbl_cor
on tbl_cor.id = tbl_evento_unitario.id_cor
    where tbl_evento_unitario.id = ${idEvento}`

    let rsEvento = await prisma.$queryRawUnsafe(sql)

    if (rsEvento.length > 0) {
        return rsEvento[0]
    } else {
        return false
    }
}

const selectEventoByCuidador = async function (idCuidador) {
    let sql = `select tbl_evento_unitario.id as id,
    tbl_paciente.nome as paciente,
    tbl_cuidador.nome as cuidador,
    tbl_evento_unitario.nome as nome, tbl_evento_unitario.descricao as descricao, tbl_evento_unitario.local as local, time_format(tbl_evento_unitario.horario, '%T') as horario, DATE_FORMAT(tbl_evento_unitario.dia,'%d/%m/%Y') as dia, DATE_FORMAT(tbl_evento_unitario.dia,'%d') as dia_unico, DATE_FORMAT(tbl_evento_unitario.dia,'%m') as mes,
    tbl_cor.hex as cor
from tbl_evento_unitario
    left join tbl_paciente_evento_unitario
on tbl_evento_unitario.id = tbl_paciente_evento_unitario.id_evento_unitario
    left join tbl_cuidador_evento_unitario
on tbl_evento_unitario.id = tbl_cuidador_evento_unitario.id_evento_unitario
    left join tbl_paciente
on tbl_paciente_evento_unitario.id_paciente = tbl_paciente.id
    left join tbl_cuidador
on tbl_cuidador.id = tbl_cuidador_evento_unitario.id_cuidador
    inner join tbl_cor
on tbl_cor.id = tbl_evento_unitario.id_cor
    where tbl_cuidador.id = ${idCuidador}`

    let rsEvento = await prisma.$queryRawUnsafe(sql)

    if (rsEvento.length > 0) {
        return rsEvento
    } else {
        return false
    }
}

const selectEventoByPaciente = async function (idPaciente) {
    let sql = `select tbl_evento_unitario.id as id,
    tbl_paciente.nome as paciente,
    tbl_cuidador.nome as cuidador,
    tbl_evento_unitario.nome as nome, tbl_evento_unitario.descricao as descricao, tbl_evento_unitario.local as local, time_format(tbl_evento_unitario.horario, '%T') as horario, DATE_FORMAT(tbl_evento_unitario.dia,'%d/%m/%Y') as dia, DATE_FORMAT(tbl_evento_unitario.dia,'%d') as dia_unico, DATE_FORMAT(tbl_evento_unitario.dia,'%m') as mes,
    tbl_cor.hex as cor
from tbl_evento_unitario
    left join tbl_paciente_evento_unitario
on tbl_evento_unitario.id = tbl_paciente_evento_unitario.id_evento_unitario
    left join tbl_cuidador_evento_unitario
on tbl_evento_unitario.id = tbl_cuidador_evento_unitario.id_evento_unitario
    left join tbl_paciente
on tbl_paciente_evento_unitario.id_paciente = tbl_paciente.id
    left join tbl_cuidador
on tbl_cuidador.id = tbl_cuidador_evento_unitario.id_cuidador
    inner join tbl_cor
on tbl_cor.id = tbl_evento_unitario.id_cor
    where tbl_paciente.id = ${idPaciente}`

    let rsEvento = await prisma.$queryRawUnsafe(sql)

    if (rsEvento.length > 0) {
        return rsEvento
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = `select tbl_evento_unitario.id as id,
        tbl_paciente.nome as paciente,
        tbl_cuidador.nome as cuidador,
        tbl_evento_unitario.nome as nome, tbl_evento_unitario.descricao as descricao, tbl_evento_unitario.local as local, time_format(tbl_evento_unitario.horario, '%T') as horario, DATE_FORMAT(tbl_evento_unitario.dia,'%d/%m/%Y') as dia
    from tbl_evento_unitario
        left join tbl_paciente_evento_unitario
    on tbl_evento_unitario.id = tbl_paciente_evento_unitario.id_evento_unitario
        left join tbl_cuidador_evento_unitario
    on tbl_evento_unitario.id = tbl_cuidador_evento_unitario.id_evento_unitario
        left join tbl_paciente
    on tbl_paciente_evento_unitario.id_paciente = tbl_paciente.id
        left join tbl_cuidador
    on tbl_cuidador.id = tbl_cuidador_evento_unitario.id_cuidador
    order by tbl_evento_unitario.id desc limit 1`

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
    let sql = `insert into tbl_evento_unitario(
        nome,
        descricao,
        local,
        dia,
        horario,
        id_cor
    ) values (
        '${dadosEvento.nome}',
        '${dadosEvento.descricao}',
        '${dadosEvento.local}',
        '${dadosEvento.dia}',
        '${dadosEvento.hora}',
        ${dadosEvento.id_cor}
    )`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const insertPacienteIntoEvento = async function (idPaciente, idEvento){
    let sql = `insert into tbl_paciente_evento_unitario(
        id_paciente,
        id_evento_unitario
    ) values (
        ${idPaciente},
        ${idEvento}
    )`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    } else {
        return false
    }
}

const insertCuidadorIntoEvento = async function (idCuidador, idEvento){
    let sql = `insert into tbl_cuidador_evento_unitario(
        id_cuidador,
        id_evento_unitario
    ) values (
        ${idCuidador},
        ${idEvento}
    )`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    } else {
        return false
    }
}

/************************** Updates ******************************/
const updateEvento = async function (dadosEvento) {
    let sql = `update tbl_evento_unitario set
            nome = '${dadosEvento.nome}',
            descricao = '${dadosEvento.descricao}',
            local = '${dadosEvento.local}',
            dia = '${dadosEvento.dia}',
            horario = '${dadosEvento.hora}'
        where id = ${dadosEvento.id}
    `

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

/************************** Deletes ******************************/
const deleteEvento = async function (idEvento) {
    let sql = `delete from tbl_evento_unitario where id = ${idEvento}`

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
    updateEvento,
    selectEventoByPaciente,
    selectEventoByCuidador,
    selectAllEventos,
    insertCuidadorIntoEvento,
    insertPacienteIntoEvento
}
