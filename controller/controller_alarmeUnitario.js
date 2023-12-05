/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Alarmes no Banco de Dados.
 * Data: 27/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/


//Importe de arquivo 
const messages = require('./modules/config.js')
const alarmeDAO = require('../model/DAO/alarme_unitarioDAO.js');

const getAlarmes = async function () {
    let dadosAlarmesJSON = {}

    let dadosAlarmes = await alarmeDAO.selectAllAlarmes()

    if (dadosAlarmes) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosAlarmesJSON.status = messages.SUCCESS_REQUEST.status
        dadosAlarmesJSON.quantidade = dadosAlarmes.length
        dadosAlarmesJSON.alarmes = dadosAlarmes
        return dadosAlarmesJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }
}

const getAlarmeById = async function (idAlarme) {

    let dadosAlarmeJSON = {};

    let dadosAlarmes = await alarmeDAO.selectAlarmeById(idAlarme)

    if (dadosAlarmes) {

        dadosAlarmeJSON.status = messages.SUCCESS_REQUEST.status
        dadosAlarmeJSON.quantidade = dadosAlarmes.length
        dadosAlarmeJSON.alarmes = dadosAlarmes
        return dadosAlarmeJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }
}


/******************GET**************************************** */

const getAlarmeByIdPaciente = async function (idPaciente) {
    if (idPaciente == '' || isNaN(idPaciente) || idPaciente == undefined) {
        return messages.ERROR_INVALID_ID
    } else {
        let dadosAlarme = await alarmeDAO.selectAlarmeByIdPaciente(idPaciente)
        let dadosAlarmeJSON = {}

        if (dadosAlarme) {
            dadosAlarmeJSON.status = messages.SUCCESS_REQUEST.status
            dadosAlarmeJSON.quantidade = dadosAlarme.length
            dadosAlarmeJSON.alarme = dadosAlarme

            return dadosAlarmeJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getAlarmeByIdMedicamento = async function (idMedicamento) {

    if (idMedicamento == '' || idMedicamento == undefined) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let resultDadosAlarmePaciente = await alarmeDAO.selectAlarmeByIdMedicamento(idMedicamento)
        let dadosAlarmeJSON = {}

        if (resultDadosAlarmePaciente) {
            dadosAlarmeJSON.status = messages.SUCCESS_REQUEST.status
            dadosAlarmeJSON.quantidade = resultDadosAlarmePaciente.length
            dadosAlarmeJSON.alarmes = resultDadosAlarmePaciente

            return dadosAlarmeJSON
        } else {
            let erro = messages.ERROR_NOT_FOUND
            erro.alarme = []

            return erro
        }

    }
}


/******************Insert**************************************** */
const insertAlarme = async function (dadosAlarme) {

    console.log(dadosAlarme);

    if (
        dadosAlarme.quantidade == undefined || dadosAlarme.quantidade == '' || isNaN(dadosAlarme.quantidade) ||
        dadosAlarme.id_alarme_medicamento == '' || dadosAlarme.id_alarme_medicamento == undefined || isNaN(dadosAlarme.id_alarme_medicamento)
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let resultDadosAlarme = await alarmeDAO.insertAlarme(dadosAlarme)

        if (resultDadosAlarme) {
            let novoAlarme = await alarmeDAO.selectLastId()

            let dadosAlarmeJSON = {}

            dadosAlarmeJSON.status = messages.SUCCESS_CREATED_ITEM.status
            dadosAlarmeJSON.alarme = novoAlarme

            return dadosAlarmeJSON
        } else {
            return messages.ERROR_INTERNAL_SERVER

        }
    }
}

/******************UpdateAlarme**************************** */

const updateAlarme = async function (dadosAlarme) {

    if (
        dadosAlarme.id_status_alarme == undefined || dadosAlarme.id_status_alarme == '' || isNaN(dadosAlarme.id_status_alarme)
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (dadosAlarme.id == null || dadosAlarme.id == undefined || isNaN(dadosAlarme.id)) {
        return messages.ERROR_INVALID_ID
    } else {
        let atualizacaoAlarme = await alarmeDAO.selectAlarmeById(dadosAlarme.id)

        if (atualizacaoAlarme) {

            let resultDadosAlarme = await alarmeDAO.updateAlarme(dadosAlarme)

            if (resultDadosAlarme) {
                let dadosAlarmeJSON = {}
                dadosAlarmeJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosAlarmeJSON.messages = messages.SUCCESS_UPDATED_ITEM

                return dadosAlarmeJSON
            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}


module.exports = {
    getAlarmeById,
    getAlarmeByIdMedicamento,
    getAlarmeByIdPaciente,
    insertAlarme,
    updateAlarme,
    getAlarmes
}
