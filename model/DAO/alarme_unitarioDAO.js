/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Alarmes no Banco de Dados.
 * Data: 08/11/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');
const moment = require("moment");

//Instância da classe PrismaClient
var prisma = new PrismaClient()

const selectAllAlarmes = async function (idPaciente) {
    let sql = `select tbl_alarme_unitario_status.id as id_alarme_unitario,
					  tbl_medicamento.id as id_medicamento,
                      tbl_medicamento.nome as medicamento,
                      tbl_alarme_medicamento.id as id_alarme, date_format(tbl_alarme_medicamento.dia, '%d/%m/%y') as data_criacao, tbl_alarme_medicamento.intervalo as intervalo, time_format(tbl_alarme_unitario_status.horario, '%h:%i') as horario_inicial, tbl_alarme_unitario_status.quantidade as quantidade_retirada,
                      tbl_medida.id as id_medida, tbl_medida.tipo as medida, tbl_medida.sigla as medida_sigla,
                      tbl_status_alarme.nome as status,
                      tbl_paciente.id as id_paciente,
                      tbl_paciente.nome as paciente
    from tbl_alarme_unitario_status
        inner join tbl_status_alarme
    on tbl_status_alarme.id = tbl_alarme_unitario_status.id_status_alarme
        inner join tbl_alarme_medicamento
    on tbl_alarme_medicamento.id = tbl_alarme_unitario_status.id_alarme_medicamento
        inner join tbl_medicamento
    on tbl_alarme_medicamento.id_medicamento = tbl_medicamento.id
		inner join tbl_paciente
	on tbl_paciente.id = tbl_medicamento.id_paciente
        inner join tbl_medida
    on tbl_medida.id = tbl_medicamento.id_medida`

    let rsAlarme = await prisma.$queryRawUnsafe(sql)

    if (rsAlarme.length > 0) {
        return rsAlarme
    } else {
        return false
    }
}

/******************Select pelo ID do paciente************************ */
const selectAlarmeByIdPaciente = async function (idPaciente) {
    let sql = `select tbl_alarme_unitario_status.id as id_alarme_unitario,
					  tbl_medicamento.id as id_medicamento,
                      tbl_medicamento.nome as medicamento,
                      tbl_alarme_medicamento.id as id_alarme, date_format(tbl_alarme_medicamento.dia, '%d/%m/%y') as data_criacao, tbl_alarme_medicamento.intervalo as intervalo, time_format(tbl_alarme_unitario_status.horario, '%h:%i') as horario_inicial, tbl_alarme_unitario_status.quantidade as quantidade_retirada,
                      tbl_medida.id as id_medida, tbl_medida.tipo as medida, tbl_medida.sigla as medida_sigla,
                      tbl_status_alarme.nome as status,
                      tbl_paciente.id as id_paciente,
                      tbl_paciente.nome as paciente
    from tbl_alarme_unitario_status
        inner join tbl_status_alarme
    on tbl_status_alarme.id = tbl_alarme_unitario_status.id_status_alarme
        inner join tbl_alarme_medicamento
    on tbl_alarme_medicamento.id = tbl_alarme_unitario_status.id_alarme_medicamento
        inner join tbl_medicamento
    on tbl_alarme_medicamento.id_medicamento = tbl_medicamento.id
		inner join tbl_paciente
	on tbl_paciente.id = tbl_medicamento.id_paciente
        inner join tbl_medida
    on tbl_medida.id = tbl_medicamento.id_medida
    where tbl_paciente.id = ${idPaciente};`

    let rsAlarme = await prisma.$queryRawUnsafe(sql)

    if (rsAlarme.length > 0) {
        return rsAlarme
    } else {
        return false
    }
}

/******************Select pelo ID************************ */

const selectAlarmeById = async function (idAlarme) {
    let sql = `select tbl_alarme_unitario_status.id as id_alarme_unitario,
					  tbl_medicamento.id as id_medicamento,
                      tbl_medicamento.nome as medicamento,
                      tbl_alarme_medicamento.id as id_alarme, DATE_FORMAT(tbl_alarme_medicamento.dia, '%d/%m/%Y') as data_criacao, tbl_alarme_medicamento.intervalo as intervalo, TIME_FORMAT(tbl_alarme_unitario_status.horario, '%H:%i') as horario_inicial, tbl_alarme_unitario_status.quantidade as quantidade_retirada,
                      tbl_medida.id as id_medida, tbl_medida.tipo as medida, tbl_medida.sigla as medida_sigla,
                      tbl_status_alarme.nome as status,
                      tbl_paciente.id as id_paciente,
                      tbl_paciente.nome as paciente
    from tbl_alarme_unitario_status
        inner join tbl_status_alarme
    on tbl_status_alarme.id = tbl_alarme_unitario_status.id_status_alarme
        inner join tbl_alarme_medicamento
    on tbl_alarme_medicamento.id = tbl_alarme_unitario_status.id_alarme_medicamento
        inner join tbl_medicamento
    on tbl_alarme_medicamento.id_medicamento = tbl_medicamento.id
		inner join tbl_paciente
	on tbl_paciente.id = tbl_medicamento.id_paciente
        inner join tbl_medida
    on tbl_medida.id = tbl_medicamento.id_medida
    where tbl_alarme_unitario_status.id = ${idAlarme}`

    let rsAlarme = await prisma.$queryRawUnsafe(sql)

    if (rsAlarme.length > 0) {
        return rsAlarme[0]
    } else {
        return false
    }
}

