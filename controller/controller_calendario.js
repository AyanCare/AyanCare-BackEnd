/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados enviados ao calendario no Banco de Dados.
 * Data: 10/11/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

const calendarioDAO = require('../model/DAO/calendarioDAO.js')

const getEventosAndAlarmesByPaciente = async function (dadosCalendario) {
    if (
        dadosCalendario.dia == '' || dadosCalendario.dia == undefined ||
        dadosCalendario.dia_semana == '' || dadosCalendario.dia_semana == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (
        dadosCalendario.id_paciente == '' || dadosCalendario.id_paciente == undefined || isNaN(dadosCalendario.id_paciente)
    ) {
        return messages.ERROR_INVALID_PACIENTE
    } else {
        let dadosCalendarioJSON = {};

        let resultCalendario = await calendarioDAO.selectAllEventosAndAlarmesByPacienteDiary(dadosCalendario)
        if (resultCalendario) {
            dadosCalendarioJSON.status = messages.SUCCESS_REQUEST.status
            dadosCalendarioJSON.calendario = resultCalendario
            return dadosCalendarioJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getEventosAndAlarmesByCuidadorAndPaciente = async function (dadosCalendario) {
    if (
        dadosCalendario.dia == '' || dadosCalendario.dia == undefined ||
        dadosCalendario.dia_semana == '' || dadosCalendario.dia_semana == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (
        dadosCalendario.id_paciente == '' || dadosCalendario.id_paciente == undefined || isNaN(dadosCalendario.id_paciente)
    ) {
        return messages.ERROR_INVALID_PACIENTE
    } else if (
        dadosCalendario.id_cuidador == '' || dadosCalendario.id_cuidador == undefined || isNaN(dadosCalendario.id_cuidador)
    ) {
        return messages.ERROR_INVALID_CUIDADOR
    } else {
        let dadosCalendarioJSON = {};

        let resultCalendario = await calendarioDAO.selectAllEventosAndAlarmesByCuidadorDiary(dadosCalendario)

        if (resultCalendario) {
            dadosCalendarioJSON.status = messages.SUCCESS_REQUEST.status
            dadosCalendarioJSON.calendario = resultCalendario
            return dadosCalendarioJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getEventosByPaciente = async function (dadosCalendario) {
    if (
        dadosCalendario.mes == '' || dadosCalendario.mes == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (
        dadosCalendario.id_paciente == '' || dadosCalendario.id_paciente == undefined || isNaN(dadosCalendario.id_paciente)
    ) {
        return messages.ERROR_INVALID_PACIENTE
    } else {
        let dadosCalendarioJSON = {};

        let resultCalendario = await calendarioDAO.selectAllEventosByPacienteMonthly(dadosCalendario)
        if (resultCalendario) {
            dadosCalendarioJSON.status = messages.SUCCESS_REQUEST.status
            dadosCalendarioJSON.calendario = resultCalendario
            return dadosCalendarioJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

module.exports = {
    getEventosAndAlarmesByPaciente,
    getEventosAndAlarmesByCuidadorAndPaciente,
    getEventosByPaciente
}