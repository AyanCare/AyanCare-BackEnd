/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Eventos Únicos no Banco de Dados.
 * Data: 11/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

const eventoDAO = require('../model/DAO/eventoDAO.js')

const converterMes = function (numeroMes) {
    let mes = numeroMes;

    switch (mes) {
        case 1:
            mes = 'Janeiro'
            break;

        case 2:
            mes = 'Fevereiro'
            break;

        case 3:
            mes = 'Março'
            break;

        case 4:
            mes = 'Abril'
            break;

        case 5:
            mes = 'Maio'
            break;

        case 6:
            mes = 'Junho'
            break;

        case 7:
            mes = 'Julho'
            break;

        case 8:
            mes = 'Agosto'
            break;

        case 9:
            mes = 'Setembro'
            break;

        case 10:
            mes = 'Outubro'
            break;

        case 11:
            mes = 'Novembro'
            break;

        case 12:
            mes = 'Dezembro'
            break;
    }
    return mes;
}



const getAllEventos = async function(){
    let dadosEventoJSON = {};

        let dadosEvento = await eventoDAO.selectAllEventos()

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

        let dadosEvento = await eventoDAO.selectEventoById(id)

        if (dadosEvento) {
            dadosEventoJSON.status = messages.SUCCESS_REQUEST.status
            dadosEvento.mes = converterMes(dadosEvento.mes)
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

        let dadosEvento = await eventoDAO.selectEventoByPaciente(idPaciente)

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

        let dadosEvento = await eventoDAO.selectEventoByCuidador(idCuidador)

        if (dadosEvento) {
            dadosEventoJSON.status = messages.SUCCESS_REQUEST.status
            dadosEventoJSON.evento = dadosEvento
            return dadosEventoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

// '${dadosEvento.nome}',
//         '${dadosEvento.descricao}',
//         '${dadosEvento.local}',
//         '${dadosEvento.hora}',
//         ${dadosEvento.id_paciente_cuidador},
//         1,
//         ${dadosEvento.domingo},
//         2,
//         ${dadosEvento.segunda},
//         3,
//         ${dadosEvento.terca},
//         4,
//         ${dadosEvento.quarta},
//         5,
//         ${dadosEvento.quinta},
//         6,
//         ${dadosEvento.sexta},
//         7,
//         ${dadosEvento.domingo}

const insertEvento = async function (dadosEvento) {
    if (
        dadosEvento.nome == '' || dadosEvento.nome == undefined || dadosEvento.nome > 200 ||
        dadosEvento.descricao == '' || dadosEvento.descricao == undefined ||
        dadosEvento.local == '' || dadosEvento.local == undefined || dadosEvento.local > 255 ||
        dadosEvento.hora == '' || dadosEvento.hora == undefined ||
        dadosEvento.dia == '' || dadosEvento.dia == undefined ||
        dadosEvento.idPaciente == '' || dadosEvento.idPaciente == undefined || isNaN(dadosEvento.idPaciente)
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let resultDadosEvento = await eventoDAO.insertEvento(dadosEvento)

        if (resultDadosEvento) {
            let novoEvento = await eventoDAO.selectLastId()

            await eventoDAO.insertPacienteIntoEvento(dadosEvento.idPaciente, novoEvento.id)
            
            if (dadosEvento.idCuidador != undefined) {
                await eventoDAO.insertCuidadorIntoEvento(dadosEvento.idCuidador, novoEvento.id)
            }

            let eventoCriado = await eventoDAO.selectEventoById(novoEvento.id)

            let dadosEventoJSON = {}
            dadosEventoJSON.status = messages.SUCCESS_CREATED_ITEM.status
            dadosEventoJSON.evento = eventoCriado

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
        dadosEvento.dia == '' || dadosEvento.dia == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        dadosEvento.id = id

        let atualizacaoEvento = await eventoDAO.selectEventoById(id)

        if (atualizacaoEvento) {
            let resultDadosEvento = await eventoDAO.updateEvento(dadosEvento)

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

        let searchIdEvento = await eventoDAO.selectEventoById(id)

        if (searchIdEvento) {
            let dadosEvento = await eventoDAO.deleteEvento(id)

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