/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos PACIENTES no Banco de Dados.
 * Data: 04/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')
const jwt = require('../middleware/middlewareJWT.js')
const pacienteDAO = require('../model/DAO/pacienteDAO.js')
const cuidadorDAO = require('../model/DAO/cuidadorDAO.js')
const conexaoDAO = require('../model/DAO/conexaoDAO.js')
const notificacaoDAO = require('../model/DAO/notificacaoDAO.js')
const emailSender = require('../middleware/middlewareEmail.js')
const crypto = require("crypto");
const moment = require("moment");

const definirGenero = function (genero) {
    let generoTraduzido = genero.toLowerCase();

    switch (generoTraduzido) {
        case 'mulher':
            generoTraduzido = 1
            break;

        case 'homem':
            generoTraduzido = 2
            break;

        case 'não-binário':
            generoTraduzido = 3
            break;

        case 'outros':
            generoTraduzido = 4
            break;
    }
    return generoTraduzido;
}

const getPacientes = async function () {

    let dadosPacientesJSON = {}

    let dadosPacientes = await pacienteDAO.selectAllPacientes()

    if (dadosPacientes) {
        //Criando um JSON com o atributo Alunos para encaminhar um Array de alunos
        dadosPacientesJSON.status = messages.SUCCESS_REQUEST.status
        dadosPacientesJSON.quantidade = dadosPacientes.length
        dadosPacientesJSON.pacientes = dadosPacientes
        return dadosPacientesJSON
    } else {
        return messages.ERROR_INTERNAL_SERVER
    }

}

