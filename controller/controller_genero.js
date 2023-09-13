/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos GENEROS no Banco de Dados.
 * Data: 11/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

const generoDAO = require('../model/DAO/generoDAO.js')

const getGeneros = async function () {
    let dadosGenerosJSON = {}

    let dadosGeneros = await generoDAO.selectAllGeneros()

    if (dadosGeneros) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosGenerosJSON.status = messages.SUCCESS_REQUEST.status
        dadosGenerosJSON.quantidade = dadosGeneros.length
        dadosGenerosJSON.pacientes = dadosGeneros
        return dadosGenerosJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getGeneroByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosGeneroJSON = {};

        let dadosGenero = await generoDAO.selectGeneroById(id)

        if (dadosGenero) {
            dadosGeneroJSON.status = messages.SUCCESS_REQUEST.status
            dadosGeneroJSON.paciente = dadosGenero
            return dadosGeneroJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

module.exports = {
    getGeneroByID,
    getGeneros
}