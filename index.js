/**************************************************************************************************************
* Objetivo: API para integração entre Back e Banco de dados para o App AyanCare.
* Autor: Lohannes da Silva Costa
* Data: 04/09/2023
* Versão: 1.0
**************************************************************************************************************/

const express = require('express');
const cors = require('cors')
const bodyParser = require('body-parser')
const bodyParserJSON = bodyParser.json()

const messages = require('./controller/modules/config.js')
const jwt = require('./middleware/middlewareJWT.js')
const jwtRecover = require('./middleware/middlewareEmail.js')
const controllerPaciente = require('./controller/controller_paciente.js');
const controllerCuidador = require('./controller/controller_cuidador.js');
const controllerGenero = require('./controller/controller_genero.js');
const controllerHorario = require('./controller/controller_horario.js');
const controllerEndereco_Paciente = require('./controller/controller_enderecoPaciente.js');
const controllerEndereco_Cuidador = require('./controller/controller_enderecoCuidador.js');
const { request } = require('express');
const { response } = require('express');

const app = express()

app.use((request, response, next) => {
   response.header('Access-Control-Allow-Origin', '*')

   response.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS')

   app.use(cors())

   next()
})

const validateJWT = async function (request, response, next) {
   let token = request.headers['x-access-token']

   const autenticidadeToken = await jwt.validateJWT(token)
   console.log(autenticidadeToken);

   if (autenticidadeToken) {
      next();
   } else {
      return response.status(messages.ERROR_UNAUTHORIZED_USER.status).end();
   }
}

//Validar email do usuário, criar token para relembrar a senha e enviar por email
app.get('/v1/ayan/esqueciasenha/criartoken', cors(), async (request, response) => {
   let email = request.query.email

   let resultDadosPaciente = await controllerPaciente.getPacienteByEmail(email)

   if (resultDadosPaciente.status == 200) {
      resultDadosPaciente.tipo = "Paciente"

      let tokenUser = await jwt.createJWTRecover(resultDadosPaciente.paciente[0].id)
      resultDadosPaciente.token = tokenUser
      await jwtRecover.sendEmail(email, tokenUser)

      response.status(resultDadosPaciente.status)
      response.json(resultDadosPaciente)
   } else {
      let resultDadosCuidador = await controllerCuidador.getCuidadorByEmail(email)

      if (resultDadosCuidador.status == 200) {
         resultDadosPaciente.tipo = "Cuidador"

         let tokenUser = await jwt.createJWTRecover(resultDadosCuidador.cuidador[0].id)
         resultDadosCuidador.token = tokenUser
         await jwtRecover.sendEmail(email, tokenUser)

         response.status(resultDadosCuidador.status)
         response.json(resultDadosCuidador)
      } else {
         response.status(resultDadosCuidador.status)
         response.json(resultDadosCuidador)
      }
   }
})

//validar token para relembrar a senha
app.get('/v1/ayan/esqueciasenha/validar', cors(), async (request, response) => {
   let token = request.query.token

   const autenticarToken = await jwt.validateJWT(token)

   if (autenticarToken) {
      let responseJSON = {}

      responseJSON.status = messages.SUCCESS_REQUEST.status
      responseJSON.result = autenticarToken

      response.status(responseJSON.status)
      response.json(responseJSON)
   } else {
      response.status(messages.ERROR_INVALID_TOKEN.status)
      response.json(messages.ERROR_INVALID_TOKEN)
   }
})

