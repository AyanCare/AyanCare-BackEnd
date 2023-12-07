/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Responsavel no Banco de Dados.
 * Data: 05/10/2023
 * Autor:Gustavo Souza Tenorio de Barros
 * Versão: 1.0
 **************************************************************************************/


const message = require('./modules/config.js')

const relatorioDAO = require('../model/DAO/relatorioDAO.js')
const notificacaoDAO = require('../model/DAO/notificacaoDAO.js')
const jwt = require('../middleware/middlewareJWT.js')

/************************** GET ******************************/
const getRelatorios = async function () {

    let dadosRelatorioJSON = {}

    let dadosRelatorios = await relatorioDAO.selectAllRelatorios()

    if (dadosRelatorios) {

        dadosRelatorioJSON.status = message.SUCCESS_REQUEST.status
        dadosRelatorioJSON.quantidade = dadosRelatorios.length
        dadosRelatorioJSON.relatorios = dadosRelatorios
        return dadosRelatorioJSON

    } else {

        return message.ERROR_INTERNAL_SERVER
    }
}

const getRelatorioByID = async function (id) {

    if (id == '' || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosRelatorioJSON = {}

        let dadosRelatorio = await relatorioDAO.selectByIDRelatorio(id)

        if (dadosRelatorio) {
            dadosRelatorioJSON.status = message.SUCCESS_REQUEST.status
            dadosRelatorioJSON.relatorio = dadosRelatorio
            return dadosRelatorioJSON
        } else {

            return message.ERROR_NOT_FOUND

        }


    }
}

const getRelatorioByIDPaciente = async function (idPaciente) {

    if (idPaciente == '' || idPaciente == undefined || isNaN(idPaciente)) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosRelatorioJSON = {}

        let dadosRelatorio = await relatorioDAO.selectByIDPaciente(idPaciente)

        if (dadosRelatorio) {
            dadosRelatorioJSON.status = message.SUCCESS_REQUEST.status
            dadosRelatorioJSON.relatorio = dadosRelatorio
            return dadosRelatorioJSON
        } else {

            return message.ERROR_NOT_FOUND

        }


    }
}

const getRelatorioByNomePaciente = async function (paciente) {

    if (paciente == '' || paciente == undefined) {
        return message.ERROR_REQUIRED_FIELDS
    } else {

        let dadosRelatorioJSON = {}

        let dadosRelatorio = await relatorioDAO.selectByNomePaciente(paciente)

        if (dadosRelatorio) {
            dadosRelatorioJSON.status = message.SUCCESS_REQUEST.status
            dadosRelatorioJSON.relatorio = dadosRelatorio
            return dadosRelatorioJSON
        } else {

            return message.ERROR_NOT_FOUND

        }


    }
}


const getRelatorioByIDCuidador = async function (idCuidador) {

    if (idCuidador == '' || idCuidador == undefined || isNaN(idCuidador)) {
        return message.ERROR_INVALID_ID
    } else {

        let dadosRelatorioJSON = {}

        let dadosRelatorio = await relatorioDAO.selectByIDCuidador(idCuidador)

        if (dadosRelatorio) {
            dadosRelatorioJSON.status = message.SUCCESS_REQUEST.status
            dadosRelatorioJSON.relatorio = dadosRelatorio
            return dadosRelatorioJSON
        } else {

            return message.ERROR_NOT_FOUND

        }


    }
}

