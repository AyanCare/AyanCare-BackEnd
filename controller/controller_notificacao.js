/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados das Notificações no Banco de Dados.
 * Data: 06/09/2023
 * Autor: Lohannes da Silva Costa
 * Data Atualização mais Recente: 29/09/2023
 * Versão: 2.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

const notificacaoDAO = require('../model/DAO/notificacaoDAO.js')

const getNotificacoes = async function () {
    let dadosNotificacoesJSON = {}

    let dadosNotificacoes = await notificacaoDAO.selectAllNotificacoes()

    if (dadosNotificacoes) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosNotificacoesJSON.status = messages.SUCCESS_REQUEST.status
        dadosNotificacoesJSON.quantidade = dadosNotificacoes.length
        dadosNotificacoesJSON.notificacoes = dadosNotificacoes
        return dadosNotificacoesJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getsNotificacaoById = async function (idPaciente) {
    let dadosNotificacoesJSON = {}

    let dadosNotificacoes = await notificacaoDAO.selectNotificacoesNomes(idPaciente)

    if (dadosNotificacoes) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosNotificacoesJSON.status = messages.SUCCESS_REQUEST.status
        dadosNotificacoesJSON.quantidade = dadosNotificacoes.length
        dadosNotificacoesJSON.notificacoes = dadosNotificacoes
        return dadosNotificacoesJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getNotificacaoByPaciente = async function (id) {
    if (id === '' || isNaN(id) || id === undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosNotificacaoJSON = {};

        let dadosNotificacao = await notificacaoDAO.selectNotificacaoById(id)

        if (dadosNotificacao) {
            dadosNotificacaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosNotificacaoJSON.notificacao = dadosNotificacao
            return dadosNotificacaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getNotificacoesByCuidador = async function (idPaciente) {
    if (idPaciente === '' || idPaciente === undefined || isNaN(idPaciente)) {
        return messages.ERROR_INVALID_ID
    } else {
        let dadosNotificacaoJSON = {};

        let dadosNotificacao = await notificacaoDAO.selectAllNotificacoesByPaciente(idPaciente)

        if (dadosNotificacao) {
            dadosNotificacaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosNotificacaoJSON.notificacao = dadosNotificacao
            return dadosNotificacaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getNotificacoesByPacienteAndHorario = async function (idPaciente) {
    if (idPaciente === '' || idPaciente === undefined || isNaN(idPaciente)) {
        return messages.ERROR_INVALID_ID
    } else {
        let dadosNotificacaoJSON = {};

        let dadosNotificacao = await notificacaoDAO.selectAllNotificacoesByPaciente(idPaciente)

        if (dadosNotificacao) {
            dadosNotificacaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosNotificacaoJSON.notificacao = dadosNotificacao
            return dadosNotificacaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getNotificacoesByCuidadorAndHorario = async function (idPaciente) {
    if (idPaciente === '' || idPaciente === undefined || isNaN(idPaciente)) {
        return messages.ERROR_INVALID_ID
    } else {
        let dadosNotificacaoJSON = {};

        let dadosNotificacao = await notificacaoDAO.selectAllNotificacoesByPaciente(idPaciente)

        if (dadosNotificacao) {
            dadosNotificacaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosNotificacaoJSON.notificacao = dadosNotificacao
            return dadosNotificacaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const insertNotificacao = async function (dadosNotificacao) {

    if (
        dadosNotificacao.nome === '' || dadosNotificacao.nome === undefined || dadosNotificacao.nome > 80 ||
        dadosNotificacao.descricao === '' || dadosNotificacao.descricao === undefined ||
        dadosNotificacao.id_paciente === '' || 
        dadosNotificacao.id_cuidador === '' 
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {

            if (dadosNotificacao.id_paciente == undefined) {
                dadosNotificacao.id_paciente = 0
            } 
            if (dadosNotificacao.id_cuidador == undefined) {
                dadosNotificacao.id_cuidador = 0
            } 
        
            let resultDadosNotificacao = await notificacaoDAO.insertNotificacao(dadosNotificacao)

            if (resultDadosNotificacao) {
                let novoNotificacao = await notificacaoDAO.selectLastId()

                let dadosNotificacaoJSON = {}
                dadosNotificacaoJSON.status = messages.SUCCESS_CREATED_ITEM.status
                dadosNotificacaoJSON.notificacao = novoNotificacao

                return dadosNotificacaoJSON
            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        
    }
}

module.exports = {
    
}
