/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Alarmes no Banco de Dados.
 * Data: 27/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/


//Importe de arquivo 
const message = require('./modules/config.js')

const alarmeDAO = require('../model/DAO/alarme_unitarioDAO.js');

/*******************Todos do Alarmes ****************************** */
const getAlarmeById = async function () {

    let dadosAlarmeJSON = {};

    let dadosAlarmes = await alarmeDAO.selectAllAlarmes()


    if (dadosAlarmes) {

        dadosAlarmeJSON.status = message.SUCCESS_REQUEST.status
        dadosAlarmeJSON.quantidade = dadosAlarmes.length
        dadosAlarmeJSON.alarmes = dadosAlarmes
        return dadosAlarmeJSON
    } else {
        return message.ERROR_INTERNAL_SERVER
    }
}


/******************GET**************************************** */

const getAlarmeByIdPaciente = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return message.ERROR_INVALID_ID
    } else {
        let dadosAlarme = await alarmeDAO.selectAlarmeById(id)
        let dadosAlarmeJSON = {}

        if (dadosAlarme) {
            dadosAlarmeJSON.status = message.SUCCESS_REQUEST.status
            dadosAlarmeJSON.quantidade = dadosAlarme.length
            dadosAlarmeJSON.alarme = dadosAlarme

            return dadosAlarmeJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    }
}

const getAlarmeByIdMedicamento = async function (id_paciente) {

    if (id_paciente == '' || id_paciente == undefined) {
        return message.ERROR_REQUIRED_FIELDS
    } else {
        let resultDadosAlarmePaciente = await alarmeDAO.selectAlarmeByIdPaciente(id_paciente)
        let dadosAlarmeJSON = {}

        if (resultDadosAlarmePaciente) {
            dadosAlarmeJSON.status = message.SUCCESS_REQUEST.status
            dadosAlarmeJSON.quantidade = resultDadosAlarmePaciente.length
            dadosAlarmeJSON.alarmes = resultDadosAlarmePaciente

            return dadosAlarmeJSON
        } else {
            let erro = message.ERROR_NOT_FOUND
            erro.alarme = []

            return erro
        }

    }
}


/******************Insert**************************************** */
const insertAlarme = async function (dadosAlarme) {

    if (
        dadosAlarme.quantidade == undefined || dadosAlarme.quantidade == '' || isNaN(dadosAlarme.quantidade) ||
        dadosAlarme.id_alarme_medicamento == '' || dadosAlarme.id_alarme_medicamento == undefined || isNaN(dadosAlarme.id_alarme_medicamento)
    ) {
        return message.ERROR_REQUIRED_FIELDS
    } else {
        let resultDadosAlarme = await alarmeDAO.insertAlarme(dadosAlarme)

        if (resultDadosAlarme) {
            let novoAlarme = await alarmeDAO.selectLastId()

            let dadosAlarmeJSON = {}

            dadosAlarmeJSON.status = message.SUCCESS_CREATED_ITEM.status
            dadosAlarmeJSON.alarme = novoAlarme

            return dadosAlarmeJSON
        } else {
            return message.ERROR_INTERNAL_SERVER

        }
    }
}

/******************UpdateAlarme**************************** */

const updateAlarme = async function (dadosAlarme) {

    if (
        dadosAlarme.id_status_alarme == undefined || dadosAlarme.id_status_alarme == '' || isNaN(dadosAlarme.id_status_alarme)
    ) {
        return message.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID
    } else {
        let atualizacaoAlarme = await alarmeDAO.selectAlarmeById(dadosAlarme.id)

        if (atualizacaoAlarme) {
            let resultDadosAlarme = await alarmeDAO.updateAlarme(dadosAlarme)

            if (resultDadosAlarme) {
                let dadosAlarmeJSON = {}
                dadosAlarmeJSON.status = message.SUCCESS_UPDATED_ITEM.status
                dadosAlarmeJSON.message = message.SUCCESS_UPDATED_ITEM.message
                dadosAlarmeJSON.alarme = dadosAlarme

                return dadosAlarmeJSON
            } else {
                return message.ERROR_INTERNAL_SERVER
            }
        } else {
            return message.ERROR_INVALID_ID
        }
    }
}


module.exports = {
    getAlarmeById,
    getAlarmeByIdMedicamento,
    getAlarmeByIdPaciente,
    insertAlarme,
    updateAlarme
}
