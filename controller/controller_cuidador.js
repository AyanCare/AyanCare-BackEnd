/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos CUIDADORES no Banco de Dados.
 * Data: 11/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')
const emailSender = require('../middleware/middlewareEmail.js')
const crypto = require("crypto");
const moment = require("moment");
const jwt = require('../middleware/middlewareJWT.js')
const cuidadorDAO = require('../model/DAO/cuidadorDAO.js')

const getCuidadores = async function () {
    let dadosCuidadoresJSON = {}

    let dadosCuidadores = await cuidadorDAO.selectAllCuidadores()

    if (dadosCuidadores) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosCuidadoresJSON.status = messages.SUCCESS_REQUEST.status
        dadosCuidadoresJSON.quantidade = dadosCuidadores.length
        dadosCuidadoresJSON.cuidadores = dadosCuidadores
        return dadosCuidadoresJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getCuidadorByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosCuidadorJSON = {};

        let dadosCuidador = await cuidadorDAO.selectCuidadorById(id)

        if (dadosCuidador) {
            dadosCuidadorJSON.status = messages.SUCCESS_REQUEST.status
            dadosCuidadorJSON.cuidador = dadosCuidador
            return dadosCuidadorJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getCuidadorByEmailAndSenhaAndNome = async function (dadosCuidador) {
    if (dadosCuidador.email == '' || dadosCuidador.email == undefined ||
        dadosCuidador.senha == '' || dadosCuidador.senha == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {

        let dadosCuidadorJSON = {};

        let rsCuidador = await cuidadorDAO.selectCuidadorByEmailAndSenhaAndNome(dadosCuidador)

        if (rsCuidador) {
            let tokenUser = await jwt.createJWT(rsCuidador.id)
            dadosCuidadorJSON.token = tokenUser
            dadosCuidadorJSON.status = messages.SUCCESS_REQUEST.status
            dadosCuidadorJSON.cuidador = rsCuidador
            return dadosCuidadorJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getCuidadorByEmail = async function (emailCuidador) {
    if (emailCuidador == '' || emailCuidador == undefined) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {

        let dadosCuidadorJSON = {};

        let rsCuidador = await cuidadorDAO.selectCuidadorByEmail(emailCuidador)

        if (rsCuidador) {
            dadosCuidadorJSON.status = messages.SUCCESS_REQUEST.status
            dadosCuidadorJSON.cuidador = rsCuidador[0]
            return dadosCuidadorJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const validateToken = async function (token) {
    if (token == '' || token == undefined) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let rsCuidador = await cuidadorDAO.selectToken(token)

        if (rsCuidador) {
            let now = moment().format('DD/MM/YYYY HH:mm')

            if (now > moment(rsCuidador.validade).add(3, 'hours').format('DD/MM/YYYY HH:mm')) {
                return messages.ERROR_UNAUTHORIZED_PASSWORD_RECOVER
            } else {
                await cuidadorDAO.deleteToken(rsCuidador.id)

                return messages.SUCCESS_VALID_TOKEN
            }
        } else {
            return messages.ERROR_INVALID_TOKEN
        }
    }
}

const insertCuidador = async function (dadosCuidador) {

    if (
        dadosCuidador.nome == '' || dadosCuidador.nome == undefined || dadosCuidador.nome > 200 ||
        dadosCuidador.email == '' || dadosCuidador.email == undefined || dadosCuidador.email > 255 ||
        dadosCuidador.senha == '' || dadosCuidador.senha == undefined || dadosCuidador.senha > 255
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let verifyEmail = await cuidadorDAO.selectCuidadorByEmail(dadosCuidador.email)

        if (verifyEmail.length > 0) {
            return messages.ERROR_EMAIL_ALREADY_EXISTS
        } else {
            let resultDadosCuidador = await cuidadorDAO.insertCuidador(dadosCuidador)

            if (resultDadosCuidador) {
                let novoCuidador = await cuidadorDAO.selectLastId()

                let dadosCuidadorJSON = {}

                let tokenUser = await jwt.createJWT(novoCuidador.id)

                dadosCuidadorJSON.token = tokenUser
                dadosCuidadorJSON.status = messages.SUCCESS_CREATED_ITEM.status
                dadosCuidadorJSON.cuidador = novoCuidador

                return dadosCuidadorJSON
            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        }
    }
}

const updateCuidador = async function (dadosCuidador) {
    if (
        dadosCuidador.nome == '' || dadosCuidador.nome == undefined || dadosCuidador.nome > 200 ||
        dadosCuidador.data_nascimento == '' || dadosCuidador.data_nascimento == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (dadosCuidador.id == null || dadosCuidador.id == undefined || isNaN(dadosCuidador.id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let atualizacaoCuidador = await cuidadorDAO.selectCuidadorById(dadosCuidador.id)

        if (atualizacaoCuidador) {
            let resultDadosCuidador = await cuidadorDAO.updateCuidador(dadosCuidador)

            if (resultDadosCuidador) {
                let dadosCuidadorJSON = {}
                dadosCuidadorJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosCuidadorJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosCuidadorJSON.cuidador = dadosCuidador

                return dadosCuidadorJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const updateSenhaCuidador = async function (dadosCuidador, id) {
    if (
        dadosCuidador.senha == '' || dadosCuidador.senha == undefined || dadosCuidador.senha > 255
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        dadosCuidador.id = id

        let atualizacaoCuidador = await cuidadorDAO.selectCuidadorById(id)

        if (atualizacaoCuidador) {
            let resultDadosCuidador = await cuidadorDAO.updateSenhaCuidador(dadosCuidador)

            if (resultDadosCuidador) {
                let dadosCuidadorJSON = {}
                dadosCuidadorJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosCuidadorJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosCuidadorJSON.cuidador = dadosCuidador

                return dadosCuidadorJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const updateTokenCuidador = async function (idCuidador) {
    if (idCuidador == null || idCuidador == undefined || isNaN(idCuidador)) {
        return messages.ERROR_INVALID_ID
    } else {

        let atualizacaoCuidador = await cuidadorDAO.selectCuidadorById(idCuidador)

        if (atualizacaoCuidador) {
            let token = crypto.randomBytes(3).toString('hex')
            let expiration = moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss')

            let dadosCuidador = {
                "id": idCuidador,
                "token": token,
                "expiration": expiration
            }

            let resultDadosCuidador = await cuidadorDAO.updateToken(dadosCuidador)

            if (resultDadosCuidador) {
                emailSender.enviarEmail(dadosCuidador.token, atualizacaoCuidador.email)

                let dadosCuidadorJSON = {}
                dadosCuidadorJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosCuidadorJSON.message = messages.SUCCESS_UPDATED_ITEM.message

                return dadosCuidadorJSON
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
            let dadosCuidador = await cuidadorDAO.deleteCuidador(id)

            if (dadosCuidador) {
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
    getCuidadores,
    insertCuidador,
    updateCuidador,
    deleteCuidador,
    getCuidadorByID,
    getCuidadorByEmailAndSenhaAndNome,
    getCuidadorByEmail,
    updateSenhaCuidador,
    updateTokenCuidador,
    validateToken
}
