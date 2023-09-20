/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos HORARIOS no Banco de Dados.
 * Data: 20/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

const horaDAO = require('../model/DAO/horaDAO.js')

const getHorarios = async function () {
    let dadosHorariosJSON = {}

    let dadosHorarios = await horaDAO.selectAllHorarios()

    if (dadosHorarios) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosHorariosJSON.status = messages.SUCCESS_REQUEST.status
        dadosHorariosJSON.quantidade = dadosHorarios.length
        dadosHorariosJSON.horarios = dadosHorarios
        return dadosHorariosJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getHorarioByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosHorarioJSON = {};

        let dadosHorario = await horaDAO.selectHorarioById(id)

        if (dadosHorario) {
            dadosHorarioJSON.status = messages.SUCCESS_REQUEST.status
            dadosHorarioJSON.horario = dadosHorario
            return dadosHorarioJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const insertHorario = async function (dadosHorario) {

    if (
        dadosHorario.hora == '' || dadosHorario.hora == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let resultDadosHorario = await horaDAO.insertHorario(dadosHorario)

        if (resultDadosHorario) {
            let novoHorario = await horaDAO.selectLastId()

            let dadosHorarioJSON = {}
            dadosHorarioJSON.status = messages.SUCCESS_CREATED_ITEM.status
            dadosHorarioJSON.horario = novoHorario

            return dadosHorarioJSON
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const updateHorario = async function (dadosHorario, id) {
    if (
        dadosHorario.hora == '' || dadosHorario.hora == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        dadosHorario.id = id

        let atualizacaoHorario = await horaDAO.selectHorarioById(id)

        if (atualizacaoHorario) {
            let resultDadosHorario = await horaDAO.updateHorario(dadosHorario)

            if (resultDadosHorario) {
                let dadosHorarioJSON = {}
                dadosHorarioJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosHorarioJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosHorarioJSON.horario = dadosHorario

                return dadosHorarioJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const deleteHorario = async function (id) {

    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdHorario = await horaDAO.selectHorarioById(id)

        if (searchIdHorario) {
            let dadosHorario = await horaDAO.deleteHorario(id)

            if (dadosHorario) {
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
    getHorarios,
    insertHorario,
    updateHorario,
    deleteHorario,
    getHorarioByID
}