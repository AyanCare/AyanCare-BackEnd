/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos SINTOMAS no Banco de Dados.
 * Data: 17/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')
const jwt = require('../middleware/middlewareJWT.js')

const sintomaDAO = require('../model/DAO/sintomaDAO.js')

const getSintomas = async function () {
    let dadosSintomasJSON = {}

    let dadosSintomas = await sintomaDAO.selectAllSintomas()

    if (dadosSintomas) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosSintomasJSON.status = messages.SUCCESS_REQUEST.status
        dadosSintomasJSON.quantidade = dadosSintomas.length
        dadosSintomasJSON.sintomas = dadosSintomas
        return dadosSintomasJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getSintomaByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosSintomaJSON = {};

        let dadosSintoma = await sintomaDAO.selectSintomaById(id)

        if (dadosSintoma) {
            dadosSintomaJSON.status = messages.SUCCESS_REQUEST.status
            dadosSintomaJSON.sintoma = dadosSintoma
            return dadosSintomaJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

module.exports = {
    getSintomas,
    getSintomaByID
}