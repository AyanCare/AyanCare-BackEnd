/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Perguntas no Banco de Dados.
 * Data: 10/10/2023
 * Autor: Gustavo Souza Tenorio  de Barros
 * Versão: 1.0
 **************************************************************************************/

 const message = require('./modules/config.js')

 const perguntasDAO = require('../model/DAO/pergunta_relatorioDAO.js')
 
 
 
 
 
 /************************** GET ******************************/
 const getAllPerguntas = async function(){
 
     let dadosPerguntasJSON = {}
 
     let dadosPerguntas = await perguntasDAO.selectAllPerguntas()
      
     if (dadosPerguntas) {
         dadosPerguntasJSON.status = message.SUCCESS_REQUEST.status
         dadosPerguntasJSON.quantidade = dadosPerguntas.length
         dadosPerguntasJSON.perguntas = dadosPerguntas
         return dadosPerguntasJSON
     } else {
         
         return message.ERROR_INTERNAL_SERVER
     }
 }
 
 const getPerguntaByID = async function(id){
 
     if (id == '' || isNaN(id)|| id == undefined ) {
         return message.ERROR_INVALID_ID
     } else {
         
         let dadosPerguntaJSON = {}
 
         let dadosPergunta = await perguntasDAO.selectPerguntaByID(id)
 
         if (dadosPergunta) {
             dadosPerguntaJSON.pergunta = dadosPergunta
             return dadosPerguntaJSON
         } else {
             
             return message.ERROR_NOT_FOUND
         }
     }
 }
 
 
 /************************** Inserte ******************************/
 const insertPergunta = async function(dadosPergunta){
 
     if (
         dadosPergunta.pergunta == ''|| dadosPergunta.pergunta == undefined
     ) {
         return message.ERROR_REQUIRED_FIELDS
     } else {
         
         let resultDadosPergunta = await perguntasDAO.insertPergunta(dadosPergunta)
 
         if (resultDadosPergunta) {
             let novaPergunta = await perguntasDAO.selectLastId()
 
             let dadosPerguntaJSON = {}
 
             dadosPerguntaJSON.status = message.SUCCESS_CREATED_ITEM.status
             dadosPerguntaJSON.pergunta = novaPergunta
 
             return dadosPerguntaJSON
         } else {
             
             return message.ERROR_INTERNAL_SERVER
         }
     }
 
 }
 
 
 module.exports = {
     getAllPerguntas,
     getPerguntaByID,
     insertPergunta
 }