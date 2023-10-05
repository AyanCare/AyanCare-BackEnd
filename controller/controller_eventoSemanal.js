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

const getCuidadorByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosEventoJSON = {};

        let dadosEvento = await cuidadorDAO.selectCuidadorById(id)

        if (dadosEvento) {
            dadosEventoJSON.status = messages.SUCCESS_REQUEST.status
            dadosEventoJSON.cuidador = dadosEvento
            return dadosEventoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getCuidadorByEmailAndSenhaAndNome = async function (dadosEvento) {
    if (dadosEvento.email == '' || dadosEvento.email == undefined ||
        dadosEvento.senha == '' || dadosEvento.senha == undefined ||
        dadosEvento.nome == '' || dadosEvento.nome == undefined){
        return messages.ERROR_REQUIRED_FIELDS
    } else {

        let dadosEventoJSON = {};

        let rsCuidador = await cuidadorDAO.selectCuidadorByEmailAndSenhaAndNome(dadosEvento)

        if (rsCuidador) {
            let tokenUser = await jwt.createJWT(rsCuidador.id)

            dadosEventoJSON.token = tokenUser
            dadosEventoJSON.status = messages.SUCCESS_REQUEST.status
            dadosEventoJSON.cuidador = rsCuidador
            return dadosEventoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getCuidadorByEmail = async function (emailCuidador) {
    if (emailCuidador == '' || emailCuidador == undefined) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {

        let dadosEventoJSON = {};

        let rsCuidador = await cuidadorDAO.selectCuidadorByEmail(emailCuidador)

        if (rsCuidador) {
            dadosEventoJSON.status = messages.SUCCESS_REQUEST.status
            dadosEventoJSON.cuidador = rsCuidador
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
        dadosEvento.email == '' || dadosEvento.email == undefined || dadosEvento.email > 255 ||
        dadosEvento.senha == '' || dadosEvento.senha == undefined || dadosEvento.senha > 255 
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let resultDadosEvento = await cuidadorDAO.insertCuidador(dadosEvento)

        if (resultDadosEvento) {
            let novoCuidador = await cuidadorDAO.selectLastId()

            let dadosEventoJSON = {}

            let tokenUser = await jwt.createJWT(novoCuidador.id)

            dadosEventoJSON.token = tokenUser
            dadosEventoJSON.status = messages.SUCCESS_CREATED_ITEM.status
            dadosEventoJSON.cuidador = novoCuidador

            return dadosEventoJSON
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const updateCuidador = async function (dadosEvento, id) {
    if (
        dadosEvento.nome == '' || dadosEvento.nome == undefined || dadosEvento.nome > 200 ||
        dadosEvento.data_nascimento == '' || dadosEvento.data_nascimento == undefined 
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        dadosEvento.id = id

        let atualizacaoCuidador = await cuidadorDAO.selectCuidadorById(id)

        if (atualizacaoCuidador) {
            let resultDadosEvento = await cuidadorDAO.updateCuidador(dadosEvento)

            if (resultDadosEvento) {
                let dadosEventoJSON = {}
                dadosEventoJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosEventoJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosEventoJSON.cuidador = dadosEvento

                return dadosEventoJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const updateSenhaCuidador = async function (dadosEvento, id) {
    if (
        dadosEvento.senha == '' || dadosEvento.senha == undefined || dadosEvento.senha > 255
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        dadosEvento.id = id

        let atualizacaoCuidador = await cuidadorDAO.selectCuidadorById(id)

        if (atualizacaoCuidador) {
            let resultDadosEvento = await cuidadorDAO.updateSenhaCuidador(dadosEvento)

            if (resultDadosEvento) {
                let dadosEventoJSON = {}
                dadosEventoJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosEventoJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosEventoJSON.cuidador = dadosEvento

                return dadosEventoJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const deleteCuidador = async function (id) {

    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdCuidador = await cuidadorDAO.selectCuidadorById(id)

        if (searchIdCuidador) {
            let dadosEvento = await cuidadorDAO.deleteCuidador(id)

            if (dadosEvento) {
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
    getCuidadores,
    insertCuidador,
    updateCuidador,
    deleteCuidador,
    getCuidadorByID,
    getCuidadorByEmailAndSenhaAndNome,
    getCuidadorByEmail,
    updateSenhaCuidador
}