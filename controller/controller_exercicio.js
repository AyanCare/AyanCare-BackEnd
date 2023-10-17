/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos EXERCICIOS no Banco de Dados.
 * Data: 17/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')
const jwt = require('../middleware/middlewareJWT.js')

const exercicioDAO = require('../model/DAO/exercicioDAO.js')

const getExercicios = async function () {
    let dadosExerciciosJSON = {}

    let dadosExercicios = await exercicioDAO.selectAllExercicios()

    if (dadosExercicios) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosExerciciosJSON.status = messages.SUCCESS_REQUEST.status
        dadosExerciciosJSON.quantidade = dadosExercicios.length
        dadosExerciciosJSON.exercicios = dadosExercicios
        return dadosExerciciosJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getExercicioByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosExercicioJSON = {};

        let dadosExercicio = await exercicioDAO.selectExercicioById(id)

        if (dadosExercicio) {
            dadosExercicioJSON.status = messages.SUCCESS_REQUEST.status
            dadosExercicioJSON.exercicio = dadosExercicio
            return dadosExercicioJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

module.exports = {
    getExercicios,
    getExercicioByID
}