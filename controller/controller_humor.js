/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos HUMORES no Banco de Dados.
 * Data: 17/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')
const jwt = require('../middleware/middlewareJWT.js')

const humorDAO = require('../model/DAO/humorDAO.js')

const getOpcoes = async function () {
    let dadosHumoresJSON = {}

    let dadosHumores = await humorDAO.selectAllCategorias()

    if (dadosHumores) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosHumoresJSON.status = messages.SUCCESS_REQUEST.status
        dadosHumoresJSON.quantidade = dadosHumores.length
        dadosHumoresJSON.opcoes = dadosHumores
        return dadosHumoresJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getHumores = async function () {
    let dadosHumoresJSON = {}

    let dadosHumores = await humorDAO.selectAllHumores()

    if (dadosHumores) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosHumoresJSON.status = messages.SUCCESS_REQUEST.status
        dadosHumoresJSON.quantidade = dadosHumores.length
        dadosHumoresJSON.humores = dadosHumores
        return dadosHumoresJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getHumorByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosHumorJSON = {};

        let dadosHumor = await humorDAO.selectHumorById(id)

        if (dadosHumor) {
            dadosHumorJSON.status = messages.SUCCESS_REQUEST.status
            dadosHumorJSON.humor = dadosHumor
            return dadosHumorJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

module.exports = {
    getHumores,
    getHumorByID,
    getOpcoes
}