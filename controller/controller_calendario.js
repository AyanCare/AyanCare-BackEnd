/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados enviados ao calendario no Banco de Dados.
 * Data: 10/11/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

const calendarioDAO = require('../model/DAO/calendarioDAO.js')

function formatarMesAno(mes) {
    let [mesF, ano] = mes.split('/');
    return `${ano}-${mesF.padStart(2, '0')}`;
}

function converterData(ano) {
    console.log(ano);
    let [dia, mes, anoF] = ano.split('/');
    return `${anoF}-${mes.padStart(2, '0')}-${dia.padStart(2, '0')}`;
}

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
        dadosCalendario.dia = converterData(dadosCalendario.dia)

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

const getEventosAndAlarmesByCuidador = async function (dadosCalendario) {
    if (
        dadosCalendario.dia == '' || dadosCalendario.dia == undefined ||
        dadosCalendario.dia_semana == '' || dadosCalendario.dia_semana == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (
        dadosCalendario.id_cuidador == '' || dadosCalendario.id_cuidador == undefined || isNaN(dadosCalendario.id_cuidador)
    ) {
        return messages.ERROR_INVALID_CUIDADOR
    } else {
        dadosCalendario.dia = converterData(dadosCalendario.dia)

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
        dadosCalendario.dia = converterData(dadosCalendario.dia)

        let dadosCalendarioJSON = {};

        let resultCalendario = await calendarioDAO.selectAllEventosAndAlarmesByCuidadorAndPacienteDiary(dadosCalendario)

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
        dadosCalendario.mes = formatarMesAno(dadosCalendario.mes)

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

const getEventosByCuidador = async function (dadosCalendario) {
    if (
        dadosCalendario.mes == '' || dadosCalendario.mes == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (
        dadosCalendario.id_cuidador == '' || dadosCalendario.id_cuidador == undefined || isNaN(dadosCalendario.id_cuidador)
    ) {
        return messages.ERROR_INVALID_CUIDADOR
    } else {
        dadosCalendario.mes = formatarMesAno(dadosCalendario.mes)

        let dadosCalendarioJSON = {};

        let resultCalendario = await calendarioDAO.selectAllEventosByCuidadorMonthly(dadosCalendario)
        if (resultCalendario) {
            dadosCalendarioJSON.status = messages.SUCCESS_REQUEST.status
            dadosCalendarioJSON.calendario = resultCalendario
            return dadosCalendarioJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getEventosByCuidadorAndPaciente = async function (dadosCalendario) {
    if (
        dadosCalendario.mes == '' || dadosCalendario.mes == undefined
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
        dadosCalendario.mes = formatarMesAno(dadosCalendario.mes)

        let dadosCalendarioJSON = {};

        let resultCalendario = await calendarioDAO.selectAllEventosByCuidadorAndPacienteMonthly(dadosCalendario)
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
    getEventosByPaciente,
    getEventosByCuidadorAndPaciente,
    getEventosAndAlarmesByCuidador,
    getEventosByCuidador
}