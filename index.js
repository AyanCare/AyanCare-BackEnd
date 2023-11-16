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
const controllerPaciente = require('./controller/controller_paciente.js');
const controllerCuidador = require('./controller/controller_cuidador.js');
const controllerGenero = require('./controller/controller_genero.js');
const controllerComorbidade = require('./controller/controller_comorbidade.js');
const controllerDoenca = require('./controller/controller_doenca.js');
const controllerMedicamento = require('./controller/controller_medicamento.js');
const controllerMedida = require('./controller/controller_medida.js');
const controllerAlarme = require('./controller/controller_alarme.js');
const controllerAlarme_Unitario = require('./controller/controller_alarmeUnitario.js');
const controllerEvento = require('./controller/controller_evento.js');
const controllerSintoma = require('./controller/controller_sintoma');
const controllerExercicio = require('./controller/controller_exercicio.js');
const controllerHumor = require('./controller/controller_humor.js');
const controllerHistorico = require('./controller/controller_historicoMedico.js');
const controllerConexao = require('./controller/controller_conexao.js');
const controllerCor = require('./controller/controller_cor.js');
const controllerTeste_Humor = require('./controller/controller_testeHumor.js');
const controllerEndereco_Paciente = require('./controller/controller_enderecoPaciente.js');
const controllerEndereco_Cuidador = require('./controller/controller_enderecoCuidador.js');
const controllerContato = require('./controller/controller_contato.js');
const controllerCalendario = require('./controller/controller_calendario.js');
const controllerStatus_Contato = require('./controller/controller_statusContato.js');
const controllerRelatorio = require('./controller/controller_relatorio.js');
const controllerPergunta_Relatorio = require('./controller/controller_perguntaRelatorio.js')
const controllerQuestionario_Relatorio = require('./controller/controller_questionarioRelatorio.js')
const controllerEventoSemanal = require('./controller/controller_eventoSemanal.js');
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

      let tokenCreation = await controllerPaciente.updateTokenPaciente(resultDadosPaciente.paciente.id)

      response.status(tokenCreation.status)
      response.json(tokenCreation)
   } else {
      let resultDadosCuidador = await controllerCuidador.getCuidadorByEmail(email)

      if (resultDadosCuidador.status == 200) {

         let tokenCreation = await controllerCuidador.updateTokenCuidador(resultDadosCuidador.cuidador.id)

         response.status(tokenCreation.status)
         response.json(tokenCreation)
      } else {
         response.status(resultDadosCuidador.status)
         response.json(resultDadosCuidador)
      }
   }
})

