/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Eventos Recorrentes no Banco de Dados.
 * Data: 11/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

var dadosEventoReal = {}

const criadorDeDadosParaInsert = function (){
    dadosEventoReal.nome = ""
    dadosEventoReal.descricao = ""
    dadosEventoReal.local = ""
    dadosEventoReal.hora = ""
    dadosEventoReal.cor_id = 0
    dadosEventoReal.id_paciente_cuidador = 0
    dadosEventoReal.domingo = false
    dadosEventoReal.segunda = false
    dadosEventoReal.terca = false
    dadosEventoReal.quarta = false
    dadosEventoReal.quinta = false
    dadosEventoReal.sexta = false
    dadosEventoReal.sabado = false
}

criadorDeDadosParaInsert()

const removerAcentos = function (string) {
    const acentos = {
        'á': 'a', 'à': 'a', 'â': 'a', 'ã': 'a',
        'é': 'e', 'è': 'e', 'ê': 'e',
        'í': 'i', 'ì': 'i', 'î': 'i',
        'ó': 'o', 'ò': 'o', 'ô': 'o', 'õ': 'o',
        'ú': 'u', 'ù': 'u', 'û': 'u',
        'ç': 'c'
      };
    
    stringConcertada = string.replace(/[áàâãéèêíìîóòôõúùûç]/g, equivalente => acentos[equivalente] || equivalente)
    return (stringConcertada.toLowerCase()).replace(' ', '')
}

const evento_semanalDAO = require('../model/DAO/evento_semanalDAO.js')

const getAllEventos = async function(){
    let dadosEventoJSON = {};

        let dadosEvento = await evento_semanalDAO.selectAllEventos()

        if (dadosEvento) {
            dadosEventoJSON.status = messages.SUCCESS_REQUEST.status
            dadosEventoJSON.evento = dadosEvento
            return dadosEventoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
}

const getEventoByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosEventoJSON = {};

        let dadosEvento = await evento_semanalDAO.selectEventoById(id)

        if (dadosEvento) {
            dadosEventoJSON.status = messages.SUCCESS_REQUEST.status
            dadosEventoJSON.evento = dadosEvento
            return dadosEventoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getEventoByPaciente = async function (idPaciente) {
    if (idPaciente == '' || isNaN(idPaciente) || idPaciente == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosEventoJSON = {};

        let dadosEvento = await evento_semanalDAO.selectEventoByPaciente(idPaciente)

        if (dadosEvento) {
            dadosEventoJSON.status = messages.SUCCESS_REQUEST.status
            dadosEventoJSON.evento = dadosEvento
            return dadosEventoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getEventoByCuidador = async function (idCuidador) {
    if (idCuidador == '' || isNaN(idCuidador) || idCuidador == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosEventoJSON = {};

        let dadosEvento = await evento_semanalDAO.selectEventoByCuidador(idCuidador)

        if (dadosEvento) {
            dadosEventoJSON.status = messages.SUCCESS_REQUEST.status
            dadosEventoJSON.evento = dadosEvento
            return dadosEventoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const insertEvento = async function (dadosEvento) {

    if (
        dadosEvento.nome == '' || dadosEvento.nome == undefined || dadosEvento.nome > 200 ||
        dadosEvento.descricao == '' || dadosEvento.descricao == undefined ||
        dadosEvento.local == '' || dadosEvento.local == undefined || dadosEvento.local > 255 ||
        dadosEvento.hora == '' || dadosEvento.hora == undefined ||
        dadosEvento.id_paciente_cuidador == '' || dadosEvento.id_paciente_cuidador == undefined || isNaN(dadosEvento.id_paciente_cuidador)
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        dadosEventoReal.nome = dadosEvento.nome
        dadosEventoReal.descricao = dadosEvento.descricao
        dadosEventoReal.local = dadosEvento.local
        dadosEventoReal.hora = dadosEvento.hora
        dadosEventoReal.cor_id = dadosEvento.cor_id
        dadosEventoReal.id_paciente_cuidador = dadosEvento.id_paciente_cuidador
        dadosEvento.dias.forEach(dia => {
            escolhaCorrigida = removerAcentos(dia)

            dadosEventoReal[`${escolhaCorrigida}`] = true
        });

        console.log(dadosEventoReal);

        let resultDadosEvento = await evento_semanalDAO.insertEvento(dadosEventoReal)

        if (resultDadosEvento) {
            let novoEvento = await evento_semanalDAO.selectLastId()

            let dadosEventoJSON = {}
            dadosEventoJSON.status = messages.SUCCESS_CREATED_ITEM.status
            dadosEventoJSON.evento = novoEvento

            return dadosEventoJSON
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const updateEvento = async function (dadosEvento, id) {
    if (
        dadosEvento.nome == '' || dadosEvento.nome == undefined || dadosEvento.nome > 200 ||
        dadosEvento.descricao == '' || dadosEvento.descricao == undefined ||
        dadosEvento.local == '' || dadosEvento.local == undefined || dadosEvento.local > 255 ||
        dadosEvento.hora == '' || dadosEvento.hora == undefined ||
        dadosEvento.id_paciente_cuidador == '' || dadosEvento.id_paciente_cuidador == undefined || isNaN(dadosEvento.id_paciente_cuidador)
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        dadosEvento.id = id

        let atualizacaoEvento = await evento_semanalDAO.selectEventoById(id)

        if (atualizacaoEvento) {
            let resultDadosEvento = await evento_semanalDAO.updateEvento(dadosEvento)

            if (resultDadosEvento) {
                let dadosEventoJSON = {}
                dadosEventoJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosEventoJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosEventoJSON.evento = dadosEvento

                return dadosEventoJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const deleteEvento = async function (id) {

    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdEvento = await evento_semanalDAO.selectEventoById(id)

        if (searchIdEvento) {
            let dadosEvento = await evento_semanalDAO.deleteEvento(id)

            if (dadosEvento) {
                return messages.SUCCESS_DELETED_ITEM
            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }

}

module.exports = {
    deleteEvento,
    getEventoByID,
    insertEvento,
    updateEvento,
    getAllEventos,
    getEventoByCuidador,
    getEventoByPaciente
}