//CRUD (Create, Read, Update, Delete)
//Login Usuários 
app.get('/v1/ayan/usuario/autenticar', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultDadosPaciente = await controllerPaciente.getPacienteByEmailAndSenhaAndNome(dadosBody)

      if (resultDadosPaciente.status == 200) {
         resultDadosPaciente.tipo = "Paciente"

         response.status(resultDadosPaciente.status)
         response.json(resultDadosPaciente)
      } else {
         let resultDadosCuidador = await controllerCuidador.getCuidadorByEmailAndSenhaAndNome(dadosBody)

         if (resultDadosCuidador.status == 200) {
            resultDadosCuidador.tipo = "Cuidador"
         }

         response.status(resultDadosPaciente.status)
         response.json(resultDadosPaciente)
      }
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Atualizar senha de Usuário
app.put('/v1/ayan/usuario/esqueciasenha', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body

      let resultDadosPaciente = await controllerPaciente.getPacienteByEmail(dadosBody.email)

      if (resultDadosPaciente.status == 200) {
         updatePaciente = await controllerPaciente.updateSenhaPaciente(dadosBody, resultDadosPaciente.paciente[0].id)

         response.status(updatePaciente.status)
         response.json(updatePaciente)
      } else {
         let resultDadosCuidador = await controllerCuidador.getCuidadorByEmail(dadosBody.email)

         if (resultDadosCuidador.status == 200) {
            updateCuidador = await controllerCuidador.updateSenhaCuidador(dadosBody, resultDadosCuidador.cuidador[0].id)

            response.status(updateCuidador.status)
            response.json(updateCuidador)
         } else {
            response.status(resultDadosCuidador.status)
            response.json(resultDadosCuidador)
         }
      }
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

/*************************************************************************************
 * Objetibo: API de controle de Doenças Crônicas. 
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/



/*************************************************************************************
 * Objetibo: API de controle de Comorbidades.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/



/*************************************************************************************
 * Objetibo: API de controle de Pacientes.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/
//Get All (futuramente será um conjunto de GETs)
app.get('/v1/ayan/pacientes', validateJWT, cors(), async (request, response) => {
   let dadosPaciente = await controllerPaciente.getPacientes();

   //Valida se existe registro
   response.json(dadosPaciente)
   response.status(dadosPaciente.status)
})

//Login Paciente
app.get('/v1/ayan/paciente/autenticar', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultDadosPaciente = await controllerPaciente.getPacienteByEmailAndSenha(dadosBody)

      response.status(resultDadosPaciente.status)
      response.json(resultDadosPaciente)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Get por ID
app.get('/v1/ayan/paciente/:id', validateJWT, cors(), async (request, response) => {
   let idPaciente = request.params.id;

   //Recebe os dados do controller
   let dadosPaciente = await controllerPaciente.getPacienteByID(idPaciente);

   //Valida se existe registro
   response.json(dadosPaciente)
   response.status(dadosPaciente.status)
})

//Insert Paciente
app.post('/v1/ayan/paciente', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultDadosPaciente = await controllerPaciente.insertPaciente(dadosBody)

      response.status(resultDadosPaciente.status)
      response.json(resultDadosPaciente)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Update Paciente
app.put('/v1/ayan/paciente/:id', validateJWT, cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {

      let id = request.params.id;

      let dadosBody = request.body

      let resultDadosPaciente = await controllerPaciente.updatePaciente(dadosBody, id)

      response.status(resultDadosPaciente.status)
      response.json(resultDadosPaciente)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Delete paciente (No momento, apenas um Delete simples, pode não funcionar quando a tabela pa
app.delete('/v1/ayan/paciente/:id', validateJWT, cors(), async function (request, response) {
   let id = request.params.id;

   let returnPaciente = await controllerPaciente.getPacienteByID(id)

   if (returnPaciente.status == 404) {
      response.status(returnPaciente.status)
      response.json(returnPaciente)
   } else {
      let resultDadosPaciente = await controllerPaciente.deletePaciente(id)

      response.status(resultDadosPaciente.status)
      response.json(resultDadosPaciente)
   }
})

/*************************************************************************************
* Objetibo: API de controle de Endereço do Paciente.
* Autor: Lohannes da Silva Costa
* Data: 11/09/2023
* Versão: 1.0
*************************************************************************************/

//Insert Endereço do Paciente
app.post('/v1/ayan/paciente/endereco', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultDadosEndereco = await controllerEndereco_Paciente.insertEndereco(dadosBody)

      response.status(resultDadosEndereco.status)
      response.json(resultDadosEndereco)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Get Endereço Paciente por ID
app.get('/v1/ayan/paciente/endereco/:id', validateJWT, cors(), async (request, response) => {
   let idEndereco = request.params.id;

   //Recebe os dados do controller
   let dadosEndereco = await controllerEndereco_Paciente.getEnderecoByID(idEndereco);

   //Valida se existe registro
   response.json(dadosEndereco)
   response.status(dadosEndereco.status)
})

//Update Endereco Paciente
app.put('/v1/ayan/paciente/endereco/:id', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {

      let id = request.params.id;


      let dadosBody = request.body

      let resultDadosEndereco = await controllerEndereco_Paciente.updateEndereco(dadosBody, id)

      response.status(resultDadosEndereco.status)
      response.json(resultDadosEndereco)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

/*************************************************************************************
 * Objetibo: API de controle de Humor.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/



/*************************************************************************************
 * Objetibo: API de controle de Generos.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/

//Get All Gêneros 
app.get('/v1/ayan/generos', cors(), async (request, response) => {
   //Recebe os dados do controller
   let dadosGenero = await controllerGenero.getGeneros();

   //Valida se existe registro
   response.json(dadosGenero)
   response.status(dadosGenero.status)
})

//Get Genero por ID
app.get('/v1/ayan/genero/:id', cors(), async (request, response) => {
   let idGenero = request.params.id;

   //Recebe os dados do controller
   let dadosGenero = await controllerGenero.getGeneroByID(idGenero);

   //Valida se existe registro
   response.json(dadosGenero)
   response.status(dadosGenero.status)
})

/*************************************************************************************
 * Objetibo: API de controle de Sintomas.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/



/*************************************************************************************
   * Objetibo: API de controle de Exercícios.
   * Autor: Lohannes da Silva Costa
   * Data: 04/09/2023
   * Versão: 1.0
   *************************************************************************************/



/*************************************************************************************
 * Objetibo: API de controle de Respostas de Humor.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/



/*************************************************************************************
 * Objetibo: API de controle de Contato.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/



/*************************************************************************************
   * Objetibo: API de controle de Responsável.
   * Autor: Lohannes da Silva Costa
   * Data: 04/09/2023
   * Versão: 1.0
   *************************************************************************************/



/*************************************************************************************
 * Objetibo: API de Tipos de Telefone.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/



/*************************************************************************************
 * Objetibo: API de controle de Medidas.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/



/*************************************************************************************
   * Objetibo: API de controle de Medicamentos.
   * Autor: Lohannes da Silva Costa
   * Data: 04/09/2023
   * Versão: 1.0
   *************************************************************************************/



/*************************************************************************************
 * Objetibo: API de controle de Tipos de Eventos.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/



/*************************************************************************************
 * Objetibo: API de controle de Eventos.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/



/*************************************************************************************
* Objetibo: API de controle de Cuidadores.
* Autor: Lohannes da Silva Costa
* Data: 04/09/2023
* Versão: 1.0
*************************************************************************************/
//Get All Cuidadores (Futuramente terá mais Gets)
app.get('/v1/ayan/cuidadores', validateJWT, cors(), async (request, response) => {
   //Recebe os dados do controller
   let dadosCuidador = await controllerCuidador.getCuidadores();

   //Valida se existe registro
   response.json(dadosCuidador)
   response.status(dadosCuidador.status)
})

//Login Cuidador
app.get('/v1/ayan/cuidador/autenticar', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultDadosCuidador = await controllerCuidador.getCuidadorByEmailAndSenha(dadosBody)

      response.status(resultDadosCuidador.status)
      response.json(resultDadosCuidador)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Get Cuidador por ID
app.get('/v1/ayan/cuidador/:id', validateJWT, cors(), async (request, response) => {
   let idCuidador = request.params.id;

   //Recebe os dados do controller
   let dadosCuidador = await controllerCuidador.getCuidadorByID(idCuidador);

   //Valida se existe registro
   response.json(dadosCuidador)
   response.status(dadosCuidador.status)
})

//Insert Cuidador 
app.post('/v1/ayan/cuidador', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultDadosCuidador = await controllerCuidador.insertCuidador(dadosBody)

      response.status(resultDadosCuidador.status)
      response.json(resultDadosCuidador)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Update Cuidador
app.put('/v1/ayan/cuidador/:id', validateJWT, cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {

      let id = request.params.id;


      let dadosBody = request.body

      let resultDadosCuidador = await controllerCuidador.updateCuidador(dadosBody, id)

      response.status(resultDadosCuidador.status)
      response.json(resultDadosCuidador)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Delete Cuidador (Delete simples, pode haver erro caso ele se conecte a outra tabela, sujeito a mudanças)
app.delete('/v1/ayan/cuidador/:id', validateJWT, cors(), async function (request, response) {
   let id = request.params.id;

   let returnCuidador = await controllerCuidador.getCuidadorByID(id)

   if (returnPaciente.status == 404) {
      response.status(returnCuidador.status)
      response.json(returnCuidador)
   } else {
      let resultDadosCuidador = await controllerCuidador.deleteCuidador(id)

      response.status(resultDadosCuidador.status)
      response.json(resultDadosCuidador)
   }
})


/*************************************************************************************
* Objetibo: API de controle de Endereco de Cuidadores.
* Autor: Lohannes da Silva Costa
* Data: 11/09/2023
* Versão: 1.0
*************************************************************************************/
app.post('/v1/ayan/cuidador/endereco', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultDadosEndereco = await controllerEndereco_Cuidador.insertEndereco(dadosBody)

      response.status(resultDadosEndereco.status)
      response.json(resultDadosEndereco)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

app.get('/v1/ayan/cuidador/endereco/:id', cors(), async (request, response) => {
   let idEndereco = request.params.id;

   //Recebe os dados do controller
   let dadosEndereco = await controllerEndereco_Cuidador.getEnderecoByID(idEndereco);

   //Valida se existe registro
   response.json(dadosEndereco)
   response.status(dadosEndereco.status)
})

app.put('/v1/ayan/cuidador/endereco/:id', validateJWT, cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {

      let id = request.params.id;


      let dadosBody = request.body

      let resultDadosEndereco = await controllerEndereco_Cuidador.updateEndereco(dadosBody, id)

      response.status(resultDadosEndereco.status)
      response.json(resultDadosEndereco)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})


/*************************************************************************************
 * Objetibo: API de controle de Turnos.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/



/*************************************************************************************
 * Objetibo: API de controle de Dias.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/



/*************************************************************************************
* Objetibo: API de controle de Horas.
* Autor: Lohannes da Silva Costa
* Data: 04/09/2023
* Versão: 1.0
*************************************************************************************/
app.get('/v1/ayan/horarios', validateJWT, cors(), async (request, response) => {
   let dadosHorario = await controllerHorario.getHorarios();

   //Valida se existe registro
   response.json(dadosHorario)
   response.status(dadosHorario.status)
})

//Get por ID
app.get('/v1/ayan/horario/:id', validateJWT, cors(), async (request, response) => {
   let idHorario = request.params.id;

   //Recebe os dados do controller
   let dadosHorario = await controllerHorario.getHorarioByID(idHorario);

   //Valida se existe registro
   response.json(dadosHorario)
   response.status(dadosHorario.status)
})

//Insert Paciente
app.post('/v1/ayan/horario', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultDadosHorario = await controllerHorario.insertHorario(dadosBody)

      response.status(resultDadosHorario.status)
      response.json(resultDadosHorario)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Update Paciente
app.put('/v1/ayan/horario/:id', validateJWT, cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {

      let id = request.params.id;

      let dadosBody = request.body

      let resultDadosHorario = await controllerHorario.updateHorario(dadosBody, id)

      response.status(resultDadosHorario.status)
      response.json(resultDadosHorario)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Delete paciente (No momento, apenas um Delete simples, pode não funcionar quando a tabela pa
app.delete('/v1/ayan/horario/:id', validateJWT, cors(), async function (request, response) {
   let id = request.params.id;

   let returnHorario = await controllerHorario.getHorarioByID(id)

   if (returnPaciente.status == 404) {
      response.status(returnHorario.status)
      response.json(returnHorario)
   } else {
      let resultDadosHorario = await controllerHorario.deleteHorario(id)

      response.status(resultDadosHorario.status)
      response.json(resultDadosHorario)
   }
})


/*************************************************************************************
 * Objetibo: API de controle de Relatórios.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/



/*************************************************************************************
 * Objetibo: API de controle de Respostas do Relatório.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/



/*************************************************************************************
   * Objetibo: API de controle de Perguntas do Relatório.
   * Autor: Lohannes da Silva Costa
   * Data: 04/09/2023
   * Versão: 1.0
   *************************************************************************************/






app.listen(8080, function () {
   console.log('Aguardando requisições na porta 8080...');
})
