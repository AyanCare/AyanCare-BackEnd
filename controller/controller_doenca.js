/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados das DOENCA no Banco de Dados.
 * Data: 27/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

const doencaDAO = require('../model/DAO/doencaDAO.js')

const getDoencas = async function () {
    let dadosDoencaJSON = {}

    let dadosDoenca = await doencaDAO.selectAllDoencas()

    if (dadosDoenca) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosDoencaJSON.status = messages.SUCCESS_REQUEST.status
        dadosDoencaJSON.quantidade = dadosDoenca.length
        dadosDoencaJSON.doenca = dadosDoenca
        return dadosDoencaJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getDoencaByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosDoencaJSON = {};

        let dadosDoenca = await doencaDAO.selectDoencaById(id)

        if (dadosDoenca) {
            dadosDoencaJSON.status = messages.SUCCESS_REQUEST.status
            dadosDoencaJSON.doenca = dadosDoenca
            return dadosDoencaJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const insertDoenca = async function (dadosDoenca) {

    if (
        dadosDoenca.nome == '' || dadosDoenca.nome == undefined || dadosDoenca.nome > 80 ||
        dadosDoenca.grau == '' || dadosDoenca.grau == undefined || dadosDoenca.grau > 80 ||
        dadosDoenca.id_paciente == '' || dadosDoenca.id_paciente == undefined || isNaN(dadosDoenca.id_paciente)
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let verifyName = await doencaDAO.selectDoencaByNomeAndPaciente(dadosDoenca.nome, dadosDoenca.id_paciente)

        if (verifyName > 0) {
            return messages.ERROR_DISEASE_ALREADY_EXISTS
        } else {
            let resultDadosDoenca = await doencaDAO.insertDoenca(dadosDoenca)

            if (resultDadosDoenca) {
                let novoDoenca = await doencaDAO.selectLastId()

                dadosDoenca.id_doenca = novoDoenca.id

                let resultDadosDoencaPaciente = await doencaDAO.insertDoencaIntoPaciente(dadosDoenca)

                if (resultDadosDoencaPaciente) {
                    let dadosDoencaJSON = {}

                    dadosDoencaJSON.status = messages.SUCCESS_CREATED_ITEM.status
                    dadosDoencaJSON.doenca = novoDoenca

                    return dadosDoencaJSON
                } else {
                    return messages.ERROR_INTERNAL_SERVER
                }
            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        }
    }
}

const updateDoenca = async function (dadosDoenca, id) {
    if (
        dadosDoenca.nome == '' || dadosDoenca.nome == undefined || dadosDoenca.nome > 80 ||
        dadosDoenca.grau == '' || dadosDoenca.grau == undefined || dadosDoenca.grau > 80
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        dadosDoenca.id = id

        let atualizacaoDoenca = await doencaDAO.selectDoencaById(id)

        if (atualizacaoDoenca) {
            let resultDadosDoenca = await doencaDAO.updateDoenca(dadosDoenca)

            if (resultDadosDoenca) {
                let dadosDoencaJSON = {}
                dadosDoencaJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosDoencaJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosDoencaJSON.doenca = dadosDoenca

                return dadosDoencaJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const deleteDoenca = async function (id) {

    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdDoenca = await doencaDAO.selectDoencaById(id)

        if (searchIdDoenca) {

            let dadosDoencaPaciente = await doencaDAO.deleteDoencaOfPaciente(id)

            if (dadosDoencaPaciente) {
                let dadosDoenca = await doencaDAO.deleteDoenca(id)

                if (dadosDoenca) {
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
    deleteDoenca,
    getDoencaByID,
    getDoencas,
    insertDoenca,
    updateDoenca
}