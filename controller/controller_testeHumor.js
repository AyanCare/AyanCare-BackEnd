/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos TESTES no Banco de Dados.
 * Data: 17/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')
const jwt = require('../middleware/middlewareJWT.js')

const teste_humorDAO = require('../model/DAO/teste_humorDAO.js')

const getTestes = async function () {
    let dadosTestesJSON = {}

    let dadosTestes = await teste_humorDAO.selectAllTestes()

    if (dadosTestes) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosTestesJSON.status = messages.SUCCESS_REQUEST.status
        dadosTestesJSON.quantidade = dadosTestes.length
        dadosTestesJSON.testes = dadosTestes
        return dadosTestesJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getTesteByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosTesteJSON = {};

        let dadosTeste = await teste_humorDAO.selectTesteById(id)

        if (dadosTeste) {
            dadosTesteJSON.status = messages.SUCCESS_REQUEST.status
            dadosTesteJSON.teste = dadosTeste
            return dadosTesteJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getTesteByPaciente = async function (idPaciente) {
    if (idPaciente == '' || idPaciente == undefined || isNaN(idPaciente)) {
        return messages.ERROR_INVALID_PACIENTE
    } else {

        let dadosTesteJSON = {};

        let rsTeste = await teste_humorDAO.selectTesteByPaciente(idPaciente)

        if (rsTeste) {
            dadosTesteJSON.status = messages.SUCCESS_REQUEST.status
            dadosTesteJSON.testes = rsTeste
            return dadosTesteJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const insertTeste = async function (dadosTeste) {

    if (
        dadosTeste.observacao == '' || dadosTeste.observacao == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let resultDadosTeste = await teste_humorDAO.insertTeste(dadosTeste)

        if (resultDadosTeste) {
            let novoTeste = await teste_humorDAO.selectLastId()

            let dadosTesteJSON = {}
            dadosTesteJSON.status = messages.SUCCESS_CREATED_ITEM.status
            dadosTesteJSON.teste = novoTeste

            return dadosTesteJSON
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const deleteTeste = async function (id) {

    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdTeste = await teste_humorDAO.selectTesteById(id)

        if (searchIdTeste) {
            let dadosTeste = await teste_humorDAO.deleteTeste(id)

            if (dadosTeste) {
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
    getTestes,
    insertTeste,
    getTesteByID,
    getTesteByPaciente,
    deleteTeste
}