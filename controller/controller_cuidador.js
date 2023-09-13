/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos CUIDADORES no Banco de Dados.
 * Data: 11/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

const cuidadorDAO = require('../model/DAO/cuidadorDAO.js')

const getCuidadores = async function () {
    let dadosCuidadoresJSON = {}

    let dadosCuidadores = await cuidadorDAO.selectAllCuidadores()

    if (dadosCuidadores) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosCuidadoresJSON.status = messages.SUCCESS_REQUEST.status
        dadosCuidadoresJSON.quantidade = dadosCuidadores.length
        dadosCuidadoresJSON.cuidadors = dadosCuidadores
        return dadosCuidadoresJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getCuidadorByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosCuidadorJSON = {};

        let dadosCuidador = await cuidadorDAO.selectCuidadorById(id)

        if (dadosCuidador) {
            dadosCuidadorJSON.status = messages.SUCCESS_REQUEST.status
            dadosCuidadorJSON.cuidador = dadosCuidador
            return dadosCuidadorJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getCuidadorByEmailAndSenha = async function (dadosCuidador) {
    if (dadosCuidador.email == '' || dadosCuidador.email == undefined ||
        dadosCuidador.senha == '' || dadosCuidador.senha == undefined) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {

        let dadosCuidadorJSON = {};

        let rsCuidador = await pacienteDAO.selectPacienteByEmailAndSenha(dadosCuidador)

        if (rsCuidador) {
            let tokenUser = await jwt.createJWT(rsCuidador[0].id)

            dadosCuidadorJSON.token = tokenUser
            dadosCuidadorJSON.status = messages.SUCCESS_REQUEST.status
            dadosCuidadorJSON.paciente = rsCuidador
            return dadosCuidadorJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const insertCuidador = async function (dadosCuidador) {

    if (
        dadosCuidador.nome == '' || dadosCuidador.nome == undefined || dadosCuidador.nome > 80 ||
        dadosCuidador.data_nascimento == '' || dadosCuidador.data_nascimento == undefined ||
        dadosCuidador.email == '' || dadosCuidador.email == undefined || dadosCuidador.email > 255 ||
        dadosCuidador.senha == '' || dadosCuidador.senha == undefined || dadosCuidador.senha > 255 ||
        dadosCuidador.id_endereco_cuidador == '' || dadosCuidador.id_endereco_cuidador == undefined ||
        dadosCuidador.id_genero == '' || dadosCuidador.id_genero == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let resultDadosCuidador = await cuidadorDAO.insertCuidador(dadosCuidador)

        if (resultDadosCuidador) {
            let novoCuidador = await cuidadorDAO.selectLastId()

            let dadosCuidadorJSON = {}

            let tokenUser = await jwt.createJWT(novoCuidador[0].id)

            dadosCuidadorJSON.token = tokenUser
            dadosCuidadorJSON.status = messages.SUCCESS_CREATED_ITEM.status
            dadosCuidadorJSON.cuidador = novoCuidador

            return dadosCuidadorJSON
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const updateCuidador = async function (dadosCuidador, id) {
    if (
        dadosCuidador.nome == '' || dadosCuidador.nome == undefined || dadosCuidador.nome > 80 ||
        dadosCuidador.data_nascimento == '' || dadosCuidador.data_nascimento == undefined ||
        dadosCuidador.email == '' || dadosCuidador.email == undefined || dadosCuidador.email > 255 ||
        dadosCuidador.senha == '' || dadosCuidador.senha == undefined || dadosCuidador.senha > 255 ||
        dadosCuidador.id_endereco_cuidador == '' || dadosCuidador.id_endereco_cuidador == undefined ||
        dadosCuidador.id_genero == '' || dadosCuidador.id_genero == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        dadosCuidador.id = id

        let atualizacaoCuidador = await cuidadorDAO.selectCuidadorById(id)

        if (atualizacaoCuidador) {
            let resultDadosCuidador = await cuidadorDAO.updateCuidador(dadosCuidador)

            if (resultDadosCuidador) {
                let dadosCuidadorJSON = {}
                dadosCuidadorJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosCuidadorJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosCuidadorJSON.cuidador = dadosCuidador

                return dadosCuidadorJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const deleteCuidador = async function (id) {

    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdCuidador = await cuidadorDAO.selectCuidadorById(id)

        if (searchIdCuidador) {
            let dadosCuidador = await cuidadorDAO.deleteCuidador(id)

            if (dadosCuidador) {
                return messages.SUCCESS_DELETED_ITEM
            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else{
            return messages.ERROR_INVALID_ID
        }
    }

}

module.exports = {
    getCuidadores,
    insertCuidador,
    updateCuidador,
    deleteCuidador,
    getCuidadorByID,
    getCuidadorByEmailAndSenha
}