/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados das COMORBIDADES no Banco de Dados.
 * Data: 26/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

const comorbidadeDAO = require('../model/DAO/comorbidadeDAO.js')

const getComorbidades = async function () {
    let dadosComorbidadesJSON = {}

    let dadosComorbidades = await comorbidadeDAO.selectAllComorbidades()

    if (dadosComorbidades) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosComorbidadesJSON.status = messages.SUCCESS_REQUEST.status
        dadosComorbidadesJSON.quantidade = dadosComorbidades.length
        dadosComorbidadesJSON.comorbidades = dadosComorbidades
        return dadosComorbidadesJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getComorbidadeByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosComorbidadeJSON = {};

        let dadosComorbidade = await comorbidadeDAO.selectComorbidadeById(id)

        if (dadosComorbidade) {
            dadosComorbidadeJSON.status = messages.SUCCESS_REQUEST.status
            dadosComorbidadeJSON.comorbidade = dadosComorbidade
            return dadosComorbidadeJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const insertComorbidade = async function (dadosComorbidade) {

    if (
        dadosComorbidade.nome == '' || dadosComorbidade.nome == undefined || dadosComorbidade.nome > 80 ||
        dadosComorbidade.id_paciente == '' || dadosComorbidade.id_paciente == undefined || isNaN(dadosComorbidade.id_paciente)
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let verifyName = await comorbidadeDAO.selectComorbidadeByNomeAndPaciente(dadosComorbidade.nome, dadosComorbidade.id_paciente)

        if (verifyName > 0) {
            return messages.ERROR_COMORBIDITY_ALREADY_EXISTS
        } else {
            let resultDadosComorbidade = await comorbidadeDAO.insertComorbidade(dadosComorbidade)

            if (resultDadosComorbidade) {
                let novoComorbidade = await comorbidadeDAO.selectLastId()
    
                dadosComorbidade.id_comorbidade = novoComorbidade.id
    
                let resultDadosComorbidadePaciente = await comorbidadeDAO.insertComorbidadeIntoPaciente(dadosComorbidade)
    
                if (resultDadosComorbidadePaciente) {
                    let dadosComorbidadeJSON = {}
    
                    dadosComorbidadeJSON.status = messages.SUCCESS_CREATED_ITEM.status
                    dadosComorbidadeJSON.comorbidade = novoComorbidade
    
                    return dadosComorbidadeJSON
                } else {
                    return messages.ERROR_INTERNAL_SERVER
                }
            } else {
                return messages.ERROR_INTERNAL_SERVER
            } 
        }
    }
}

const updateComorbidade = async function (dadosComorbidade, id) {
    if (
        dadosComorbidade.nome == '' || dadosComorbidade.nome == undefined || dadosComorbidade.nome > 80
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        dadosComorbidade.id = id

        let atualizacaoComorbidade = await comorbidadeDAO.selectComorbidadeById(id)

        if (atualizacaoComorbidade) {
            let resultDadosComorbidade = await comorbidadeDAO.updateComorbidade(dadosComorbidade)

            if (resultDadosComorbidade) {
                let dadosComorbidadeJSON = {}
                dadosComorbidadeJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosComorbidadeJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosComorbidadeJSON.comorbidade = dadosComorbidade

                return dadosComorbidadeJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const deleteComorbidade = async function (id) {

    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdComorbidade = await comorbidadeDAO.selectComorbidadeById(id)

        if (searchIdComorbidade) {
            let dadosComorbidadePaciente = await comorbidadeDAO.deleteComorbidadeOfPaciente(id)

            if (dadosComorbidadePaciente) {
                let dadosComorbidade = await comorbidadeDAO.deleteComorbidade(id)

                if (dadosComorbidade) {
                    return messages.SUCCESS_DELETED_ITEM
                } else {
                    return messages.ERROR_INTERNAL_SERVER
                }
            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }

}

module.exports = {
    deleteComorbidade,
    getComorbidadeByID,
    getComorbidades,
    insertComorbidade,
    updateComorbidade
}