const getPacienteByID = async function (id) {
    if (id == '' || isNaN(id) || id == undefined) {
        return messages.ERROR_INVALID_ID
    } else {

        let dadosPacienteJSON = {};

        let dadosPaciente = await pacienteDAO.selectPacienteById(id)

        if (dadosPaciente) {
            dadosPacienteJSON.paciente = dadosPaciente
            return dadosPacienteJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getPacienteByEmailAndSenhaAndNome = async function (dadosPaciente) {
    if (dadosPaciente.email == '' || dadosPaciente.email == undefined ||
        dadosPaciente.senha == '' || dadosPaciente.senha == undefined
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {

        let dadosPacienteJSON = {};

        let rsPaciente = await pacienteDAO.selectPacienteByEmailAndSenhaAndNome(dadosPaciente)

        if (rsPaciente) {
            let tokenUser = await jwt.createJWT(rsPaciente.id)

            dadosPacienteJSON.token = tokenUser
            dadosPacienteJSON.status = messages.SUCCESS_REQUEST.status
            dadosPacienteJSON.paciente = rsPaciente
            return dadosPacienteJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const getPacienteByEmail = async function (emailPaciente) {
    if (emailPaciente == '' || emailPaciente == undefined) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {

        let dadosPacienteJSON = {};

        let rsPaciente = await pacienteDAO.selectPacienteByEmail(emailPaciente)

        if (rsPaciente) {
            dadosPacienteJSON.status = messages.SUCCESS_REQUEST.status
            dadosPacienteJSON.paciente = rsPaciente[0]
            return dadosPacienteJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const validateToken = async function (token) {
    if (token == '' || token == undefined) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let rsPaciente = await pacienteDAO.selectToken(token)

        if (rsPaciente) {
            let now = moment().format()

            if (now > moment(rsPaciente.validade).add(3, 'hours').format('DD/MM/YYYY HH:mm')) {
                return messages.ERROR_UNAUTHORIZED_PASSWORD_RECOVER
            } else {
                await pacienteDAO.deleteToken(rsPaciente.id)

                return messages.SUCCESS_VALID_TOKEN
            }
        } else {
            return messages.ERROR_INVALID_TOKEN
        }
    }
}

const getCuidadoresConectados = async function (idPaciente) {
    if (idPaciente == '' || idPaciente == undefined || isNaN(idPaciente)) {
        return messages.ERROR_INVALID_ID
    } else {
        let dadosPacienteJSON = {}

        let rsPaciente = await pacienteDAO.selectCuidadoresConectados(idPaciente)

        if (rsPaciente) {
            dadosPacienteJSON.status = messages.SUCCESS_REQUEST.status
            dadosPacienteJSON.cuidadores = rsPaciente
            return dadosPacienteJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

const insertPaciente = async function (dadosPaciente) {

    if (
        dadosPaciente.nome == '' || dadosPaciente.nome == undefined || dadosPaciente.nome > 80 ||
        dadosPaciente.email == '' || dadosPaciente.email == undefined || dadosPaciente.email > 255 ||
        dadosPaciente.senha == '' || dadosPaciente.senha == undefined || dadosPaciente.senha > 255
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else {
        let verificateEmail = await pacienteDAO.selectPacienteByEmail(dadosPaciente.email)

        console.log(verificateEmail);

        if (verificateEmail.length > 0) {
            return messages.ERROR_EMAIL_ALREADY_EXISTS
        } else {
            let resultDadosPaciente = await pacienteDAO.insertPaciente(dadosPaciente)

            if (resultDadosPaciente) {
                let novoPaciente = await pacienteDAO.selectLastId()

                let dadosPacienteJSON = {}
                let tokenUser = await jwt.createJWT(novoPaciente.id)

                dadosPacienteJSON.token = tokenUser
                dadosPacienteJSON.status = messages.SUCCESS_CREATED_ITEM.status
                dadosPacienteJSON.paciente = novoPaciente

                return dadosPacienteJSON
            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        }
    }
}

const connectCuidadorAndPaciente = async function (idPaciente, idCuidador) {
    if (
        idPaciente == '' || idPaciente == undefined || isNaN(idPaciente)
    ) {
        return messages.ERROR_INVALID_PACIENTE
    } else if (idCuidador == '' || idCuidador == undefined || isNaN(idCuidador)) {
        return messages.ERROR_INVALID_CUIDADOR
    } else {
        let validatePaciente = await pacienteDAO.selectPacienteById(idPaciente)

        if (validatePaciente) {
            let validateCuidador = await cuidadorDAO.selectCuidadorById(idCuidador)
            
            if (validateCuidador) {
                let validateConexao = await conexaoDAO.selectConexaoByPacienteAndCuidador(idPaciente, idCuidador)

                if (validateConexao.length < 1) {
                    let connectionResult = await pacienteDAO.connectCuidadorAndPaciente(idPaciente, idCuidador)

                    if (connectionResult) {
                        let dadosNotificacao = {
                            "nome":"Alguém se conectou a sua conta",
                            "descricao":"Um usuário se conectou a sua conta!",
                            "id_cuidador":idCuidador,
                            "id_paciente":idPaciente
                        }
            
                        notificacaoDAO.insertNotificacao(dadosNotificacao)
    
                        return messages.SUCCESS_USERS_CONNECTED
                    } else {
                        return messages.ERROR_INTERNAL_SERVER
                    } 
                } else {
                    let dadosPacienteJSON = {}
                    dadosPacienteJSON.status = messages.ERROR_CONNECTION_ALREADY_EXISTS.status
                    dadosPacienteJSON.message = messages.ERROR_CONNECTION_ALREADY_EXISTS.message
                    dadosPacienteJSON.conexao = validateConexao[0]

                    return dadosPacienteJSON
                }
            } else {
                return messages.ERROR_INVALID_CUIDADOR
            }
        } else {
            return messages.ERROR_INVALID_PACIENTE
        }
    }
}

const updatePaciente = async function (dadosPaciente) {
    if (
        dadosPaciente.nome == '' || dadosPaciente.nome == undefined || dadosPaciente.nome > 80 ||
        dadosPaciente.data_nascimento == '' || dadosPaciente.data_nascimento == undefined ||
        dadosPaciente.cpf == '' || dadosPaciente.cpf == undefined || dadosPaciente.cpf.length > 15
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (dadosPaciente.id == null || dadosPaciente.id == undefined || isNaN(dadosPaciente.id)) {
        return messages.ERROR_INVALID_ID
    } else {
        dadosPaciente.genero = definirGenero(dadosPaciente.genero)

        let atualizacaoPaciente = await pacienteDAO.selectPacienteById(dadosPaciente.id)

        if (atualizacaoPaciente) {
            let resultDadosPaciente = await pacienteDAO.updatePaciente(dadosPaciente)

            if (resultDadosPaciente) {
                let dadosPacienteJSON = {}
                dadosPacienteJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosPacienteJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosPacienteJSON.paciente = dadosPaciente

                return dadosPacienteJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const updateSenhaPaciente = async function (dadosPaciente, id) {
    if (
        dadosPaciente.senha == '' || dadosPaciente.senha == undefined || dadosPaciente.senha > 255
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        dadosPaciente.id = id

        let atualizacaoPaciente = await pacienteDAO.selectPacienteById(id)

        if (atualizacaoPaciente) {
            let resultDadosPaciente = await pacienteDAO.updateSenhaPaciente(dadosPaciente)

            if (resultDadosPaciente) {
                let dadosPacienteJSON = {}
                dadosPacienteJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                dadosPacienteJSON.message = messages.SUCCESS_UPDATED_ITEM.message
                dadosPacienteJSON.paciente = dadosPaciente

                return dadosPacienteJSON

            } else {
                return messages.ERROR_INTERNAL_SERVER
            }
        } else {
            return messages.ERROR_INVALID_ID
        }
    }
}

const updateTokenPaciente = async function (idPaciente) {
    if (idPaciente == null || idPaciente == undefined || isNaN(idPaciente)) {
        return messages.ERROR_INVALID_ID
    } else {

        let atualizacaoPaciente = await pacienteDAO.selectPacienteById(idPaciente)

        if (atualizacaoPaciente) {
            let token = crypto.randomBytes(3).toString('hex')
            let expiration = moment().add(10, 'minutes').format('YYYY-MM-DD HH:mm:ss')

            let dadosPaciente = {
                "id": idPaciente,
                "token": token,
                "expiration": expiration
            }

            let resultDadosPaciente = await pacienteDAO.updateToken(dadosPaciente)

            if (resultDadosPaciente) {
                let emailEnviado = emailSender.enviarEmail(dadosPaciente.token, atualizacaoPaciente.email)

                if (emailEnviado) {
                    let dadosPacienteJSON = {}
                    dadosPacienteJSON.status = messages.SUCCESS_UPDATED_ITEM.status
                    dadosPacienteJSON.message = messages.SUCCESS_UPDATED_ITEM.message

                    return dadosPacienteJSON
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

const deletePaciente = async function (id) {

    if (id == null || id == undefined || id == '' || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {

        let searchIdPaciente = await pacienteDAO.selectPacienteById(id)

        if (searchIdPaciente) {
            let dadosPaciente = await pacienteDAO.deletePaciente(id)

            if (dadosPaciente) {
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
    getPacientes,
    insertPaciente,
    updatePaciente,
    deletePaciente,
    getPacienteByID,
    getPacienteByEmailAndSenhaAndNome,
    getPacienteByEmail,
    updateSenhaPaciente,
    connectCuidadorAndPaciente,
    getCuidadoresConectados,
    updateTokenPaciente,
    validateToken
}
