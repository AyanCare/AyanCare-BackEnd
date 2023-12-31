/**************************************************************************************
 * Objetivo: Arquivo responsável por padronizar as mensagens de Erro, Sucesso e etc.
 * Data: 04/09/2023
 * Auto: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

/*****************************************   MENSAGENS DE ERRO  *****************************************/
const ERROR_INTERNAL_SERVER = { status: 500, message: 'Devido a um erro interno do servidor, não foi possível processar a requisição.' }
const ERROR_REQUIRED_FIELDS = { status: 400, message: 'Campos obrigatórios não foram preenchidos ou foram preenchidos incorretamente.' }
const ERROR_INVALID_ID = { status: 400, message: 'O ID informado não é válido ou não foi encaminhado.' }
const ERROR_INVALID_PACIENTE = { status: 400, message: 'O Paciente não é válido ou não foi encaminhado.' }
const ERROR_INVALID_CUIDADOR = { status: 400, message: 'O Cuidador informado não é válido ou não foi encaminhado.' }
const ERROR_UNAUTHORIZED_USER = { status: 401, message: 'Usuário não autorizado a fazer requisições.' }
const ERROR_UNAUTHORIZED_PASSWORD_RECOVER = { status: 401, message: 'O token enviado está vencido.' }
const ERROR_NOT_FOUND = { status: 404, message: 'O Item não foi encontrado.' }
const ERROR_INVALID_CONTENT_TYPE = { status: 415, message: 'O tipo de mídia Content-Type da solicitação não é compatível com o servidor. Tipo Aceito: [application/json]' }
const ERROR_INVALID_TOKEN = { status: 401, message: 'O token está errado.'}
const ERROR_TEST_ALREADY_DONE_TODAY = { status: 400, message: 'Um teste de humor já foi feito hoje.' }
const ERROR_EMAIL_ALREADY_EXISTS = {status: 409, message: 'Um usuário com esse email já está cadastrado.'}
const ERROR_DISEASE_ALREADY_EXISTS = {status: 409, message: 'Você já registrou uma doença com o mesmo nome.'}
const ERROR_COMORBIDITY_ALREADY_EXISTS = {status: 409, message: 'Você já registrou uma comorbidade com o mesmo nome.'}
const ERROR_MEDICINE_ALREADY_EXISTS = {status: 409, message: 'Você já registrou um medicamento com o mesmo nome.'}
const ERROR_CONTACT_ALREADY_EXISTS = {status: 409, message: 'Você já registrou um contato com o mesmo nome.'}
const ERROR_CONNECTION_ALREADY_EXISTS = {status: 409, message: 'Esses dois usuários já estão conectados.'}
const ERROR_CONNECTION_DOESNT_EXISTS = {status: 409, message: 'Esses dois usuários não estão conectados.'}

/***************************************** MENSAGENS DE SUCESSO *****************************************/
const SUCCESS_REQUEST = { status: 200, message: 'Requisição realizada com sucesso.' }
const SUCCESS_EMAIL_SENT = { status: 200, message: 'Email enviado com sucesso.' }
const SUCCESS_CREATED_ITEM = { status: 201, message: 'Item criado com sucesso.' }
const SUCCESS_UPDATED_ITEM = { status: 200, message: 'Item atualizado com sucesso.' }
const SUCCESS_DELETED_ITEM = { status: 200, message: 'Item deletado com sucesso.' }
const SUCCESS_ITEM_FOUND = { status: 200, message: 'Item encontrado sucesso.' }
const SUCCESS_USERS_CONNECTED = { status: 201, message: 'Cuidador e Paciente conectado com sucesso.' }
const SUCCESS_ACTIVATED_CONNECTION = { status: 200, message: 'Conexão ativada com sucesso.' }
const SUCCESS_DEACTIVATED_CONNECTION = { status: 200, message: 'Conexão desativada com sucesso.' }
const SUCCESS_VALID_TOKEN = { status: 202, message: 'O token enviado é válido.' }
const SUCCESS_PDF_GENERATED = { status: 200, message: 'PDF foi gerado com sucesso.' }

module.exports = {
    ERROR_INTERNAL_SERVER,
    ERROR_INVALID_CONTENT_TYPE,
    ERROR_INVALID_ID,
    ERROR_NOT_FOUND,
    ERROR_REQUIRED_FIELDS,
    SUCCESS_CREATED_ITEM,
    SUCCESS_DELETED_ITEM,
    SUCCESS_ITEM_FOUND,
    SUCCESS_REQUEST,
    SUCCESS_UPDATED_ITEM,
    ERROR_UNAUTHORIZED_USER,
    ERROR_INVALID_TOKEN,
    ERROR_INVALID_PACIENTE,
    ERROR_INVALID_CUIDADOR,
    SUCCESS_USERS_CONNECTED,
    SUCCESS_ACTIVATED_CONNECTION,
    SUCCESS_DEACTIVATED_CONNECTION,
    ERROR_TEST_ALREADY_DONE_TODAY,
    ERROR_COMORBIDITY_ALREADY_EXISTS,
    ERROR_CONTACT_ALREADY_EXISTS,
    ERROR_DISEASE_ALREADY_EXISTS,
    ERROR_EMAIL_ALREADY_EXISTS,
    ERROR_MEDICINE_ALREADY_EXISTS,
    ERROR_UNAUTHORIZED_PASSWORD_RECOVER,
    SUCCESS_VALID_TOKEN,
    ERROR_CONNECTION_ALREADY_EXISTS,
    ERROR_CONNECTION_DOESNT_EXISTS,
    SUCCESS_EMAIL_SENT,
    SUCCESS_PDF_GENERATED
}