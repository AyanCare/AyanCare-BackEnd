/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados das CONEXÕES no Banco de Dados.
 * Data: 24/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

const conexaoDAO = require('../model/DAO/conexaoDAO.js')
const notificacaoDAO = require('../model/DAO/notificacaoDAO.js')


// selectAllConexoes,
//     selectConexaoById,
//     selectConexaoByCuidador,
//     selectConexaoByCuidadorAndNomePaciente,
//     selectConexaoByPaciente,
//     selectConexaoByPacienteAndNomeCuidador,
//     desativarConexao,
//     ativarConexao

// selectInactiveConexaoByPacienteAndCuidador,
//     selectInactiveConexaoByCuidadorAndNomePaciente,
//     selectInactiveConexaoByCuidador,
//     selectInactiveConexaoByPacienteAndNomeCuidador,
//     selectInactiveConexaoByPaciente,

const getConexoes = async function () {
    let dadosConexoesJSON = {}

    let dadosConexoes = await conexaoDAO.selectAllConexoes()

    if (dadosConexoes) {
        dadosConexoesJSON.status = messages.SUCCESS_REQUEST.status
        dadosConexoesJSON.quantidade = dadosConexoes.length
        dadosConexoesJSON.conexoes = dadosConexoes
        return dadosConexoesJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getConexaoByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosConexaoJSON = {};

        let dadosConexao = await conexaoDAO.selectConexaoById(id)

        if (dadosConexao) {
            dadosConexaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosConexaoJSON.conexao = dadosConexao
            return dadosConexaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getConexaoByCuidador = async function (idCuidador) {
    if (idCuidador == null || idCuidador == undefined || isNaN(idCuidador)){
        return messages.ERROR_INVALID_ID
    } else {
        let dadosConexaoJSON = {};

        let rsConexao = await conexaoDAO.selectConexaoByCuidador(idCuidador)

        if (rsConexao ) {
            dadosConexaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosConexaoJSON.conexao = rsConexao
            return dadosConexaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getConexaoInativaByCuidador = async function (idCuidador) {
    if (idCuidador == null || idCuidador == undefined || isNaN(idCuidador)){
        return messages.ERROR_INVALID_ID
    } else {
        let dadosConexaoJSON = {};

        let rsConexao = await conexaoDAO.selectInactiveConexaoByCuidador(idCuidador)

        if (rsConexao ) {
            dadosConexaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosConexaoJSON.conexao = rsConexao
            return dadosConexaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getConexaoByCuidadorAndNomePaciente = async function (idCuidador, nomeDoPaciente) {
    if (idCuidador == null || idCuidador == undefined || isNaN(idCuidador)){
        return messages.ERROR_INVALID_ID
    } else if(nomeDoPaciente == '' || nomeDoPaciente == undefined || !isNaN(nomeDoPaciente)) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let dadosConexaoJSON = {};

        let rsConexao = await conexaoDAO.selectConexaoByCuidadorAndNomePaciente(idCuidador, nomeDoPaciente)

        if (rsConexao) {
            dadosConexaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosConexaoJSON.conexao = rsConexao
            return dadosConexaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getConexaoInativaByCuidadorAndNomePaciente = async function (idCuidador, nomeDoPaciente) {
    if (idCuidador == null || idCuidador == undefined || isNaN(idCuidador)){
        return messages.ERROR_INVALID_ID
    } else if(nomeDoPaciente == '' || nomeDoPaciente == undefined || !isNaN(nomeDoPaciente)) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let dadosConexaoJSON = {};

        let rsConexao = await conexaoDAO.selectInactiveConexaoByCuidadorAndNomePaciente(idCuidador, nomeDoPaciente)

        if (rsConexao) {
            dadosConexaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosConexaoJSON.conexao = rsConexao
            return dadosConexaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getConexaoByPaciente = async function (idPaciente) {
    if (idPaciente == null || idPaciente == undefined || isNaN(idPaciente)){
        return messages.ERROR_INVALID_ID
    } else {
        let dadosConexaoJSON = {};

        let rsConexao = await conexaoDAO.selectConexaoByPaciente(idPaciente)

        if (rsConexao ) {
            dadosConexaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosConexaoJSON.conexao = rsConexao
            return dadosConexaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getConexaoInativaByPaciente = async function (idPaciente) {
    if (idPaciente == null || idPaciente == undefined || isNaN(idPaciente)){
        return messages.ERROR_INVALID_ID
    } else {
        let dadosConexaoJSON = {};

        let rsConexao = await conexaoDAO.selectInactiveConexaoByPaciente(idPaciente)

        if (rsConexao ) {
            dadosConexaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosConexaoJSON.conexao = rsConexao
            return dadosConexaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getConexaoByPacienteAndNomeCuidador = async function (idPaciente, nomeDoCuidador) {
    if (idPaciente == null || idPaciente == undefined || isNaN(idPaciente)){
        return messages.ERROR_INVALID_ID
    } else if(nomeDoCuidador == '' || nomeDoCuidador == undefined || !isNaN(nomeDoCuidador)) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let dadosConexaoJSON = {};

        let rsConexao = await conexaoDAO.selectConexaoByPacienteAndNomeCuidador(idPaciente, nomeDoCuidador)

        if (rsConexao ) {
            dadosConexaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosConexaoJSON.conexao = rsConexao
            return dadosConexaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getConexaoInativaByPacienteAndNomeCuidador = async function (idPaciente, nomeDoCuidador) {
    if (idPaciente == null || idPaciente == undefined || isNaN(idPaciente)){
        return messages.ERROR_INVALID_ID
    } else if(nomeDoCuidador == '' || nomeDoCuidador == undefined || !isNaN(nomeDoCuidador)) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let dadosConexaoJSON = {};

        let rsConexao = await conexaoDAO.selectInactiveConexaoByPacienteAndNomeCuidador(idPaciente, nomeDoCuidador)

        if (rsConexao ) {
            dadosConexaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosConexaoJSON.conexao = rsConexao
            return dadosConexaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getConexaoByPacienteAndCuidador = async function (idPaciente, idCuidador) {
    if (idPaciente == null || idPaciente == undefined || isNaN(idPaciente)){
        return messages.ERROR_INVALID_ID
    } else if(idCuidador == '' || idCuidador == undefined || isNaN(idCuidador)) {
        return messages.ERROR_INVALID_ID
    } else {
        let dadosConexaoJSON = {};

        let rsConexao = await conexaoDAO.selectActiveConexaoByPacienteAndCuidador(idPaciente, idCuidador)

        if (rsConexao ) {
            dadosConexaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosConexaoJSON.conexao = rsConexao
            return dadosConexaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getConexaoInativaByPacienteAndCuidador = async function (idPaciente, idCuidador) {
    if (idPaciente == null || idPaciente == undefined || isNaN(idPaciente)){
        return messages.ERROR_INVALID_ID
    } else if(idCuidador == '' || idCuidador == undefined || isNaN(idCuidador)) {
        return messages.ERROR_INVALID_ID
    } else {
        let dadosConexaoJSON = {};

        let rsConexao = await conexaoDAO.selectInactiveConexaoByPacienteAndCuidador(idPaciente, idCuidador)

        if (rsConexao ) {
            dadosConexaoJSON.status = messages.SUCCESS_REQUEST.status
            dadosConexaoJSON.conexao = rsConexao
            return dadosConexaoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const deactivateConnection = async function (idPaciente, idCuidador) {
    if (idPaciente == null || idPaciente == undefined || isNaN(idPaciente)) {
        return messages.ERROR_INVALID_PACIENTE
    } else if (idCuidador == null || idCuidador == undefined || isNaN(idCuidador)) {
        return messages.ERROR_INVALID_CUIDADOR
    } else {
            let verifyConnection = await conexaoDAO.selectActiveConexaoByPacienteAndCuidador(idPaciente, idCuidador)

            if (verifyConnection) {
                let resultDadosConexao = await conexaoDAO.desativarConexao(idPaciente, idCuidador)

                if (resultDadosConexao) {
                    let dadosConexaoJSON = {}
                    dadosConexaoJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                    dadosConexaoJSON.message = messages.SUCCESS_DEACTIVATED_CONNECTION.message

                    let dadosNotificacao = {
                        "nome":"Alguém se desvinculou da sua conta",
                        "descricao":`Um usuário se desvinculou a sua conta!`,
                        "id_cuidador":idCuidador,
                        "id_paciente":idPaciente
                    }
        
                    notificacaoDAO.insertNotificacao(dadosNotificacao)

                    return dadosConexaoJSON

                } else {
                    return messages.ERROR_INTERNAL_SERVER
                }
            } else {
                return messages.ERROR_CONNECTION_DOESNT_EXISTS
            }
    }
}

const activateConnection = async function (idPaciente, idCuidador) {
    if (idPaciente == null || idPaciente == undefined || isNaN(idPaciente)) {
        return messages.ERROR_INVALID_PACIENTE
    } else if (idCuidador == null || idCuidador == undefined || isNaN(idCuidador)) {
        return messages.ERROR_INVALID_CUIDADOR
    } else {
            let resultDadosConexao = await conexaoDAO.ativarConexao(idPaciente, idCuidador)

            if (resultDadosConexao) {
                let dadosConexaoJSON = {}
                dadosConexaoJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosConexaoJSON.message = messages.SUCCESS_ACTIVATED_CONNECTION.message

                let dadosNotificacao = {
                    "nome":"Alguém se conectou a sua conta",
                    "descricao":"Um usuário se conectou a sua conta!",
                    "id_cuidador":idCuidador,
                    "id_paciente":idPaciente
                }
    
                notificacaoDAO.insertNotificacao(dadosNotificacao)

                return dadosConexaoJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
    }
}

module.exports = {
    activateConnection,
    deactivateConnection,
    getConexaoByCuidador,
    getConexaoByCuidadorAndNomePaciente,
    getConexaoByID,
    getConexaoByPaciente,
    getConexaoByPacienteAndNomeCuidador,
    getConexoes,
    getConexaoInativaByCuidador,
    getConexaoInativaByCuidadorAndNomePaciente,
    getConexaoInativaByPaciente,
    getConexaoInativaByPacienteAndNomeCuidador,
    getConexaoByPacienteAndCuidador,
    getConexaoInativaByPacienteAndCuidador
}
