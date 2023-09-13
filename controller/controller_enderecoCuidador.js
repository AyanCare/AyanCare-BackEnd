/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos EnderecoS no Banco de Dados.
 * Data: 11/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

const endereco_cuidadorDAO = require('../model/DAO/endereco_cuidadorDAO')

const getEnderecoByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosEnderecoJSON = {};

        let dadosEndereco = await endereco_cuidadorDAO.selectEnderecoById(id)

        if (dadosEndereco) {
            dadosEnderecoJSON.status = messages.SUCCESS_REQUEST.status
            dadosEnderecoJSON.Endereco = dadosEndereco
            return dadosEnderecoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

//logradouro varchar(80) not null,
//    bairro varchar(80) not null,
//    cep varchar(10) not null,
//    numero int not null,
//    id_cidade int not null,

const insertEndereco = async function (dadosEndereco) {

    if (
        dadosEndereco.logradouro == '' || dadosEndereco.logradouro == undefined || dadosEndereco.logradouro > 80 ||
        dadosEndereco.bairro == '' || dadosEndereco.bairro == undefined || dadosEndereco.bairro > 80 ||
        dadosEndereco.cep == '' || dadosEndereco.cep == undefined || dadosEndereco.cep > 10 ||
        dadosEndereco.numero == '' || dadosEndereco.numero == undefined || NaN(dadosEndereco.numero) ||
        dadosEndereco.cidade == '' || dadosEndereco.cidade == undefined || dadosEndereco.cidade > 80 ||
        dadosEndereco.estado == '' || dadosEndereco.estado == undefined || dadosEndereco.estado > 80
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let resultDadosEndereco = await endereco_cuidadorDAO.insertEndereco(dadosEndereco)

        if (resultDadosEndereco) {
            let novoEndereco = await endereco_cuidadorDAO.selectLastId()

            let dadosEnderecoJSON = {}
            dadosEnderecoJSON.status = messages.SUCCESS_CREATED_ITEM.status
            dadosEnderecoJSON.Endereco = novoEndereco

            return dadosEnderecoJSON
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const updateEndereco = async function (dadosEndereco, id) {
    if (
        dadosEndereco.logradouro == '' || dadosEndereco.logradouro == undefined || dadosEndereco.logradouro > 80 ||
        dadosEndereco.bairro == '' || dadosEndereco.bairro == undefined || dadosEndereco.bairro > 80 ||
        dadosEndereco.cep == '' || dadosEndereco.cep == undefined || dadosEndereco.cep > 10 ||
        dadosEndereco.numero == '' || dadosEndereco.numero == undefined || NaN(dadosEndereco.numero) ||
        dadosEndereco.cidade == '' || dadosEndereco.cidade == undefined || dadosEndereco.cidade > 80 ||
        dadosEndereco.estado == '' || dadosEndereco.estado == undefined || dadosEndereco.estado > 80
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        dadosEndereco.id = id

        let atualizacaoEndereco = await endereco_cuidadorDAO.selectEnderecoById(id)

        if (atualizacaoEndereco) {
            let resultDadosEndereco = await endereco_cuidadorDAO.updateEndereco(dadosEndereco)

            if (resultDadosEndereco) {
                let dadosEnderecoJSON = {}
                dadosEnderecoJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosEnderecoJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosEnderecoJSON.Endereco = dadosEndereco

                return dadosEnderecoJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

module.exports = {
    insertEndereco,
    updateEndereco,
    getEnderecoByID
}