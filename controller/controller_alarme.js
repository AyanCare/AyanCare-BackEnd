/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos ALARMES no Banco de Dados.
 * Data: 29/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

const alarmeDAO = require('../model/DAO/alarmeDAO.js')

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

const getAlarmeByID = async function (id) {
    if (id === '' || isNaN(id) || id === undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosAlarmeJSON = {};

        let dadosAlarme = await alarmeDAO.selectAlarmeById(id)

        if (dadosAlarme) {
            dadosAlarmeJSON.status = messages.SUCCESS_REQUEST.status
            dadosAlarmeJSON.alarme = dadosAlarme
            return dadosAlarmeJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getAlarmesByPaciente = async function (idPaciente){
    if(idPaciente === '' || idPaciente === undefined || isNaN(idPaciente)){
        return messages.ERROR_INVALID_ID
    } else {
        let dadosAlarmeJSON = {};

        let dadosAlarme = await alarmeDAO.selectAlarmeByPaciente(idPaciente)

        if (dadosAlarme) {
            dadosAlarmeJSON.status = messages.SUCCESS_REQUEST.status
            dadosAlarmeJSON.alarme = dadosAlarme
            return dadosAlarmeJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

// '${dadosAlarme.nome}'
// '${dadosAlarme.quantidade}',
// '${dadosAlarme.data_validade}',
// '${dadosAlarme.estocado}',
// ${dadosAlarme.id_paciente},
// ${dadosAlarme.id_medida}

const insertAlarme = async function (dadosAlarme) {

    if (
        dadosAlarme.dia === '' || dadosAlarme.dia === undefined ||
        dadosAlarme.intervalo === '' || dadosAlarme.intervalo === undefined ||
        dadosAlarme.horario === '' || dadosAlarme.horario === undefined || 
        dadosAlarme.id_medicamento === '' || dadosAlarme.id_medicamento === undefined || isNaN(dadosAlarme.id_medicamento)
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

const updateAlarme = async function (dadosAlarme, id) {
    if (
        dadosAlarme.dia === '' || dadosAlarme.dia === undefined ||
        dadosAlarme.intervalo === '' || dadosAlarme.intervalo === undefined ||
        dadosAlarme.horario === '' || dadosAlarme.horario === undefined ||
        dadosAlarme.id_medicamento === '' || dadosAlarme.id_medicamento === undefined || isNaN(dadosAlarme.id_medicamento)
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id === null || id === undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        dadosAlarme.id = id

        let atualizacaoAlarme = await alarmeDAO.selectAlarmeById(id)

        if (atualizacaoAlarme) {
            let resultDadosAlarme = await alarmeDAO.updateAlarme(dadosAlarme)

            if (resultDadosAlarme) {
                let dadosAlarmeJSON = {}
                dadosAlarmeJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosAlarmeJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosAlarmeJSON.alarme = dadosAlarme

                return dadosAlarmeJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const deleteAlarme = async function (id) {

    if (id === null || id === undefined || id === '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdAlarme = await alarmeDAO.selectAlarmeById(id)

        if (searchIdAlarme) {
            let dadosAlarme = await alarmeDAO.deleteAlarme(id)

            if (dadosAlarme) {
                return messages.SUCCESS_DELETED_ITEM
            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else{
            return messages.ERROR_INVALID_ID
        }


    }

}

module.exports = {
    getAlarmes,
    insertAlarme,
    updateAlarme,
    deleteAlarme,
    getAlarmeByID,
    getAlarmesByPaciente
}