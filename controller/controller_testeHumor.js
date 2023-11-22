/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos TESTES no Banco de Dados.
 * Data: 17/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

var dadosTesteReal = {
    observacao: "",
    id_paciente: "",
    caminhada: false,
    natacao: false,
    danca: false,
    alongamento: false,
    yoga: false,
    volei: false,
    tenis: false,
    corrida: false,
    ginastica: false,
    futebol: false,
    artesmarciais: false,
    academia: false,
    irritado: false,
    culpado: false,
    mudancasdehumor: false,
    agitado: false,
    confuso: false,
    apatico: false,
    energetico: false,
    calmo: false,
    feliz: false,
    confiante: false,
    confortavel: false,
    desanimado: false,
    apertonopeito: false,
    doresabdominais: false,
    faltadear: false,
    tontura: false,
    calafrios: false,
    nauseaevomito: false,
    cansaco: false,
    poucoapetite: false,
    dordecabeca: false,
    visaoembacada: false,
    dornobraco: false,
    intestinopreso: false,
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
    return (stringConcertada.toLowerCase()).replace(/[ ]/g, '')
}

const teste_humorDAO = require('../model/DAO/teste_humorDAO.js')
const notificacaoDAO = require('../model/DAO/notificacaoDAO.js')
const conexaoDAO = require('../model/DAO/conexaoDAO.js')

const getTestes = async function () {
    let dadosTestesJSON = {}

    let dadosTestes = await teste_humorDAO.selectAllTestes()

    if (dadosTestes) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosTestesJSON.status = messages.SUCCESS_REQUEST.status
        dadosTestesJSON.quantidade = dadosTestes.length
        dadosTestesJSON.testes = dadosTestes
        return dadosTestesJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getTesteByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosTesteJSON = {};

        let dadosTeste = await teste_humorDAO.selectTesteById(id)

        if (dadosTeste) {
            dadosTesteJSON.status = messages.SUCCESS_REQUEST.status
            dadosTesteJSON.teste = dadosTeste
            return dadosTesteJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getTesteByPaciente = async function (idPaciente) {
    if (idPaciente == '' || idPaciente == undefined || isNaN(idPaciente)) {
        return messages.ERROR_INVALID_PACIENTE
    } else {

        let dadosTesteJSON = {};

        let rsTeste = await teste_humorDAO.selectTesteByPaciente(idPaciente)

        if (rsTeste) {
            dadosTesteJSON.status = messages.SUCCESS_REQUEST.status
            dadosTesteJSON.testes = rsTeste
            return dadosTesteJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const insertTeste = async function (dadosTeste) {

    if (
        dadosTeste.observacao == '' || dadosTeste.observacao == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let dateVerification = await teste_humorDAO.selectTesteByData(dadosTeste.data, dadosTeste.id_paciente)

        console.log(dadosTeste.data);


        if (dateVerification == false) {
            dadosTesteReal.observacao = dadosTeste.observacao
            dadosTesteReal.id_paciente = dadosTeste.id_paciente
            dadosTeste.escolhas.forEach(escolha => {
                escolhaCorrigida = removerAcentos(escolha)

                dadosTesteReal[`${escolhaCorrigida}`] = true
            });

            let resultDadosTeste = await teste_humorDAO.insertTeste(dadosTesteReal)

            if (resultDadosTeste) {
                let ultimoPost = await teste_humorDAO.selectLastId()
                let novoTeste = await teste_humorDAO.selectTesteById(ultimoPost.id_teste_humor)

                let dadosTesteJSON = {}
                dadosTesteJSON.status = messages.SUCCESS_CREATED_ITEM.status
                dadosTesteJSON.teste = novoTeste

                let checkConexoes = await conexaoDAO.selectConexaoByPaciente(dadosTeste.id_paciente)

                if (checkConexoes) {
                    checkConexoes.forEach(conexao => {
                        let dadosNotificacao = {
                        "nome":"Modificação feita: Teste de Humor feito",
                        "descricao":`O paciente ${novoTeste.paciente} fez seu teste de humor de hoje!`,
                        "id_cuidador":conexao.id_cuidador,
                        "id_paciente":dadosTeste.id_paciente
                        }
        
                        notificacaoDAO.insertNotificacao(dadosNotificacao)
                    });
                } else {
                    let dadosNotificacao = {
                        "nome":"Modificação feita: Teste de Humor feito",
                        "descricao":`O paciente ${novoTeste.paciente} fez seu teste de humor de hoje!`,
                        "id_cuidador":0,
                        "id_paciente":dadosTeste.id_paciente
                        }
        
                        notificacaoDAO.insertNotificacao(dadosNotificacao)
                }

                return dadosTesteJSON
            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_TEST_ALREADY_DONE_TODAY
        }
    }
}

const deleteTeste = async function (id) {

    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdTeste = await teste_humorDAO.selectTesteById(id)

        if (searchIdTeste) {
            let dadosTeste = await teste_humorDAO.deleteTeste(id)

            if (dadosTeste) {
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
    getTestes,
    insertTeste,
    getTesteByID,
    getTesteByPaciente,
    deleteTeste
}
