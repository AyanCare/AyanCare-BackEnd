/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados das CORES no Banco de Dados.
 * Data: 24/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

const corDAO = require('../model/DAO/corDAO.js')

const getCores = async function () {
    let dadosCoresJSON = {}

    let dadosCores = await corDAO.selectAllCores()

    if (dadosCores) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosCoresJSON.status = messages.SUCCESS_REQUEST.status
        dadosCoresJSON.quantidade = dadosCores.length
        dadosCoresJSON.cores = dadosCores
        return dadosCoresJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getCorByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosCorJSON = {};

        let dadosCor = await corDAO.selectCorById(id)

        if (dadosCor) {
            dadosCorJSON.status = messages.SUCCESS_REQUEST.status
            dadosCorJSON.cor = dadosCor
            return dadosCorJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

module.exports = {
    getCores,
    getCorByID
}