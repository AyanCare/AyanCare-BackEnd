/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos HISTORICOS no Banco de Dados.
 * Data: 20/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')
const jwt = require('../middleware/middlewareJWT.js')

const historicoDAO = require('../model/DAO/historico_medicoDAO.js')

const getHistoricos = async function () {
    let dadosHistoricosJSON = {}

    let dadosHistoricos = await historicoDAO.selectAllHistoricos()

    if (dadosHistoricos) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosHistoricosJSON.status = messages.SUCCESS_REQUEST.status
        dadosHistoricosJSON.quantidade = dadosHistoricos.length
        dadosHistoricosJSON.historicos = dadosHistoricos
        return dadosHistoricosJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getHistoricoByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosHistoricoJSON = {};

        let dadosHistorico = await historicoDAO.selectHistoricoById(id)

        if (dadosHistorico) {
            dadosHistoricoJSON.status = messages.SUCCESS_REQUEST.status
            dadosHistoricoJSON.historico = dadosHistorico
            return dadosHistoricoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getHistoricoByPaciente = async function (idPaciente) {
    if (idPaciente == '' || idPaciente == undefined || isNaN(idPaciente)) {
        return messages.ERROR_INVALID_ID
    } else {
        let dadosHistoricoJSON = {};

        let rsHistorico = await historicoDAO.selectHistoricoByPaciente(idPaciente)

        if (rsHistorico) {
            dadosHistoricoJSON.status = messages.SUCCESS_REQUEST.status
            dadosHistoricoJSON.historico = rsHistorico
            return dadosHistoricoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const insertHistorico = async function (dadosHistorico) {
    if (
        dadosHistorico.historico_medico == '' || dadosHistorico.historico_medico == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let resultDadosHistorico = await historicoDAO.insertHistorico(dadosHistorico)

        if (resultDadosHistorico) {
            let novoHistorico = await historicoDAO.selectLastId()

            let dadosHistoricoJSON = {}
            dadosHistoricoJSON.status = messages.SUCCESS_CREATED_ITEM.status
            dadosHistoricoJSON.historico = novoHistorico

            return dadosHistoricoJSON
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const updateHistorico = async function (dadosHistorico, id) {
    if (
        dadosHistorico.historico_medico == '' || dadosHistorico.historico_medico == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        dadosHistorico.id = id

        let atualizacaoHistorico = await historicoDAO.selectHistoricoById(id)

        if (atualizacaoHistorico) {
            let resultDadosHistorico = await historicoDAO.updateHistorico(dadosHistorico)

            if (resultDadosHistorico) {
                let dadosHistoricoJSON = {}
                dadosHistoricoJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosHistoricoJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosHistoricoJSON.historico = dadosHistorico

                return dadosHistoricoJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const deleteHistorico = async function (id) {
    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdHistorico = await historicoDAO.selectHistoricoById(id)

        if (searchIdHistorico) {
            let dadosHistorico = await historicoDAO.deleteHistorico(id)

            if (dadosHistorico) {
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
    getHistoricos,
    insertHistorico,
    updateHistorico,
    deleteHistorico,
    getHistoricoByID,
    getHistoricoByPaciente
}