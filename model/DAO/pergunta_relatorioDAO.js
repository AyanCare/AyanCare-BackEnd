/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Perguntas no Banco de Dados.
 * Data: 09/10/2023
 * Autor: Gustavo Souza Tenorio  de Barros
 * Versão: 1.0
 **************************************************************************************/

 var {PrismaClient} = require('@prisma/client')

 var prisma = new PrismaClient()
 
 /************************** Selects******************************/
  const selectAllPerguntas = async function (){
 
     let sql = 'Select * From tbl_pergunta'
 
     let rsPerguntas = await prisma.$queryRawUnsafe(sql)
 
 
     if (rsPerguntas.length > 0) {
         return rsPerguntas
     } else {
         return false
     }
 
 }
 
 
 
 const selectPerguntaByID = async function (idPergunta){
 
     let sql = `SELECT * FROM tbl_pergunta where id = ${idPergunta}`
     let rsPerguntas = await prisma.$queryRawUnsafe(sql)

     console.log(rsPerguntas);
 
 
     if (rsPerguntas.length > 0) {
         return rsPerguntas [0]
     } else {
         return false
     }
 
 }
 
 const selectLastId = async function(){
 
     let sql = 'select * from tbl_pergunta order by id desc limit 1;'
 
     let rsPergunta = await prisma.$queryRawUnsafe(sql)
 
 
     if (rsPergunta.length>0) {
         return rsPergunta [0]
     } else {
         return false
     }
 
 }
 
 
 
 
 
 
 /**************************Inserts******************************/
 
 const insertPergunta = async function (dadosPerguntas) {
     
     let sql = `insert into tbl_pergunta(
         pergunta
     ) values (
         '${dadosPerguntas.pergunta}'
     )`
     
 
     let resultPergunta = await prisma.$executeRawUnsafe(sql)
 
     if (resultPergunta) {
         return true
     }else{
         return false
     }
 }
 
 
 module.exports = {
     selectAllPerguntas,
     selectPerguntaByID,
     selectLastId,
     insertPergunta
 }