const selectAlarmeByIdMedicamento = async function (idMedicamento) {
    let sql = `select tbl_alarme_unitario_status.id as id_alarme_unitario,
					  tbl_medicamento.id as id_medicamento,
                      tbl_medicamento.nome as medicamento,
                      tbl_alarme_medicamento.id as id_alarme, date_format(tbl_alarme_medicamento.dia, '%d/%m/%y') as data_criacao, tbl_alarme_medicamento.intervalo as intervalo, time_format(tbl_alarme_unitario_status.horario, '%h:%i') as horario_inicial, tbl_alarme_unitario_status.quantidade as quantidade_retirada,
                      tbl_medida.id as id_medida, tbl_medida.tipo as medida, tbl_medida.sigla as medida_sigla,
                      tbl_status_alarme.nome as status,
                      tbl_paciente.id as id_paciente,
                      tbl_paciente.nome as paciente
    from tbl_alarme_unitario_status
        inner join tbl_status_alarme
    on tbl_status_alarme.id = tbl_alarme_unitario_status.id_status_alarme
        inner join tbl_alarme_medicamento
    on tbl_alarme_medicamento.id = tbl_alarme_unitario_status.id_alarme_medicamento
        inner join tbl_medicamento
    on tbl_alarme_medicamento.id_medicamento = tbl_medicamento.id
		inner join tbl_paciente
	on tbl_paciente.id = tbl_medicamento.id_paciente
        inner join tbl_medida
    on tbl_medida.id = tbl_medicamento.id_medida
    where tbl_medicamento.id = ${idMedicamento}`

    let rsAlarme = await prisma.$queryRawUnsafe(sql)

    if (rsAlarme.length > 0) {
        return rsAlarme
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = `select tbl_alarme_unitario_status.id as id_alarme_unitario,
					  tbl_medicamento.id as id_medicamento,
                      tbl_medicamento.nome as medicamento,
                      tbl_alarme_medicamento.id as id_alarme, date_format(tbl_alarme_unitario_status.dia, '%d/%m/%Y') as data_criacao, tbl_alarme_medicamento.intervalo as intervalo, time_format(tbl_alarme_unitario_status.horario, '%H:%i') as horario_inicial, tbl_alarme_unitario_status.quantidade as quantidade_retirada,
                      tbl_medida.id as id_medida, tbl_medida.tipo as medida, tbl_medida.sigla as medida_sigla,
                      tbl_status_alarme.nome as status,
                      tbl_paciente.id as id_paciente,
                      tbl_paciente.nome as paciente
    from tbl_alarme_unitario_status
        inner join tbl_status_alarme
    on tbl_status_alarme.id = tbl_alarme_unitario_status.id_status_alarme
        inner join tbl_alarme_medicamento
    on tbl_alarme_medicamento.id = tbl_alarme_unitario_status.id_alarme_medicamento
        inner join tbl_medicamento
    on tbl_alarme_medicamento.id_medicamento = tbl_medicamento.id
		inner join tbl_paciente
	on tbl_paciente.id = tbl_medicamento.id_paciente
        inner join tbl_medida
    on tbl_medida.id = tbl_medicamento.id_medida
    order by tbl_alarme_unitario_status.id desc limit 1;`

    let rsAlarme = await prisma.$queryRawUnsafe(sql)

    if (rsAlarme.length > 0) {
        return rsAlarme[0]
    } else {
        return false
    }
}

/***********************Inserte***************************** */

const insertAlarme = async function (dadosAlarme) {

    let sql = `insert into tbl_alarme_unitario_status(
        dia,
        horario,
        id_status_alarme,
        quantidade,
        id_alarme_medicamento
    ) values(
        CURRENT_DATE,
        CURRENT_TIME,
        3,
        '${dadosAlarme.quantidade}',
        ${dadosAlarme.id_alarme_medicamento}
    )`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

/****************** Updates  *********************************** */

const updateAlarme = async function (dadosAlarme) {

    let sql = `update tbl_alarme_unitario_status set 
            id_status_alarme  = '${dadosAlarme.id_status_alarme}'
        where id = ${dadosAlarme.id}`
    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }

}


module.exports = {
    insertAlarme,
    selectAlarmeById,
    selectAlarmeByIdPaciente,
    updateAlarme,
    selectLastId,
    selectAlarmeByIdMedicamento,
    selectAllAlarmes
}