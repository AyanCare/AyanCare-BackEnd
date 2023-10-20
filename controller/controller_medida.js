/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados das MEDIDAS no Banco de Dados.
 * Data: 19/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

const medidaDAO = require('../model/DAO/medidaDAO.js')

const getMedidas = async function () {
    let dadosMedidasJSON = {}

    let dadosMedidas = await medidaDAO.selectAllMedidas()

    if (dadosMedidas) {
        dadosMedidasJSON.status = messages.SUCCESS_REQUEST.status
        dadosMedidasJSON.quantidade = dadosMedidas.length
        dadosMedidasJSON.medidas = dadosMedidas
        return dadosMedidasJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getMedidaByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosMedidaJSON = {};

        let dadosMedida = await medidaDAO.selectMedidaById(id)

        if (dadosMedida) {
            dadosMedidaJSON.status = messages.SUCCESS_REQUEST.status
            dadosMedidaJSON.medida = dadosMedida
            return dadosMedidaJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

module.exports = {
    getMedidaByID,
    getMedidas
}
