/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Contato no Banco de Dados.
 * Data: 27/09/2023
 * Autor: Gustavo Souza 
 * Versão: 1.0
 **************************************************************************************/


//Importe de arquivo 
const message = require('./modules/config.js')

const contatoDAO = require ('../model/DAO/contatoDAO.js');
const { JsonWebTokenError } = require('jsonwebtoken');



/*******************Todos do Contatos ****************************** */
const getContatos = async function (){

    let dadosContatoJSON = {};

    let dadosContatos = await contatoDAO.selectAllContatos()


    if (dadosContatos) {
        
        dadosContatoJSON.status = message.SUCCESS_REQUEST.status
        dadosContatoJSON.quantidade = dadosContatos.length
        dadosContatoJSON.contatos = dadosContatos
        return dadosContatoJSON
    }else{
        return message.ERROR_INTERNAL_SERVER
    }
}


/******************GET**************************************** */

const getContatoByID = async function (id){

    if (id == '' || isNaN(id)|| id == undefined) {
        return message.ERROR_INVALID_ID
    }else{

        let dadosContatoJSON = {};

        let dadosContato = await contatoDAO.selectcontatoById(id)

        if (dadosContato) {
            dadosContatoJSON.status = message.SUCCESS_REQUEST.status
            dadosContatoJSON.contato = dadosContato
        } else {
            return message.ERROR_NOT_FOUND
        }
    }
}

/******************Insert**************************************** */
const insertContato = async function (dadosContato){

    if (
        dadosContato.nome      == ''  || dadosContato.nome       ==   undefined || dadosContato.nome   > 200 || 
        dadosContato.numero    == ''  || dadosContato.numero     ==   undefined || dadosContato.numero > 20  ||
        dadosContato.local     == ''  || dadosContato.local      ==   undefined || dadosContato.local  > 255 ||
        dadosContato.id_status == ''  || dadosContato.id_status  ==   undefined  
    ) {
        return message.ERROR_REQUIRED_FIELDS
    }else{
        let resultDadosContato = await contatoDAO.insertContato(dadosContato)

        if (resultDadosContato) {
            let novoContato = await contatoDAO.selectLastId()

            let dadosContatoJSON = {}

            let tokenUser = await JsonWebTokenError.createJWT (novoContato[0].id)

            dadosContatoJSON.token = tokenUser
            dadosContatoJSON.status = message.SUCCESS_CREATED_ITEM.status
            dadosContatoJSON.contato = novoContato

            return dadosContatoJSON
        } else {
            return message.ERROR_INTERNAL_SERVER
            
        }
    }
}

/******************UpdateContato**************************** */

const updateContato = async function (dadosContato, id){

    if (
        dadosContato.nome      == ''  || dadosContato.nome          ==   undefined || dadosContato.nome   > 200 || 
        dadosContato.numero    == ''  || dadosContato.numero        ==   undefined || dadosContato.numero > 20  ||
        dadosContato.local     == ''  || dadosContato.local         ==   undefined || dadosContato.local  > 255 ||
        dadosContato.id_status == ''  || dadosContato.id_status     ==   undefined
    ) {
        return message.ERROR_REQUIRED_FIELDS
    }else if (id == null || id == undefined || isNaN(id)){
        return message.ERROR_INVALID_ID
    }else{
        dadosContato.id = id

        let atualizacaoContato = await contatoDAO.selectcontatoById(id)

        if(atualizacaoContato){
            let resultDadosContato = await contatoDAO.updateContato(dadosContato)

            if(resultDadosContato){
                let dadosContatoJSON = {}
                dadosContatoJSON.status = message.SUCCESS_UPDATED_ITEM.status
                dadosContatoJSON.message = message.SUCCESS_UPDATED_ITEM.message
                dadosContatoJSON.contato = dadosContato

                return dadosContatoJSON
            }else{
                return message.ERROR_INTERNAL_SERVER
            }
        }else{
            return message.ERROR_INVALID_ID
        }
    }
}

/******************deletarContato**************************** */

const deletarContato = async function (id){
    if(id == null || id == undefined || id == ''|| isNaN(id)){
        return message.ERROR_INVALID_ID
    }else {
        let searchIdContato = await contatoDAO.selectcontatoById(id)

        if (searchIdCuidador) {
            let dadosContato =await contatoDAO.deleteContato(id)
            if (dadosContato) {
                return message.SUCCESS_DELETED_ITEM
            } else {
                return message.ERROR_INTERNAL_SERVER
            }
        } else {
            return message.ERROR_INVALID_ID
            
        }
    }
}


module.exports = {
    getContatoByID,
    getContatos,
    insertContato,
    updateContato,
    deletarContato
}