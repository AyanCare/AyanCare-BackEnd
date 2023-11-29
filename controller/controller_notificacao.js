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

const getNotificacaoById = async function (idNotificacao) {
    let dadosNotificacaoJSON = {}

    let dadosNotificacao = await notificacaoDAO.selectNotificacaoById(idNotificacao)

    if (dadosNotificacao) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosNotificacaoJSON.status = messages.SUCCESS_REQUEST.status
        dadosNotificacaoJSON.notificacao = dadosNotificacao
        return dadosNotificacaoJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getNotificacoesByPaciente = async function (idPaciente) {
    if (idPaciente === '' || isNaN(idPaciente) || idPaciente === undefined) {
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

const getNotificacoesByCuidador = async function (idCuidador) {

    if (idCuidador === '' || idCuidador === undefined || isNaN(idCuidador)) {
        return messages.ERROR_INVALID_ID
    } else {
        let dadosNotificacaoJSON = {};

        let dadosNotificacao = await notificacaoDAO.selectAllNotificacoesByCuidador(idCuidador)

        if (dadosNotificacao) {
            dadosNotificacaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosNotificacaoJSON.notificacao = dadosNotificacao
            return dadosNotificacaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getModificacoesDePacienteByCuidador = async function (idCuidador) {

    if (idCuidador === '' || idCuidador === undefined || isNaN(idCuidador)) {
        return messages.ERROR_INVALID_ID
    } else {
        let dadosNotificacaoJSON = {};

        let dadosNotificacao = await notificacaoDAO.selectAllModificacoesDePaciente(idCuidador)

        if (dadosNotificacao) {
            dadosNotificacaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosNotificacaoJSON.notificacao = dadosNotificacao
            return dadosNotificacaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getNotificacoesByPacienteAndCuidador = async function (idCuidador, idPaciente) {

    if (idCuidador === '' || idCuidador === undefined || isNaN(idCuidador) ||
        idPaciente === '' || isNaN(idPaciente) || idPaciente === undefined) {
        return messages.ERROR_INVALID_ID
    } else {
        let dadosNotificacaoJSON = {};

        let dadosNotificacao = await notificacaoDAO.selectNotificacoesByCuidadorAndPaciente(idPaciente, idCuidador)

        if (dadosNotificacao) {
            dadosNotificacaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosNotificacaoJSON.notificacao = dadosNotificacao
            return dadosNotificacaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getNotificacoesByPacienteAndHorario = async function (idPaciente, horario) {
    if (idPaciente === '' || idPaciente === undefined || isNaN(idPaciente)) {
        return messages.ERROR_INVALID_ID
    } else if (horario == '' || horario == undefined) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let dadosNotificacaoJSON = {};

        let dadosNotificacao = await notificacaoDAO.selectAllNotificacoesByPacienteAndHorario(idPaciente, horario)

        if (dadosNotificacao) {
            dadosNotificacaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosNotificacaoJSON.notificacao = dadosNotificacao
            return dadosNotificacaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getNotificacoesByCuidadorAndHorario = async function (idCuidador, horario) {
    if (idCuidador === '' || idCuidador === undefined || isNaN(idCuidador)) {
        return messages.ERROR_INVALID_ID
    } else if (horario == '' || horario == undefined) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let dadosNotificacaoJSON = {};

        let dadosNotificacao = await notificacaoDAO.selectAllNotificacoesByCuidadorAndHorario(idCuidador, horario)

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
    insertNotificacao,
    getNotificacoes,
    getNotificacaoById,
    getNotificacoesByPaciente,
    getNotificacoesByCuidador,
    getNotificacoesByPacienteAndHorario,
    getNotificacoesByCuidadorAndHorario,
    getModificacoesDePacienteByCuidador,
    getNotificacoesByPacienteAndCuidador
}
