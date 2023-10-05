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
const controllerComorbidade = require('./controller/controller_comorbidade.js');
const controllerDoenca = require('./controller/controller_doenca.js');
const controllerMedicamento = require('./controller/controller_medicamento.js');
const controllerAlarme = require('./controller/controller_alarme.js');
const controllerEndereco_Paciente = require('./controller/controller_enderecoPaciente.js');
const controllerEndereco_Cuidador = require('./controller/controller_enderecoCuidador.js');
const controllerContato = require('./controller/controller_contato.js');
const controllerStatus_Contato = require('./controller/controller_statusContato.js');
const controllerRelatorio = require('./controller/controller_relatorio.js');
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
app.post('/v1/ayan/usuario/autenticar', cors(), bodyParserJSON, async (request, response) => {
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
//Get All (futuramente será um conjunto de GETs)
app.get('/v1/ayan/doencas', cors(), async (request, response) => {
   let dadosDoenca = await controllerDoenca.getDoencas();

   //Valida se existe registro
   response.json(dadosDoenca)
   response.status(dadosDoenca.status)
})

//Get por ID
app.get('/v1/ayan/doenca/:id', validateJWT, cors(), async (request, response) => {
   let idDoenca = request.params.id;

   //Recebe os dados do controller
   let dadosDoenca = await controllerDoenca.getDoencaByID(idDoenca);

   //Valida se existe registro
   response.json(dadosDoenca)
   response.status(dadosDoenca.status)
})

//Insert
app.post('/v1/ayan/doenca', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultDadosDoenca = await controllerDoenca.insertDoenca(dadosBody)

      response.status(resultDadosDoenca.status)
      response.json(resultDadosDoenca)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Update
app.put('/v1/ayan/doenca/:id', validateJWT, cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {

      let id = request.params.id;

      let dadosBody = request.body

      let resultDadosDoenca = await controllerDoenca.updateDoenca(dadosBody, id)

      response.status(resultDadosDoenca.status)
      response.json(resultDadosDoenca)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Delete
app.delete('/v1/ayan/doenca/:id', validateJWT, cors(), async function (request, response) {
   let id = request.params.id;

   let returnDoenca = await controllerDoenca.getDoencaByID(id)

   if (returnDoenca.status == 404) {
      response.status(returnDoenca.status)
      response.json(returnDoenca)
   } else {
      let resultDadosDoenca = await controllerDoenca.deleteDoenca(id)

      response.status(resultDadosDoenca.status)
      response.json(resultDadosDoenca)
   }
})


/*************************************************************************************
 * Objetibo: API de controle de Comorbidades.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/
//Get All (futuramente será um conjunto de GETs)
app.get('/v1/ayan/comorbidades', validateJWT, cors(), async (request, response) => {
   let dadosComorbidade = await controllerComorbidade.getComorbidades();

   //Valida se existe registro
   response.json(dadosComorbidade)
   response.status(dadosComorbidade.status)
})

//Get por ID
app.get('/v1/ayan/comorbidade/:id', validateJWT, cors(), async (request, response) => {
   let idComorbidade = request.params.id;

   //Recebe os dados do controller
   let dadosComorbidade = await controllerComorbidade.getComorbidadeByID(idComorbidade);

   //Valida se existe registro
   response.json(dadosComorbidade)
   response.status(dadosComorbidade.status)
})

//Insert Comorbidade
app.post('/v1/ayan/comorbidade', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultDadosComorbidade = await controllerComorbidade.insertComorbidade(dadosBody)

      response.status(resultDadosComorbidade.status)
      response.json(resultDadosComorbidade)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Update Comorbidade
app.put('/v1/ayan/comorbidade/:id', validateJWT, cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {

      let id = request.params.id;

      let dadosBody = request.body

      let resultDadosComorbidade = await controllerComorbidade.updateComorbidade(dadosBody, id)

      response.status(resultDadosComorbidade.status)
      response.json(resultDadosComorbidade)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Delete Comorbidade
app.delete('/v1/ayan/comorbidade/:id', validateJWT, cors(), async function (request, response) {
   let id = request.params.id;

   let returnComorbidade = await controllerComorbidade.getComorbidadeByID(id)

   if (returnComorbidade.status == 404) {
      response.status(returnComorbidade.status)
      response.json(returnComorbidade)
   } else {
      let resultDadosComorbidade = await controllerComorbidade.deleteComorbidade(id)

      response.status(resultDadosComorbidade.status)
      response.json(resultDadosComorbidade)
   }
})


/*************************************************************************************
 * Objetibo: API de controle de Pacientes.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/
//Get All (futuramente será um conjunto de GETs)
app.get('/v1/ayan/pacientes', cors(), async (request, response) => {
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
app.get('/v1/ayan/paciente/:id', cors(), async (request, response) => {
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

//Conectar
app.post('/v1/ayan/conectar', validateJWT, cors(), bodyParserJSON, async (request, response) => {
      let idPaciente = request.query.idPaciente
      let idCuidador = request.query.idCuidador

      let resultDadosPaciente = await controllerPaciente.connectCuidadorAndPaciente(idPaciente, idCuidador)

      response.status(resultDadosPaciente.status)
      response.json(resultDadosPaciente)
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
app.get('/v1/ayan/paciente/endereco/:id', cors(), async (request, response) => {
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
 * Autor: Gustavo Souza Tenorio de Barros
 * Data: 27/09/2023
 * Versão: 1.0
 *************************************************************************************/

//Todos os Contatos
app.get('/v1/ayan/contatos', cors(), async (request, response) => {

   let idContato = request.query.idContato;
   let idContatoPaciente = request.query.idContatoPaciente;

   if (idContato != undefined) {

      let dadosContato = await controllerContato.getContatoByID(idContato)

      response.json(dadosContato)
      response.status(dadosContato.status)

   } else if (idContatoPaciente != undefined) {

      let dadosContatoPaciente = await controllerContato.getContatoByIDPaciente(idContatoPaciente)

      response.json(dadosContatoPaciente)
      response.status(dadosContatoPaciente.status)
   } else {
      //Receber os dados do Controller
      let dadosContato = await controllerContato.getContatos();

      //Valida se existe registro
      response.json(dadosContato)
      response.status(dadosContato.status)
   }
})

//Contato especifico   
app.get('/v2/ayan/contato/:id', cors(), async (request, response) => {
   let idContato = request.params.id

   let dadosContato = await controllerContato.getContatoByID(idContato)

   response.json(dadosContato)
   response.status(dadosContato.status)
})

// Inserir Contato
app.post('/v1/ayan/contato/', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas na formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultDadosContato = await controllerContato.insertContato(dadosBody)

      response.status(resultDadosContato.status)
      response.json(resultDadosContato)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Atualizar dados Contato
app.put('/v1/ayan/contato/:id', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas na formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let id = request.params.id;

      let dadosBody = request.body

      let resultDadosContato = await controllerContato.updateContato(dadosBody, id)

      response.status(resultDadosContato.status)
      response.json(resultDadosContato)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Deletar Contato
app.delete('/v1/ayan/contato/:id', cors(), async function (request, response) {
   let id = request.params.id;

   let returnContato = await controllerContato.getContatoByID(id)

   if (returnContato.status == 404) {
      response.status(returnContato.status)
      response.json(returnContato)
   } else {
      let resultDadosContato = await controllerContato.deletarContato(id)

      response.status(resultDadosContato.status)
      response.json(resultDadosContato)
   }
})

/*************************************************************************************
 * Objetibo: API de controle de Status Contato.
 * Autor: Gustavo Souza Tenorio de Barros
 * Data: 27/09/2023
 * Versão: 1.0
 *************************************************************************************/
//Get All Status contato
app.get('/v1/ayan/status-contatos', cors(), async (request, response) => {
   //Recebe os dados do controller
   let dadosStatusContato = await controllerStatus_Contato.getStatusContatos()

   //Valida se existe registro
   response.json(dadosStatusContato)
   response.status(dadosStatusContato.status)
})

//Get Status contato por ID
app.get('/v1/ayan/status-contato/:id', cors(), async (request, response) => {
   let idStatusContato = request.params.id;

   //Recebe os dados do controller
   let StatusContato = await controllerStatus_Contato.getStatusContatosByID(idStatusContato);

   //Valida se existe registro
   response.json(StatusContato)
   response.status(StatusContato.status)
})

//insert
app.post('/v1/ayan/StatusContato/:id', cors(), async (request,response)=>{
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas na formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultadoStatusContato = await controllerStatus_Contato.insertStatusContato(dadosBody)
      response.status(resultadoStatusContato.status)
      response.json(resultadoStatusContato)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }

})



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

//Todos os Medicamentos e todos os medicamentos de um paciente em específico
app.get('/v1/ayan/medicamentos', cors(), async (request, response) => {
   let idPaciente = request.query.idPaciente

   if (idPaciente != undefined) {
      //Receber os dados do Controller
      let dadosMedicamento = await controllerMedicamento.getMedicamentosByPaciente(idPaciente);

      //Valida se existe registro
      response.json(dadosMedicamento)
      response.status(dadosMedicamento.status)
   } else {
      //Receber os dados do Controller
      let dadosMedicamento = await controllerMedicamento.getMedicamentos();

      //Valida se existe registro
      response.json(dadosMedicamento)
      response.status(dadosMedicamento.status)
   }
})

//Medicamento específico
app.get('/v1/ayan/medicamento/:id', cors(), async (request, response) => {
   let id = request.params.id;

   let dadosMedicamento = await controllerMedicamento.getMedicamentoByID(id)

   response.json(dadosMedicamento)
   response.status(dadosMedicamento.status)
})

// Inserir
app.post('/v1/ayan/medicamento', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas na formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultDadosMedicamento = await controllerMedicamento.insertMedicamento(dadosBody)

      response.status(resultDadosMedicamento.status)
      response.json(resultDadosMedicamento)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Atualizar
app.put('/v1/ayan/medicamento', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas na formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let id = request.params.id;

      let dadosBody = request.body

      let resultDadosMedicamento = await controllerMedicamento.updateMedicamento(dadosBody, id)

      response.status(resultDadosMedicamento.status)
      response.json(resultDadosMedicamento)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Deletar 
app.delete('/v1/ayan/medicamento/:id', cors(), async function (request, response) {
   let id = request.params.id;

   let returnMedicamento = await controllerMedicamento.getMedicamentoByID(id)

   if (returnMedicamento.status == 404) {
      response.status(returnMedicamento.status)
      response.json(returnMedicamento)
   } else {
      let resultDadosMedicamento = await controllerMedicamento.deleteMedicamento(id)

      response.status(resultDadosMedicamento.status)
      response.json(resultDadosMedicamento)
   }
})

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
app.get('/v1/ayan/cuidadores', cors(), async (request, response) => {
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
app.get('/v1/ayan/cuidador/:id', cors(), async (request, response) => {
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
* Objetibo: API de controle de Alarmes.
* Autor: Lohannes da Silva Costa
* Data: 04/09/2023
* Versão: 1.0
*************************************************************************************/
//Todos os Alarmes e todos os Alarmes de um paciente em específico
app.get('/v1/ayan/alarmes', cors(), async (request, response) => {
   let idPaciente = request.query.idPaciente

   if (idPaciente != undefined) {
      //Receber os dados do Controller
      let dadosAlarme = await controllerAlarme.getAlarmesByPaciente(idPaciente);

      //Valida se existe registro
      response.json(dadosAlarme)
      response.status(dadosAlarme.status)
   } else {
      //Receber os dados do Controller
      let dadosAlarme = await controllerAlarme.getAlarmes();

      //Valida se existe registro
      response.json(dadosAlarme)
      response.status(dadosAlarme.status)
   }
})

//Alarme específico
app.get('/v1/ayan/alarme/:id', cors(), async (request, response) => {
   let id = request.params.id;

   let dadosAlarme = await controllerAlarme.getAlarmeByID(id)

   response.json(dadosAlarme)
   response.status(dadosAlarme.status)
})

// Inserir
app.post('/v1/ayan/alarme', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas na formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultDadosAlarme = await controllerAlarme.insertAlarme(dadosBody)

      response.status(resultDadosAlarme.status)
      response.json(resultDadosAlarme)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Atualizar
app.put('/v1/ayan/alarme', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas na formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let id = request.params.id;

      let dadosBody = request.body

      let resultDadosAlarme = await controllerAlarme.updateAlarme(dadosBody, id)

      response.status(resultDadosAlarme.status)
      response.json(resultDadosAlarme)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Deletar 
app.delete('/v1/ayan/alarme/:id', cors(), async function (request, response) {
   let id = request.params.id;

   let returnAlarme = await controllerAlarme.getAlarmeByID(id)

   if (returnAlarme.status == 404) {
      response.status(returnAlarme.status)
      response.json(returnAlarme)
   } else {
      let resultDadosAlarme = await controllerAlarme.deleteAlarme(id)

      response.status(resultDadosAlarme.status)
      response.json(resultDadosAlarme)
   }
})


/*************************************************************************************
 * Objetibo: API de controle de Relatórios.
 * Autor: Gustavo Souza Tenorio de Barros
 * Data: 05/10/2023
 * Versão: 1.0
 *************************************************************************************/

//Get all Relatório 


app.get('/v1/ayan/relatorios', cors(), async (request, response)=>{

   let dadosRelatorio = await controllerRelatorio.getRelatorios();

   response.json(dadosRelatorio)
   response.status(dadosRelatorio.status)


})










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
