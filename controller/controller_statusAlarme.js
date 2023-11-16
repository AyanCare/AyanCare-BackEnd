/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Status Alarme no Banco de Dados.
 * Data: 02/11/2023
 * Autor: Gustavo Souza Tenorio de Barros
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

const status_alarmeDAO = require('../model/DAO/status_alarmeDAO.js')


const getStatusAlarmes = async function(){

    let dadosStatusAlarmeJSON = {}

    let dadosStatusAlarme = await status_alarmeDAO.selectAllStatusAlarme()

    if (dadosStatusAlarme) {
        
        dadosStatusAlarmeJSON.status = messages.SUCCESS_REQUEST.status
        dadosStatusAlarmeJSON.quantidade = dadosStatusAlarme.length
        dadosStatusAlarmeJSON.statusAlarme= dadosStatusAlarme    
        
        return dadosStatusAlarmeJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }
}

const getStatusAlarmesByID = async function(id){

    if (id == '' || isNaN(id)|| id == undefined){
        return messages.ERROR_INVALID_ID
    }else{

        let dadosStatusAlarmeJSON = {}

        let dadosStatusAlarme = await status_alarmeDAO.selectStatusAlarmeById(id)
        
        if(dadosStatusAlarme){
           
            dadosStatusAlarmeJSON.status=messages.SUCCESS_REQUEST.status
            dadosStatusAlarmeJSON.quantidade = dadosStatusAlarme
            return dadosStatusAlarmeJSON
        }else{
            return messages.ERROR_NOT_FOUND
        }
    }
}


module.exports={
    getStatusAlarmesByID,
    getStatusAlarmes
}
