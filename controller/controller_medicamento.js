/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos MEDICAMENTOS no Banco de Dados.
 * Data: 06/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

const medicamentoDAO = require('../model/DAO/medicamentoDAO.js')

const getMedicamentos = async function () {
    let dadosMedicamentosJSON = {}

    let dadosMedicamentos = await medicamentoDAO.selectAllMedicamentos()

    if (dadosMedicamentos) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosMedicamentosJSON.status = messages.SUCCESS_REQUEST.status
        dadosMedicamentosJSON.quantidade = dadosMedicamentos.length
        dadosMedicamentosJSON.medicamentos = dadosMedicamentos
        return dadosMedicamentosJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getMedicamentoByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosMedicamentoJSON = {};

        let dadosMedicamento = await medicamentoDAO.selectMedicamentoById(id)

        if (dadosMedicamento) {
            dadosMedicamentoJSON.status = messages.SUCCESS_REQUEST.status
            dadosMedicamentoJSON.medicamento = dadosMedicamento
            return dadosMedicamentoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

// '${dadosMedicamento.nome}'
//         '${dadosMedicamento.quantidade}',
//         '${dadosMedicamento.data_validade}',
//         '${dadosMedicamento.estocado}',
//         ${dadosMedicamento.id_paciente},
//         ${dadosMedicamento.id_medida}

const insertMedicamento = async function (dadosMedicamento) {

    if (
        dadosMedicamento.nome == '' || dadosMedicamento.nome == undefined || dadosMedicamento.nome > 80 ||
        dadosMedicamento.data_validade == '' || dadosMedicamento.data_validade == undefined ||
        dadosMedicamento.estocado == '' || dadosMedicamento.estocado == undefined ||
        dadosMedicamento.quantidade == '' || dadosMedicamento.quantidade == undefined || NaN(dadosMedicamento.quantidade) ||
        dadosMedicamento.id_paciente == '' || dadosMedicamento.id_paciente == undefined ||
        dadosMedicamento.id_medida == '' || dadosMedicamento.id_medida == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let resultDadosMedicamento = await medicamentoDAO.insertMedicamento(dadosMedicamento)

        if (resultDadosMedicamento) {
            let novoMedicamento = await medicamentoDAO.selectLastId()

            let dadosMedicamentoJSON = {}
            dadosMedicamentoJSON.status = messages.SUCCESS_CREATED_ITEM.status
            dadosMedicamentoJSON.medicamento = novoMedicamento

            return dadosMedicamentoJSON
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const updateMedicamento = async function (dadosMedicamento, id) {
    if (
        dadosMedicamento.nome == '' || dadosMedicamento.nome == undefined || dadosMedicamento.nome > 80 ||
        dadosMedicamento.data_validade == '' || dadosMedicamento.data_validade == undefined ||
        dadosMedicamento.estocado == '' || dadosMedicamento.estocado == undefined ||
        dadosMedicamento.quantidade == '' || dadosMedicamento.quantidade == undefined || NaN(dadosMedicamento.quantidade) ||
        dadosMedicamento.id_paciente == '' || dadosMedicamento.id_paciente == undefined ||
        dadosMedicamento.id_medida == '' || dadosMedicamento.id_medida == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        dadosMedicamento.id = id

        let atualizacaoMedicamento = await medicamentoDAO.selectMedicamentoById(id)

        if (atualizacaoMedicamento) {
            let resultDadosMedicamento = await medicamentoDAO.updateMedicamento(dadosMedicamento)

            if (resultDadosMedicamento) {
                let dadosMedicamentoJSON = {}
                dadosMedicamentoJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosMedicamentoJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosMedicamentoJSON.medicamento = dadosMedicamento

                return dadosMedicamentoJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const deleteMedicamento = async function (id) {

    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdMedicamento = await medicamentoDAO.selectMedicamentoById(id)

        if (searchIdMedicamento) {
            let dadosMedicamento = await medicamentoDAO.deleteMedicamento(id)

            if (dadosMedicamento) {
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
    getMedicamentos,
    insertMedicamento,
    updateMedicamento,
    deleteMedicamento,
    getMedicamentoByID
}