//validar token para relembrar a senha
app.get('/v1/ayan/esqueciasenha/validar', cors(), async (request, response) => {
   let email = request.query.email
   let token = request.query.token

   let resultDadosPaciente = await controllerPaciente.getPacienteByEmail(email)

   if (resultDadosPaciente.status == 200) {
      resultDadosPaciente.tipo = "Paciente"

      let tokenValidation = await controllerPaciente.validateToken(token)

      response.status(tokenValidation.status)
      response.json(tokenValidation)
   } else {
      let resultDadosCuidador = await controllerCuidador.getCuidadorByEmail(email)

      if (resultDadosCuidador.status == 200) {

         let tokenValidation = await controllerCuidador.validateToken(token)

         response.status(tokenValidation.status)
         response.json(tokenValidation)
      } else {
         response.status(resultDadosCuidador.status)
         response.json(resultDadosCuidador)
      }
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

         response.status(resultDadosCuidador.status)
         response.json(resultDadosCuidador)
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

//Get Cuidadores conectados ao Paciente
app.get('/v1/ayan/paciente/conectados/:id', cors(), async (request, response) => {
   let idPaciente = request.params.id

   let dadosPaciente = await controllerPaciente.getCuidadoresConectados(idPaciente)

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
app.post('/v1/ayan/conectar', cors(), bodyParserJSON, async (request, response) => {
   let idPaciente = request.query.idPaciente
   let idCuidador = request.query.idCuidador

   let resultDadosPaciente = await controllerPaciente.connectCuidadorAndPaciente(idPaciente, idCuidador)

   response.status(resultDadosPaciente.status)
   response.json(resultDadosPaciente)
})

//Update Paciente
app.put('/v1/ayan/paciente', validateJWT, cors(), bodyParserJSON, async (request, response) => {

   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body

      let resultDadosPaciente = await controllerPaciente.updatePaciente(dadosBody)

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
      let resultDadosEndereco = await controllerEndereco_Paciente.insertr(dadosBody)

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
 * Objetibo: API de controle de Teste de Humor.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/
//Get All (futuramente será um conjunto de GETs)
app.get('/v1/ayan/testes', cors(), async (request, response) => {
   let idPaciente = request.query.idPaciente

   if (idPaciente != undefined) {
      let dadosTeste = await controllerTeste_Humor.getTesteByPaciente(idPaciente);

      //Valida se existe registro
      response.json(dadosTeste)
      response.status(dadosTeste.status)
   } else {
      let dadosTeste = await controllerTeste_Humor.getTestes();

      //Valida se existe registro
      response.json(dadosTeste)
      response.status(dadosTeste.status)
   }
})

//Get por ID
app.get('/v1/ayan/teste/:id', cors(), async (request, response) => {
   let idTeste = request.params.id;

   //Recebe os dados do controller
   let dadosTeste = await controllerTeste_Humor.getTesteByID(idTeste);

   //Valida se existe registro
   response.json(dadosTeste)
   response.status(dadosTeste.status)
})

app.post('/v1/ayan/teste', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultDadosTeste = await controllerTeste_Humor.insertTeste(dadosBody)

      response.status(resultDadosTeste.status)
      response.json(resultDadosTeste)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

app.delete('/v1/ayan/teste/:id', cors(), async function (request, response) {
   let id = request.params.id;

   let returnTeste = await controllerTeste_Humor.getTesteByID(id)

   if (returnTeste.status == 404) {
      response.status(returnTeste.status)
      response.json(returnTeste)
   } else {
      let resultDadosTeste = await controllerTeste_Humor.deleteTeste(id)

      response.status(resultDadosTeste.status)
      response.json(resultDadosTeste)
   }
})

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
app.get('/v1/ayan/sintomas', cors(), async (request, response) => {
   //Recebe os dados do controller
   let dadosSintoma = await controllerSintoma.getSintomas();

   //Valida se existe registro
   response.json(dadosSintoma)
   response.status(dadosSintoma.status)
})

app.get('/v1/ayan/sintoma/:id', cors(), async (request, response) => {
   let idSintoma = request.params.id;

   //Recebe os dados do controller
   let dadosSintoma = await controllerSintoma.getSintomaByID(idSintoma);

   //Valida se existe registro
   response.json(dadosSintoma)
   response.status(dadosSintoma.status)
})


/*************************************************************************************
   * Objetibo: API de controle de Exercícios.
   * Autor: Lohannes da Silva Costa
   * Data: 04/09/2023
   * Versão: 1.0
   *************************************************************************************/
app.get('/v1/ayan/exercicios', cors(), async (request, response) => {
   //Recebe os dados do controller
   let dadosExercicio = await controllerExercicio.getExercicios();

   //Valida se existe registro
   response.json(dadosExercicio)
   response.status(dadosExercicio.status)
})

app.get('/v1/ayan/exercicio/:id', cors(), async (request, response) => {
   let idExercicio = request.params.id;

   //Recebe os dados do controller
   let dadosExercicio = await controllerExercicio.getExercicioByID(idExercicio);

   //Valida se existe registro
   response.json(dadosExercicio)
   response.status(dadosExercicio.status)
})


/*************************************************************************************
 * Objetibo: API de controle de Humor.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/
app.get('/v1/ayan/humores', cors(), async (request, response) => {
   //Recebe os dados do controller
   let dadosHumor = await controllerHumor.getHumores();

   //Valida se existe registro
   response.json(dadosHumor)
   response.status(dadosHumor.status)
})

app.get('/v1/ayan/opcoes', cors(), async (request, response) => {
   //Recebe os dados do controller
   let dadosHumor = await controllerHumor.getOpcoes();

   //Valida se existe registro
   response.json(dadosHumor)
   response.status(dadosHumor.status)
})

app.get('/v1/ayan/humor/:id', cors(), async (request, response) => {
   let idHumor = request.params.id;

   //Recebe os dados do controller
   let dadosHumor = await controllerHumor.getHumorByID(idHumor);

   //Valida se existe registro
   response.json(dadosHumor)
   response.status(dadosHumor.status)
})

/*************************************************************************************
 * Objetibo: API de controle de Contato.
 * Autor: Gustavo Souza Tenorio de Barros
 * Data: 27/09/2023
 * Versão: 1.0
 *************************************************************************************/

//Todos os Contatos
app.get('/v1/ayan/contatos', cors(), async (request, response) => {
   let idContatoPaciente = request.query.idContatoPaciente;

   if (idContatoPaciente != undefined) {

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

//Responsáveis do paciente
app.get('/v1/ayan/contato/responsavel/:id', cors(), async (request, response) => {
   let idPaciente = request.params.id

   let dadosContato = await controllerContato.getResponsavelByIDPaciente(idPaciente)

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
app.post('/v1/ayan/status-contato', cors(), bodyParserJSON, async (request, response) => {
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
//Get All 
app.get('/v1/ayan/medidas', cors(), async (request, response) => {
   //Recebe os dados do controller
   let dadosMedida = await controllerMedida.getMedidas();

   //Valida se existe registro
   response.json(dadosMedida)
   response.status(dadosMedida.status)
})

//Get por ID
app.get('/v1/ayan/medida/:id', cors(), async (request, response) => {
   let idMedida = request.params.id;

   //Recebe os dados do controller
   let dadosMedida = await controllerMedida.getMedidaByID(idMedida);

   //Valida se existe registro
   response.json(dadosMedida)
   response.status(dadosMedida.status)
})


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

app.get('/v2/ayan/medicamentos', cors(), async (request, response) => {
   let idPaciente = request.query.idPaciente

   let dadosMedicamento = await controllerMedicamento.getNomesMedicamentos(idPaciente)

   response.json(dadosMedicamento)
   response.status(dadosMedicamento.status)
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
app.put('/v1/ayan/medicamento/:id', cors(), bodyParserJSON, async (request, response) => {
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
app.delete('/v1/ayan/medicamento/:id', cors(), async (request, response) => {
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
 * Objetibo: API de controle de Eventos.
 * Autor: Lohannes da Silva Costa
 * Data: 04/09/2023
 * Versão: 1.0
 *************************************************************************************/
//Get ALL
app.get('/v1/ayan/eventos', cors(), async (request, response) => {
   let idCuidador = request.query.idCuidador
   let idPaciente = request.query.idPaciente

   if (idCuidador != undefined) {
      let dadosEvento = await controllerEvento.getEventoByCuidador(idCuidador)

      response.json(dadosEvento)
      response.status(dadosEvento.status)
   } else if (idPaciente != undefined) {
      let dadosEvento = await controllerEvento.getEventoByPaciente(idPaciente)

      response.json(dadosEvento)
      response.status(dadosEvento.status)
   } else {
      let dadosEvento = await controllerEvento.getAllEventos()

      response.json(dadosEvento)
      response.status(dadosEvento.status)
   }
})

//Get por ID
app.get('/v1/ayan/evento/:id', cors(), async (request, response) => {
   let idEvento = request.params.id;

   //Recebe os dados do controller
   let dadosEvento = await controllerEvento.getEventoByID(idEvento);

   //Valida se existe registro
   response.json(dadosEvento)
   response.status(dadosEvento.status)
})

//Insert Paciente
app.post('/v1/ayan/evento', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultDadosEvento = await controllerEvento.insertEvento(dadosBody)

      response.status(resultDadosEvento.status)
      response.json(resultDadosEvento)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Update Paciente
app.put('/v1/ayan/evento/:id', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {

      let id = request.params.id;

      let dadosBody = request.body

      let resultDadosEvento = await controllerEvento.updateEvento(dadosBody, id)

      response.status(resultDadosEvento.status)
      response.json(resultDadosEvento)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Delete paciente (No momento, apenas um Delete simples, pode não funcionar quando a tabela pa
app.delete('/v1/ayan/evento/:id', cors(), async function (request, response) {
   let id = request.params.id;

   let returnEvento = await controllerEvento.getEventoByID(id)

   if (returnEvento.status == 404) {
      response.status(returnEvento.status)
      response.json(returnEvento)
   } else {
      let resultDadosEvento = await controllerEvento.deleteEvento(id)

      response.status(resultDadosEvento.status)
      response.json(resultDadosEvento)
   }
})

/*************************************************************************************
 * Objetibo: API de controle de Eventos Semanais.
 * Autor: Lohannes da Silva Costa
 * Data: 23/10/2023
 * Versão: 1.0
 *************************************************************************************/
//Get ALL
app.get('/v1/ayan/eventos/semanal', cors(), async (request, response) => {
   let idCuidador = request.query.idCuidador
   let idPaciente = request.query.idPaciente

   if (idCuidador != undefined) {
      let dadosEvento = await controllerEventoSemanal.getEventoByCuidador(idCuidador)

      response.json(dadosEvento)
      response.status(dadosEvento.status)
   } else if (idPaciente != undefined) {
      let dadosEvento = await controllerEventoSemanal.getEventoByPaciente(idPaciente)

      response.json(dadosEvento)
      response.status(dadosEvento.status)
   } else {
      let dadosEvento = await controllerEventoSemanal.getAllEventos()

      response.json(dadosEvento)
      response.status(dadosEvento.status)
   }
})

//Get por ID
app.get('/v1/ayan/evento/semanal/:id', cors(), async (request, response) => {
   let idEvento = request.params.id;

   //Recebe os dados do controller
   let dadosEvento = await controllerEventoSemanal.getEventoByID(idEvento);

   //Valida se existe registro
   response.json(dadosEvento)
   response.status(dadosEvento.status)
})

//Insert Paciente
app.post('/v1/ayan/evento/semanal', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultDadosEvento = await controllerEventoSemanal.insertEvento(dadosBody)

      response.status(resultDadosEvento.status)
      response.json(resultDadosEvento)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Update Paciente
app.put('/v1/ayan/evento/semanal/:id', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {

      let id = request.params.id;

      let dadosBody = request.body

      let resultDadosEvento = await controllerEventoSemanal.updateEvento(dadosBody, id)

      response.status(resultDadosEvento.status)
      response.json(resultDadosEvento)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Delete paciente (No momento, apenas um Delete simples, pode não funcionar quando a tabela pa
app.delete('/v1/ayan/evento/semanal/:id', cors(), async function (request, response) {
   let id = request.params.id;

   let returnEvento = await controllerEventoSemanal.getEventoByID(id)

   if (returnEvento.status == 404) {
      response.status(returnEvento.status)
      response.json(returnEvento)
   } else {
      let resultDadosEvento = await controllerEventoSemanal.deleteEvento(id)

      response.status(resultDadosEvento.status)
      response.json(resultDadosEvento)
   }
})

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
app.put('/v1/ayan/cuidador', validateJWT, cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {

      let dadosBody = request.body

      let resultDadosCuidador = await controllerCuidador.updateCuidador(dadosBody)

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
app.put('/v1/ayan/alarme/:id', cors(), bodyParserJSON, async (request, response) => {
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
app.delete('/v1/ayan/alarme/:id', cors(), async (request, response) => {
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


/********************GET************************** */
//Get all Relatório 
app.get('/v1/ayan/relatorios', cors(), async (request, response) => {
   let idPaciente = request.query.idPaciente;
   let idCuidador = request.query.idCuidador;
   let data = request.query.data;

   if (idPaciente != undefined && idCuidador != undefined && data != undefined) {
      let dadosRelatorio = await controllerRelatorio.getRelatorioByIDCuidadorAndPacienteAndData(idCuidador, idPaciente, data);

      response.json(dadosRelatorio)
      response.status(dadosRelatorio.status)
   } else if (idPaciente != undefined && idCuidador != undefined) {
      let dadosRelatorio = await controllerRelatorio.getRelatorioByIDCuidadorAndPaciente(idCuidador, idPaciente);

      response.json(dadosRelatorio)
      response.status(dadosRelatorio.status)
   } else if (idPaciente != undefined) {
      let dadosRelatorio = await controllerRelatorio.getRelatorioByIDPaciente(idPaciente);

      response.json(dadosRelatorio)
      response.status(dadosRelatorio.status)
   } else if (idCuidador != undefined) {
      let dadosRelatorio = await controllerRelatorio.getRelatorioByIDCuidador(idCuidador);

      response.json(dadosRelatorio)
      response.status(dadosRelatorio.status)
   } else {
      let dadosRelatorio = await controllerRelatorio.getRelatorios();

      response.json(dadosRelatorio)
      response.status(dadosRelatorio.status)
   }
})

//Get id Relatorio 
app.get('/v1/ayan/relatorio/:id', cors(), async (request, response) => {
   let idRelatorio = request.params.id;

   let dadosRelatorio = await controllerRelatorio.getRelatorioByID(idRelatorio);

   response.json(dadosRelatorio)
   response.status(dadosRelatorio.status)
})

app.get('/v1/ayan/relatorios/datas/', cors(), async (request, response) => {
   let idPaciente = request.query.idPaciente;
   let idCuidador = request.query.idCuidador;

   let dadosRelatorio = await controllerRelatorio.getAllDatas(idCuidador, idPaciente);

   response.json(dadosRelatorio)
   response.status(dadosRelatorio.status)
})

/********************POST************************** */

app.post('/v1/ayan/relatorio', cors(), bodyParserJSON, async (request, response) => {

   let contentType = request.headers['content-type']

   if (String(contentType).toLowerCase() == 'application/json') {

      let dadosBody = request.body
      let resultDadosRelatorio = await controllerRelatorio.insertRelatorio(dadosBody)

      response.status(resultDadosRelatorio.status)
      response.json(resultDadosRelatorio)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }

})

/********************PUT************************** */
app.put('/v1/ayan/relatorio/:id', cors(), bodyParserJSON, async (request, response) => {

   let contentType = request.headers['content-type']

   if (String(contentType).toLowerCase() == 'application/json') {

      let id = request.params.id;

      let dadosBody = request.body

      let resultDadosRelatorio = await controllerRelatorio.updateRelatorio(dadosBody, id)

      response.status(resultDadosRelatorio.status)
      response.json(resultDadosRelatorio)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})
/************************** Delete ******************************/
app.delete('/v1/ayan/relatorio/:id', cors(), async function (request, response) {


   let id = request.params.id;

   let resultRelatorio = await controllerRelatorio.getRelatorioByID(id)

   if (resultRelatorio.status == 400) {
      response.status(resultRelatorio.status)
      response.json(resultRelatorio)
   } else {
      let resultDadosRelatorio = await controllerRelatorio.deleteRelatorio(id)

      response.status(resultDadosRelatorio.status)
      response.json(resultDadosRelatorio)
   }

})



/*************************************************************************************
 * Objetibo: API de controle de Questionario do Relatório.
 * Autor: Gustavo Souza Tenorio De Barros
 * Data: 11/10/2023
 * Versão: 1.0
 *************************************************************************************/

/********************GET************************** */
//Get all  Questionario
app.get('/v1/ayan/questionarios', cors(), async (request, response) => {
   let idRelatorio = request.query.idRelatorio

   if (idRelatorio != undefined) {
      let dadosQuestionario = await controllerQuestionario_Relatorio.getQuestionarioByRelatorio(idRelatorio)

      response.json(dadosQuestionario)
      response.status(dadosQuestionario.status)
   } else {
      let dadosQuestionario = await controllerQuestionario_Relatorio.getAllQuestionarios()

      response.json(dadosQuestionario)
      response.status(dadosQuestionario.status)
   }
})

//Get by id questionario
app.get('/v1/ayan/questionario/:id', cors(), async (request, response) => {
   let idQuestionario = request.params.id;

   //Recebe os dados do controller
   let dadosQuestionario = await controllerQuestionario_Relatorio.getQuestionarioByID(idQuestionario)
   //Valida se existe registro
   response.json(dadosQuestionario)
   response.status(dadosQuestionario.status)
})

/********************POST************************** */

app.post('/v1/ayan/questionario', cors(), bodyParserJSON, async (request, response) => {

   let contentType = request.headers['content-type']

   if (String(contentType).toLowerCase() == 'application/json') {

      let dadosBody = request.body
      let resultDadosQuestionario = await controllerQuestionario_Relatorio.insertQuestionario(dadosBody)

      response.status(resultDadosQuestionario.status)
      response.json(resultDadosQuestionario)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }

})


/*************************************************************************************
   * Objetibo: API de controle de Perguntas do Relatório.
   * Autor: Gustavo Souza Tenorio de Barros
   * Data: 01/10/2023
   * Versão: 1.0
 *************************************************************************************/

/********************GET************************** */
//Get all Perguntas 
app.get('/v1/ayan/perguntas', cors(), async (request, response) => {

   let dadosPerguntas = await controllerPergunta_Relatorio.getAllPerguntas()

   response.json(dadosPerguntas)
   response.status(dadosPerguntas.status)
})

//Get by ID Pergunta
app.get('/v1/ayan/pergunta/:id', cors(), async (request, response) => {
   let idPergunta = request.params.id;

   //Recebe os dados do controller
   let dadosPergunta = await controllerPergunta_Relatorio.getPerguntaByID(idPergunta)

   //Valida se existe registro
   response.json(dadosPergunta)
   response.status(dadosPergunta.status)
})

/********************POST************************** */
app.post('/v1/ayan/Pergunta', cors(), bodyParserJSON, async (request, response) => {

   let contentType = request.headers['content-type']

   if (String(contentType).toLowerCase() == 'application/json') {

      let dadosBody = request.body
      let resultDadosPergunta = await controllerPergunta_Relatorio.insertPergunta(dadosBody)


      response.status(resultDadosPergunta.status)
      response.json(resultDadosPergunta)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }

})

/*************************************************************************************
 * Objetibo: API de controle de Historicos Medicos.
 * Autor: Lohannes da Silva Costa
 * Data: 20/10/2023
 * Versão: 1.0
 *************************************************************************************/

app.get('/v1/ayan/historicos', cors(), async (request, response) => {
   let idPaciente = request.query.idPaciente

   if (idPaciente != undefined) {
      let dadosHistorico = await controllerHistorico.getHistoricoByPaciente(idPaciente);

      //Valida se existe registro
      response.json(dadosHistorico)
      response.status(dadosHistorico.status)
   } else {
      //Recebe os dados do controller
      let dadosHistorico = await controllerHistorico.getHistoricos();

      //Valida se existe registro
      response.json(dadosHistorico)
      response.status(dadosHistorico.status)
   }
})

//Get  por ID
app.get('/v1/ayan/historico/:id', cors(), async (request, response) => {
   let idHistorico = request.params.id;

   //Recebe os dados do controller
   let dadosHistorico = await controllerHistorico.getHistoricoByID(idHistorico);

   //Valida se existe registro
   response.json(dadosHistorico)
   response.status(dadosHistorico.status)
})

//Insert 
app.post('/v1/ayan/historico', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultDadosHistorico = await controllerHistorico.insertHistorico(dadosBody)

      response.status(resultDadosHistorico.status)
      response.json(resultDadosHistorico)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Update 
app.put('/v1/ayan/historico/:id', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {

      let id = request.params.id;


      let dadosBody = request.body

      let resultDadosHistorico = await controllerHistorico.updateHistorico(dadosBody, id)

      response.status(resultDadosHistorico.status)
      response.json(resultDadosHistorico)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

app.delete('/v1/ayan/historico/:id', cors(), async function (request, response) {
   let id = request.params.id;

   let returnHistorico = await controllerHistorico.getHistoricoByID(id)

   if (returnHistorico.status == 404) {
      response.status(returnHistorico.status)
      response.json(returnHistorico)
   } else {
      let resultDadosHistorico = await controllerHistorico.deleteHistorico(id)

      response.status(resultDadosHistorico.status)
      response.json(resultDadosHistorico)
   }
})

/*************************************************************************************
 * Objetibo: API de controle de Conexoes.
 * Autor: Lohannes da Silva Costa
 * Data: 24/10/2023
 * Versão: 1.0
 *************************************************************************************/

app.get('/v1/ayan/conexoes', cors(), async (request, response) => {
   let idPaciente = request.query.idPaciente
   let idCuidador = request.query.idCuidador
   let nomePaciente = request.query.nomePaciente
   let nomeCuidador = request.query.nomeCuidador

   if (idPaciente != undefined && nomeCuidador != undefined) {
      let dadosConexao = await controllerConexao.getConexaoByPacienteAndNomeCuidador(idPaciente, nomeCuidador);

      //Valida se existe registro
      response.json(dadosConexao)
      response.status(dadosConexao.status)
   } else if (idCuidador != undefined && nomePaciente != undefined) {
      let dadosConexao = await controllerConexao.getConexaoByCuidadorAndNomePaciente(idCuidador, nomePaciente);

      //Valida se existe registro
      response.json(dadosConexao)
      response.status(dadosConexao.status)
   } else if (idCuidador != undefined) {
      let dadosConexao = await controllerConexao.getConexaoByCuidador(idCuidador);

      //Valida se existe registro
      response.json(dadosConexao)
      response.status(dadosConexao.status)
   } else if (idPaciente != undefined) {
      let dadosConexao = await controllerConexao.getConexaoByPaciente(idPaciente);

      //Valida se existe registro
      response.json(dadosConexao)
      response.status(dadosConexao.status)
   } else {
      //Recebe os dados do controller
      let dadosConexao = await controllerConexao.getConexoes();

      //Valida se existe registro
      response.json(dadosConexao)
      response.status(dadosConexao.status)
   }
})

//Get  por ID
app.get('/v1/ayan/conexao/:id', cors(), async (request, response) => {
   let idConexao = request.params.id;

   //Recebe os dados do controller
   let dadosConexao = await controllerConexao.getConexaoByID(idConexao);

   //Valida se existe registro
   response.json(dadosConexao)
   response.status(dadosConexao.status)
})

//Update 
app.put('/v1/ayan/conexao/ativar/:id', cors(), async (request, response) => {
   let id = request.params.id;

   let resultDadosConexao = await controllerConexao.activateConnection(id)

   response.status(resultDadosConexao.status)
   response.json(resultDadosConexao)
})

app.put('/v1/ayan/conexao/desativar/:id', cors(), async (request, response) => {
   let id = request.params.id;

   let resultDadosConexao = await controllerConexao.deactivateConnection(id)

   response.status(resultDadosConexao.status)
   response.json(resultDadosConexao)
})

/**************************************************************************************
* Objetibo: API de controle de Cores.
* Autor: Lohannes da Silva Costa
* Data: 24/10/2023
* Versão: 1.0
*************************************************************************************/

/********************GET************************** */
//Get all Perguntas 
app.get('/v1/ayan/cores', cors(), async (request, response) => {
   let dadosCores = await controllerCor.getCores()

   response.json(dadosCores)
   response.status(dadosCores.status)
})

//Get by ID Pergunta
app.get('/v1/ayan/cor/:id', cors(), async (request, response) => {
   let id = request.params.id;

   //Recebe os dados do controller
   let dadosCores = await controllerCor.getCorByID(id)

   //Valida se existe registro
   response.json(dadosCores)
   response.status(dadosCores.status)
})

/*************************************************************************************
 * Objetibo: API de controle de Alarmes Unitários.
 * Autor: Lohannes da Silva Costa
 * Data: 08/11/2023
 * Versão: 1.0
 *************************************************************************************/

 app.get('/v1/ayan/alarmes/unitario', cors(), async (request, response) => {
   let idPaciente = request.query.idPaciente
   let idMedicamento = request.query.idMedicamento

   if (idPaciente != undefined) {
      let dadosAlarme = await controllerAlarme_Unitario.getAlarmeByIdPaciente(idPaciente);

      //Valida se existe registro
      response.json(dadosAlarme)
      response.status(dadosAlarme.status)
   } else if (idMedicamento != undefined) {
      let dadosAlarme = await controllerAlarme_Unitario.getAlarmeByIdMedicamento(idMedicamento);

      //Valida se existe registro
      response.json(dadosAlarme)
      response.status(dadosAlarme.status)
   } else {
      //Recebe os dados do controller
      let dadosAlarme = await controllerAlarme_Unitario.getAlarmes();

      //Valida se existe registro
      response.json(dadosAlarme)
      response.status(dadosAlarme.status)
   }
})

//Get  por ID
app.get('/v1/ayan/alarme/unitario/:id', cors(), async (request, response) => {
   let id = request.params.id;

   //Recebe os dados do controller
   let dadosAlarme = await controllerAlarme_Unitario.getAlarmeById(id);

   //Valida se existe registro
   response.json(dadosAlarme)
   response.status(dadosAlarme.status)
})

//Insert 
app.post('/v1/ayan/alarme/unitario', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let dadosBody = request.body
      let resultDadosAlarme = await controllerAlarme_Unitario.insertAlarme(dadosBody)

      response.status(resultDadosAlarme.status)
      response.json(resultDadosAlarme)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

//Update 
app.put('/v2/ayan/alarme/unitario/:id', cors(), bodyParserJSON, async (request, response) => {
   let contentType = request.headers['content-type']

   //Validação para receber dados apenas no formato JSON
   if (String(contentType).toLowerCase() == 'application/json') {
      let id = request.params.id;
      let dadosBody = request.body

      let resultDadosAlarme = await controllerAlarme_Unitario.updateAlarme(dadosBody, id)

      response.status(resultDadosAlarme.status)
      response.json(resultDadosAlarme)
   } else {
      response.status(messages.ERROR_INVALID_CONTENT_TYPE.status)
      response.json(messages.ERROR_INVALID_CONTENT_TYPE.message)
   }
})

/*************************************************************************************
 * Objetibo: API de controle de Calendário.
 * Autor: Lohannes da Silva Costa
 * Data: 08/11/2023
 * Versão: 1.0
 *************************************************************************************/

 app.get('/v1/ayan/calendario', cors(), async (request, response) => {
   let idPaciente = request.query.idPaciente
   let idCuidador = request.query.idCuidador
   let dia = request.query.dia
   let mes = request.query.mes
   let diaSemana = request.query.diaSemana.charAt(0).toUpperCase() + request.query.diaSemana.slice(1);

   if (idCuidador != undefined && idPaciente != undefined && dia != undefined && diaSemana != undefined) {
      let dadosCalendarioJSON = {}
      dadosCalendarioJSON.id_paciente = idPaciente
      dadosCalendarioJSON.id_cuidador = idCuidador
      dadosCalendarioJSON.dia = dia
      dadosCalendarioJSON.dia_semana = diaSemana

      let dadosCalendario = await controllerCalendario.getEventosAndAlarmesByCuidadorAndPaciente(dadosCalendarioJSON);

      //Valida se existe registro
      response.json(dadosCalendario)
      response.status(dadosCalendario.status)
   } else if (idPaciente != undefined && dia != undefined && diaSemana != undefined) {
      let dadosCalendarioJSON = {}
      dadosCalendarioJSON.id_paciente = idPaciente
      dadosCalendarioJSON.dia = dia
      dadosCalendarioJSON.dia_semana = diaSemana

      let dadosCalendario = await controllerCalendario.getEventosAndAlarmesByPaciente(dadosCalendarioJSON);

      //Valida se existe registro
      response.json(dadosCalendario)
      response.status(dadosCalendario.status)
   } else if (idPaciente != undefined && idCuidador != undefined && mes != undefined) {

      let dadosCalendarioJSON = {}
      dadosCalendarioJSON.id_paciente = idPaciente
      dadosCalendarioJSON.id_cuidador = idCuidador
      dadosCalendarioJSON.mes = mes

      let dadosCalendario = await controllerCalendario.getEventosByCuidador(dadosCalendarioJSON);

      //Valida se existe registro
      response.json(dadosCalendario)
      response.status(dadosCalendario.status)
   } else if (idPaciente != undefined && mes != undefined) {

      let dadosCalendarioJSON = {}
      dadosCalendarioJSON.id_paciente = idPaciente
      dadosCalendarioJSON.mes = mes

      let dadosCalendario = await controllerCalendario.getEventosByPaciente(dadosCalendarioJSON);

      //Valida se existe registro
      response.json(dadosCalendario)
      response.status(dadosCalendario.status)
   } else {
      response.json(messages.ERROR_NOT_FOUND)
      response.json(messages.ERROR_NOT_FOUND.status)
   }
})

/*************************************************************************************
 * Objetibo: API de controle de Notificações.
 * Autor: Lohannes da Silva Costa
 * Data: 08/11/2023
 * Versão: 1.0
 *************************************************************************************/

app.listen(8080, function () {
   ('Aguardando requisições na porta 8080...');
})
