/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos PACIENTES no Banco de Dados.
 * Data: 04/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import do arquivo de configuração das variáveis, constantes e globais.
const messages = require('./modules/config.js')

const pacienteDAO = require('../model/DAO/pacienteDAO.js')
const cuidadorDAO = require('../model/DAO/cuidadorDAO.js')
const jwt = require('../middleware/middlewareJWT.js')

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
            dadosPacienteJSON.status = messages.SUCCESS_REQUEST.status
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
            dadosPacienteJSON.nome = rsPaciente.nome
            dadosPacienteJSON.email = rsPaciente.email
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
            dadosPacienteJSON.paciente = rsPaciente
            return dadosPacienteJSON
        } else {
            return messages.ERROR_NOT_FOUND
        }
    }
}

// '${dadosPaciente.nome}',
//         '${dadosPaciente.data_nascimento}',
//         '${dadosPaciente.email}',
//         '${dadosPaciente.senha}',
//         '${dadosPaciente.cpf}',
//         ${dadosPaciente.id_endereco_paciente},
//         ${dadosPaciente.id_genero}

const insertPaciente = async function (dadosPaciente) {

    if (
        dadosPaciente.nome == '' || dadosPaciente.nome == undefined || dadosPaciente.nome > 80 ||
        dadosPaciente.email == '' || dadosPaciente.email == undefined || dadosPaciente.email > 255 ||
        dadosPaciente.senha == '' || dadosPaciente.senha == undefined || dadosPaciente.senha > 255 
    ) {
        return messages.ERROR_REQUIRED_FIELDS
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

const connectCuidadorAndPaciente = async function (idPaciente, idCuidador){
    if(
        idPaciente == '' || idPaciente == undefined || isNaN(idPaciente)
    ) {
        return messages.ERROR_INVALID_PACIENTE
    } else if (idCuidador == '' || idCuidador == undefined || isNaN(idCuidador)) {
        return messages.ERROR_INVALID_CUIDADOR
    } else {
        let validatePaciente = await pacienteDAO.selectPacienteById(idPaciente)

        if(validatePaciente){
            let validateCuidador = await cuidadorDAO.selectCuidadorById(idCuidador)

            if (validateCuidador) {
                let connectionResult = await pacienteDAO.connectCuidadorAndPaciente(idPaciente, idCuidador)

                if (connectionResult){
                    return messages.SUCCESS_USERS_CONNECTED
                } else {
                    return messages.ERROR_INTERNAL_SERVER
                }
            } else {
                return messages.ERROR_INVALID_CUIDADOR
            }
        } else {
            return messages.ERROR_INVALID_PACIENTE
        }
    }
}

const updatePaciente = async function (dadosPaciente, id) {
    if (
        dadosPaciente.nome == '' || dadosPaciente.nome == undefined || dadosPaciente.nome > 80 ||
        dadosPaciente.data_nascimento == '' || dadosPaciente.data_nascimento == undefined ||
        dadosPaciente.cpf == '' || dadosPaciente.cpf == undefined || dadosPaciente.cpf.length > 15
    ) {
        return messages.ERROR_REQUIRED_FIELDS
    } else if (id == null || id == undefined || isNaN(id)) {
        return messages.ERROR_INVALID_ID
    } else {
        dadosPaciente.id = id

        let atualizacaoPaciente = await pacienteDAO.selectPacienteById(id)

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
        } else{
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
    connectCuidadorAndPaciente
}
