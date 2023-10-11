/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Perguntas no Banco de Dados.
 * Data: 11/10/2023
 * Autor: Gustavo Souza Tenorio  de Barros
 * Versão: 1.0
 **************************************************************************************/

 const message = require('./modules/config.js')

 const questionarioDAO = require('../model/DAO/questionario_relatorioDAO.js')


/************************** GET ******************************/

const getAllQuestionarios =  async function () {
     
    let dadosQuestionariosJSON = {}

    let dadosQuestionarios = await questionarioDAO.selectAllQuestionario()

    if (dadosQuestionarios) {
        
        dadosQuestionariosJSON.status = message.SUCCESS_REQUEST.status
        dadosQuestionariosJSON.qunatidade = dadosQuestionarios.length
        dadosQuestionariosJSON.questionarios = dadosQuestionarios
        return dadosQuestionariosJSON
    }else{
        return message.ERROR_INTERNAL_SERVER
    }
}

const getQuestionarioByID = async function(id){
 
    if (id == '' || isNaN(id)|| id == undefined ) {
        return message.ERROR_INVALID_ID
    } else {
        
        let dadosQuestionarioJSON = {}

        let dadosQuestionario = await questionarioDAO.selectQuestionarioByID(id)

        if (dadosQuestionario) {
            dadosQuestionarioJSON.questionario = dadosQuestionario
            return dadosQuestionarioJSON
        } else {
            
            return message.ERROR_NOT_FOUND
        }
    }
}


/************************** Inserte ******************************/
const insertQuestionario = async function(dadosQuestionario){
 
    if (
        dadosQuestionario.resposta === ''|| dadosQuestionario.resposta === undefined

    ) {
        return message.ERROR_REQUIRED_FIELDS
    } else {
        
        let resultDadosQuestionario = await questionarioDAO.insertQuestionario(dadosQuestionario)

        if (resultDadosQuestionario) {
            let novoQuestionario = await questionarioDAO.selectLastId()

            let dadosQuestionarioJSON = {}

            dadosQuestionarioJSON.status = message.SUCCESS_CREATED_ITEM.status
            dadosQuestionarioJSON.questionario = novoQuestionario

            return dadosQuestionarioJSON
        } else {
            
            return message.ERROR_INTERNAL_SERVER
        }
    }

}

module.exports ={

    getAllQuestionarios,
    getQuestionarioByID,
    insertQuestionario
}