const getRelatorioByIDCuidadorAndPaciente = async function (idCuidador, idPaciente) {

    if (idCuidador == '' || idCuidador == undefined || isNaN(idCuidador)) {
        return message.ERROR_INVALID_CUIDADOR
    } else if (idPaciente == '' || idPaciente == undefined || isNaN(idPaciente)) {
        return message.ERROR_INVALID_PACIENTE
    } else {
        let dadosRelatorioJSON = {}

        let dadosRelatorio = await relatorioDAO.selectByIDCuidadorAndPaciente(idCuidador, idPaciente)

        if (dadosRelatorio) {
            dadosRelatorioJSON.status = message.SUCCESS_REQUEST.status
            dadosRelatorioJSON.relatorio = dadosRelatorio
            return dadosRelatorioJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    }
}

const getRelatorioByIDCuidadorAndPacienteAndData = async function (idCuidador, idPaciente, data) {

    if (idCuidador == '' || idCuidador == undefined || isNaN(idCuidador)) {
        return message.ERROR_INVALID_CUIDADOR
    } else if (idPaciente == '' || idPaciente == undefined || isNaN(idPaciente)) {
        return message.ERROR_INVALID_PACIENTE
    } else if (data == '' || data == undefined) {
        return message.ERROR_REQUIRED_FIELDS
    } else {
        let dadosRelatorioJSON = {}

        let dadosRelatorio = await relatorioDAO.selectByData(idCuidador, idPaciente, data)

        if (dadosRelatorio) {
            dadosRelatorioJSON.status = message.SUCCESS_REQUEST.status
            dadosRelatorioJSON.relatorio = dadosRelatorio
            return dadosRelatorioJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    }
}

const getAllDatas = async function (idCuidador, idPaciente) {
    if (idCuidador == '' || idCuidador == undefined || isNaN(idCuidador)) {
        return message.ERROR_INVALID_CUIDADOR
    } else if (idPaciente == '' || idPaciente == undefined || isNaN(idPaciente)) {
        return message.ERROR_INVALID_PACIENTE
    } else {
        let dadosRelatorioJSON = {}

        let dadosRelatorio = await relatorioDAO.selectAllDatas(idCuidador, idPaciente)

        if (dadosRelatorio) {
            dadosRelatorioJSON.status = message.SUCCESS_REQUEST.status
            dadosRelatorioJSON.relatorio = dadosRelatorio
            return dadosRelatorioJSON
        } else {
            return message.ERROR_NOT_FOUND
        }
    }
}

/************************** Inserte ******************************/

const insertRelatorio = async function (dadosRelatorio) {
    if (
        dadosRelatorio.texto_relatorio == '' || dadosRelatorio.texto_relatorio == undefined ||
        dadosRelatorio.validacao == '' || dadosRelatorio.validacao == undefined ||
        dadosRelatorio.id_paciente == '' || dadosRelatorio.id_paciente == undefined || isNaN(dadosRelatorio.id_paciente) ||
        dadosRelatorio.id_cuidador == '' || dadosRelatorio.id_cuidador == undefined || isNaN(dadosRelatorio.id_cuidador)
    ) {

        return message.ERROR_REQUIRED_FIELDS
    } else {

        let resultDadosRelatorio = await relatorioDAO.insertRelatorio(dadosRelatorio)

        if (resultDadosRelatorio) {
            let novoRelatorio = await relatorioDAO.selectLastId()

            let dadosRelatorioJSON = {}

            dadosRelatorioJSON.status = message.SUCCESS_CREATED_ITEM.status
            dadosRelatorioJSON.relatorio = novoRelatorio

            let dadosNotificacao = {
                "nome":"Um relatório foi inserido",
                "descricao":`O cuidador ${novoRelatorio.cuidador} escreveu um relatório sobre o dia!`,
                "id_cuidador":dadosRelatorio.id_cuidador,
                "id_paciente":dadosRelatorio.id_paciente
            }

            notificacaoDAO.insertNotificacao(dadosNotificacao)

            return dadosRelatorioJSON
        } else {
            return message.ERROR_INTERNAL_SERVER
        }
    }

}


/************************** update ******************************/

const updateRelatorio = async function (dadosRelatorio, id) {

    if (
        dadosRelatorio.texto_relatorio == '' || dadosRelatorio.texto_relatorio == undefined ||
        dadosRelatorio.validacao == '' || dadosRelatorio.validacao == undefined ||
        dadosRelatorio.id_paciente === '' || dadosRelatorio.id_paciente === undefined || isNaN(dadosRelatorio.id_paciente) ||
        dadosRelatorio.id_cuidador === '' || dadosRelatorio.id_cuidador === undefined || isNaN(dadosRelatorio.id_cuidador)

    ) {
        return message.ERROR_REQUIRED_FIELDS

    } else if (id == null || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID
    } else {
        dadosRelatorio.id = id

        let atualizarDadosRelatorio = await relatorioDAO.selectByIDRelatorio(id)

        if (atualizarDadosRelatorio) {
            let resultDadosRelatorio = await relatorioDAO.updateRelatorio(dadosRelatorio)

            if (resultDadosRelatorio) {

                let atualizarRelatorio = await relatorioDAO.selectLastId()

                let dadosRelatorioJSON = {}

                dadosRelatorioJSON.status = message.SUCCESS_UPDATED_ITEM.status
                dadosRelatorioJSON.message = message.SUCCESS_UPDATED_ITEM.message
                dadosRelatorioJSON.relatorio = dadosRelatorio

                return dadosRelatorioJSON
            } else {
                return message.ERROR_INTERNAL_SERVER
            }
        } else {
            return message.ERROR_INVALID_ID
        }
    }
}


/************************** Delete ******************************/

const deleteRelatorio = async function (id) {

    if (id == null || id == undefined || isNaN(id)) {
        return message.ERROR_INVALID_ID
    } else {

        let searchIdRelatorio = await relatorioDAO.selectLastId(id)

        if (searchIdRelatorio) {
            let deletarDadosRelatorio = await relatorioDAO.deleteRelatorio(id)



            if (deletarDadosRelatorio) {
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
    getRelatorios,
    getRelatorioByID,
    getRelatorioByIDCuidador,
    getRelatorioByIDPaciente,
    insertRelatorio,
    updateRelatorio,
    deleteRelatorio,
    getAllDatas,
    getRelatorioByIDCuidadorAndPaciente,
    getRelatorioByIDCuidadorAndPacienteAndData,
    getRelatorioByNomePaciente
}
