/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Status Contato no Banco de Dados.
 * Data: 27/09/2023
 * Autor: Gustavo Souza Tenorio de Barros
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

const status_contatoDAO = require('../model/DAO/status_contatoDAO.js')


const getStatusContos = async function(){

    let dadosStatusContatoJSON = {}

    let dadosStatusContato = await status_contatoDAO.selectAllStatusContato()

    if (dadosStatusContato) {
        
        dadosStatusContatoJSON.status = messages.SUCCESS_REQUEST.status
        dadosStatusContatoJSON.quantidade = dadosStatusContato.length
        dadosStatusContatoJSON.statusContato= dadosStatusContato    
        
        return dadosStatusContatoJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }
}

const getStatusContosByID = async function(id){

    if (id == '' || isNaN(id)|| id == undefined){
        return messages.ERROR_INVALID_ID
    }else{

        let dadosStatusContatoJSON = {}

        let dadosStatusContato = await status_contatoDAO.selectStatusContatoById(id)
        
        if(dadosStatusContato){
           
            dadosStatusContatoJSON.status=messages.SUCCESS_REQUEST.status
            dadosStatusContatoJSON.quantidade = dadosStatusContato
            return dadosStatusContatoJSON
        }else{
            return messages.ERROR_NOT_FOUND
        }
    }
}
/******************Insert**************************************** */

const insertStatusContato = async function(dadosStatusContato){


    if (
        dadosStatusContato.nome == ''|| dadosStatusContato == undefined|| dadosStatusContato > 45
    ) {
        let resultadoStatusContato = await status_contatoDAO.insertStatusContato(dadosStatusContato)
        let dadosStatusContatoJSON = {}
        
        dadosStatusContatoJSON.status = messages.SUCCESS_REQUEST.status
            dadosStatusContatoJSON.status = dadosStatusContato
            return dadosStatusContatoJSON
    }else{
        
        return messages.ERROR_NOT_FOUND
    }



}





module.exports={
    getStatusContosByID,
    getStatusContos,
    insertStatusContato
}