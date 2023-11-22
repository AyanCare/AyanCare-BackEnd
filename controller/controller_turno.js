/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Turnos no Banco de Dados.
 * Data: 22/11/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')
const turnoDAO = require('../model/DAO/turnoDAO.js')
const conexaoDAO = require('../model/DAO/conexaoDAO.js')

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

const getTurnoByConexao = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosTurnoJSON = {};

        let dadosTurno = await turnoDAO.selectTurnoById(id)

        if (dadosTurno) {
            dadosTurnoJSON.status = messages.SUCCESS_REQUEST.status
            dadosTurnoJSON.turno = dadosTurno
            return dadosTurnoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getTurnoByCuidador = async function (dadosTurno) {
    if (dadosTurno.email == '' || dadosTurno.email == undefined ||
        dadosTurno.senha == '' || dadosTurno.senha == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {

        let dadosTurnoJSON = {};

        let rsTurno = await turnoDAO.selectTurnoByEmailAndSenhaAndNome(dadosTurno)

        if (rsTurno) {
            let tokenUser = await jwt.createJWT(rsTurno.id)
            dadosTurnoJSON.token = tokenUser
            dadosTurnoJSON.status = messages.SUCCESS_REQUEST.status
            dadosTurnoJSON.turno = rsTurno
            return dadosTurnoJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getTurnoByPaciente = async function (emailTurno) {
    if (emailTurno == '' || emailTurno == undefined) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {

        let dadosTurnoJSON = {};

        let rsTurno = await turnoDAO.selectTurnoByEmail(emailTurno)

        if (rsTurno) {
            dadosTurnoJSON.status = messages.SUCCESS_REQUEST.status
            dadosTurnoJSON.turno = rsTurno[0]
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

        console.log(dadosTurnoReal);

        let resultDadosTurno = await turnoDAO.insertTurno(dadosTurnoReal)

        if (resultDadosTurno) {
            let novoTurno = await turnoDAO.selectLastId()

            let dadosTurnoJSON = {}
            dadosTurnoJSON.status = messages.SUCCESS_CREATED_ITEM.status
            dadosTurnoJSON.turno = novoTurno

            return dadosTurnoJSON
        } else {
            return messages.ERROR_INTERNAL_SERVER
        }
    }
}

const deleteTurno = async function (idConexao) {

    if (idConexao == null || idConexao == undefined || idConexao == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdTurno = await conexaoDAO.selectConexaoById(idConexao)

        if (searchIdTurno) {
            let dadosTurno = await turnoDAO.deleteTurno(id)

            if (dadosTurno) {
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