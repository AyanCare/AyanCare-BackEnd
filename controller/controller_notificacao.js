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

const getNomesNotificacoes = async function (idPaciente) {
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

const getNotificacaoByID = async function (id) {
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

const getNotificacoesByPaciente = async function (idPaciente) {
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

const getNotificacoesByPaciente = async function (idPaciente) {
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

const getNotificacoesByPaciente = async function (idPaciente) {
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

// '${dadosNotificacao.nome}'
// '${dadosNotificacao.quantidade}',
// '${dadosNotificacao.data_validade}',
// '${dadosNotificacao.estocado}',
// ${dadosNotificacao.id_paciente},
// ${dadosNotificacao.id_medida}

const insertNotificacao = async function (dadosNotificacao) {

    if (
        dadosNotificacao.nome === '' || dadosNotificacao.nome === undefined || dadosNotificacao.nome > 80 ||
        dadosNotificacao.data_validade === '' || dadosNotificacao.data_validade === undefined ||
        dadosNotificacao.estocado === '' || dadosNotificacao.estocado === undefined || (dadosNotificacao.estocado != 0 && dadosNotificacao.estocado != 1) || isNaN(dadosNotificacao.estocado) ||
        dadosNotificacao.quantidade === '' || dadosNotificacao.quantidade === undefined || isNaN(dadosNotificacao.quantidade) ||
        dadosNotificacao.id_paciente === '' || dadosNotificacao.id_paciente === undefined || isNaN(dadosNotificacao.id_paciente) ||
        dadosNotificacao.id_medida === '' || dadosNotificacao.id_medida === undefined || isNaN(dadosNotificacao.id_medida)
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        
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
