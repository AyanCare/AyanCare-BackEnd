/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Turnos no Banco de Dados.
 * Data: 22/11/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')
const turnoDAO = require('../model/DAO/turnoDAO.js')
const notificacaoDAO = require('../model/DAO/notificacaoDAO.js')

var dadosTurnoReal = {
    horario_comeco: "",
    horario_fim: "",
    idCor: 0,
    idConexao: 0,
    domingo: false,
    segunda: false,
    terca: false,
    quarta: false,
    quinta: false,
    sexta: false,
    sabado: false,
}

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

const getTurnos = async function () {
    let dadosTurnosJSON = {}

    let dadosTurnos = await turnoDAO.selectAllTurnos()

    if (dadosTurnos) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosTurnosJSON.status = messages.SUCCESS_REQUEST.status
        dadosTurnosJSON.quantidade = dadosTurnos.length
        dadosTurnosJSON.turnos = dadosTurnos
        return dadosTurnosJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getTurnoByConexao = async function (idConexao) {
    if (idConexao == '' || isNaN(idConexao) || idConexao == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosTurnoJSON = {};

        let dadosTurno = await turnoDAO.selectTurnoByConexao(idConexao)

        if (dadosTurno) {
            dadosTurnoJSON.status = messages.SUCCESS_REQUEST.status
            dadosTurnoJSON.turno = dadosTurno
            return dadosTurnoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getTurnoByCuidador = async function (idCuidador) {
    if (idCuidador == '' || idCuidador == undefined || isNaN(idCuidador)) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {

        let dadosTurnoJSON = {};

        let rsTurno = await turnoDAO.selectTurnoByCuidador(idCuidador)

        if (rsTurno) {
            dadosTurnoJSON.status = messages.SUCCESS_REQUEST.status
            dadosTurnoJSON.turno = rsTurno
            return dadosTurnoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getTurnoByPaciente = async function (idPaciente) {
    if (idPaciente == '' || idPaciente == undefined || isNaN(idPaciente)) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let dadosTurnoJSON = {};

        let rsTurno = await turnoDAO.selectTurnoByPaciente(idPaciente)

        if (rsTurno) {
            dadosTurnoJSON.status = messages.SUCCESS_REQUEST.status
            dadosTurnoJSON.turno = rsTurno
            return dadosTurnoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const insertTurno = async function (dadosTurno) {

    if (
        dadosTurno.horario_comeco == '' || dadosTurno.horario_comeco == undefined ||
        dadosTurno.horario_fim == '' || dadosTurno.horario_fim == undefined ||
        dadosTurno.idConexao == '' || dadosTurno.idConexao == undefined || isNaN(dadosTurno.idConexao)
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        dadosTurnoReal.horario_comeco = dadosTurno.horario_comeco
        dadosTurnoReal.horario_fim = dadosTurno.horario_fim
        dadosTurnoReal.idCor = dadosTurno.idCor
        dadosTurnoReal.idConexao = dadosTurno.idConexao
        dadosTurno.dias.forEach(dia => {
            escolhaCorrigida = removerAcentos(dia)

            dadosTurnoReal[`${escolhaCorrigida}`] = true
        });

        let resultDadosTurno = await turnoDAO.insertTurno(dadosTurnoReal)

        if (resultDadosTurno) {
            let novoTurno = await turnoDAO.selectLastId()

            console.log(novoTurno);

            let dadosTurnoJSON = {}
            dadosTurnoJSON.status = messages.SUCCESS_CREATED_ITEM.status
            dadosTurnoJSON.turno = novoTurno

            let dadosNotificacao = {
                "nome":"Turno inserido",
                "descricao":`Uma nova rotina de turnos que envolve o Paciente ${novoTurno.paciente} e o Cuidador ${novoTurno.cuidador} foi criado!`,
                "id_cuidador":novoTurno.id_cuidador,
                "id_paciente":novoTurno.id_paciente
            }

            notificacaoDAO.insertNotificacao(dadosNotificacao)

            return dadosTurnoJSON
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const deleteTurno = async function (idConexao) {

    if (idConexao == null || idConexao == undefined || idConexao == '' || isNaN(idConexao)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdTurno = await turnoDAO.selectTurnoByConexao(idConexao)

        if (searchIdTurno) {
            let dadosTurno = await turnoDAO.deleteTurno(idConexao)

            if (dadosTurno) {
                let dadosNotificacao = {
                    "nome":"Turno deletado",
                    "descricao":`Uma rotina de turnos que envolvia o Paciente ${searchIdTurno.paciente} e o Cuidador ${searchIdTurno.cuidador} foi apagada!`,
                    "id_cuidador":searchIdTurno.id_cuidador,
                    "id_paciente":searchIdTurno.id_paciente
                }
    
                notificacaoDAO.insertNotificacao(dadosNotificacao)

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
    deleteTurno,
    getTurnoByConexao,
    getTurnoByCuidador,
    getTurnoByPaciente,
    getTurnos,
    insertTurno
}
