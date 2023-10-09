/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Eventos Recorrentes no Banco de Dados.
 * Data: 11/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')
const jwt = require('../middleware/middlewareJWT.js')

const evento_semanalDAO = require('../model/DAO/evento_semanalDAO.js')

const getAllEventos = async function(){
    let dadosEventoJSON = {};

        let dadosEvento = await evento_semanalDAO.selectAllEventos()

        if (dadosEvento) {
            dadosEventoJSON.status = messages.SUCCESS_REQUEST.status
            dadosEventoJSON.evento = dadosEvento
            return dadosEventoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
}

const getEventoByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosEventoJSON = {};

        let dadosEvento = await evento_semanalDAO.selectEventoById(id)

        if (dadosEvento) {
            dadosEventoJSON.status = messages.SUCCESS_REQUEST.status
            dadosEventoJSON.evento = dadosEvento
            return dadosEventoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getEventoByPaciente = async function (idPaciente) {
    if (idPaciente == '' || isNaN(idPaciente) || idPaciente == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosEventoJSON = {};

        let dadosEvento = await evento_semanalDAO.selectEventoByPaciente(idPaciente)

        if (dadosEvento) {
            dadosEventoJSON.status = messages.SUCCESS_REQUEST.status
            dadosEventoJSON.evento = dadosEvento
            return dadosEventoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getEventoByCuidador = async function (idCuidador) {
    if (idCuidador == '' || isNaN(idCuidador) || idCuidador == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosEventoJSON = {};

        let dadosEvento = await evento_semanalDAO.selectEventoByCuidador(idCuidador)

        if (dadosEvento) {
            dadosEventoJSON.status = messages.SUCCESS_REQUEST.status
            dadosEventoJSON.evento = dadosEvento
            return dadosEventoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

// '${dadosEvento.nome}',
//         '${dadosEvento.descricao}',
//         '${dadosEvento.local}',
//         '${dadosEvento.hora}',
//         ${dadosEvento.id_paciente_cuidador},
//         1,
//         ${dadosEvento.domingo},
//         2,
//         ${dadosEvento.segunda},
//         3,
//         ${dadosEvento.terca},
//         4,
//         ${dadosEvento.quarta},
//         5,
//         ${dadosEvento.quinta},
//         6,
//         ${dadosEvento.sexta},
//         7,
//         ${dadosEvento.domingo}

const insertEvento = async function (dadosEvento) {

    if (
        dadosEvento.nome == '' || dadosEvento.nome == undefined || dadosEvento.nome > 200 ||
        dadosEvento.descricao == '' || dadosEvento.descricao == undefined ||
        dadosEvento.local == '' || dadosEvento.local == undefined || dadosEvento.local > 255 ||
        dadosEvento.hora == '' || dadosEvento.hora == undefined ||
        dadosEvento.id_paciente_cuidador == '' || dadosEvento.id_paciente_cuidador == undefined || isNaN(dadosEvento.id_paciente_cuidador) ||
        dadosEvento.domingo === '' || dadosEvento.domingo === undefined || 
        dadosEvento.segunda === '' || dadosEvento.segunda === undefined || 
        dadosEvento.terca === '' || dadosEvento.terca === undefined || 
        dadosEvento.quarta === '' || dadosEvento.quarta === undefined || 
        dadosEvento.quinta === '' || dadosEvento.quinta === undefined || 
        dadosEvento.sexta === '' || dadosEvento.sexta === undefined || 
        dadosEvento.sabado === '' || dadosEvento.sabado === undefined 
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let resultDadosEvento = await evento_semanalDAO.insertEvento(dadosEvento)

        if (resultDadosEvento) {
            let novoEvento = await evento_semanalDAO.selectLastId()

            let dadosEventoJSON = {}
            dadosEventoJSON.status = messages.SUCCESS_CREATED_ITEM.status
            dadosEventoJSON.evento = novoEvento

            return dadosEventoJSON
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const updateEvento = async function (dadosEvento, id) {
    if (
        dadosEvento.nome == '' || dadosEvento.nome == undefined || dadosEvento.nome > 200 ||
        dadosEvento.descricao == '' || dadosEvento.descricao == undefined ||
        dadosEvento.local == '' || dadosEvento.local == undefined || dadosEvento.local > 255 ||
        dadosEvento.hora == '' || dadosEvento.hora == undefined ||
        dadosEvento.id_paciente_cuidador == '' || dadosEvento.id_paciente_cuidador == undefined || isNaN(dadosEvento.id_paciente_cuidador) ||
        dadosEvento.domingo === '' || dadosEvento.domingo === undefined || 
        dadosEvento.segunda === '' || dadosEvento.segunda === undefined || 
        dadosEvento.terca === '' || dadosEvento.terca === undefined || 
        dadosEvento.quarta === '' || dadosEvento.quarta === undefined || 
        dadosEvento.quinta === '' || dadosEvento.quinta === undefined || 
        dadosEvento.sexta === '' || dadosEvento.sexta === undefined || 
        dadosEvento.sabado === '' || dadosEvento.sabado === undefined 
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        dadosEvento.id = id

        let atualizacaoEvento = await evento_semanalDAO.selectEventoById(id)

        if (atualizacaoEvento) {
            let resultDadosEvento = await evento_semanalDAO.updateEvento(dadosEvento)

            if (resultDadosEvento) {
                let dadosEventoJSON = {}
                dadosEventoJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosEventoJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosEventoJSON.evento = dadosEvento

                return dadosEventoJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const deleteEvento = async function (id) {

    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdEvento = await evento_semanalDAO.selectEventoById(id)

        if (searchIdEvento) {
            let dadosEvento = await evento_semanalDAO.deleteEvento(id)

            if (dadosEvento) {
                return messages.SUCCESS_DELETED_ITEM
            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }

}

module.exports = {
    deleteEvento,
    getEventoByID,
    insertEvento,
    updateEvento,
    getAllEventos,
    getEventoByCuidador,
    getEventoByPaciente
}