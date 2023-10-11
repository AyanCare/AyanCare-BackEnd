/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Questionario no Banco de Dados.
 * Data: 11/10/2023
 * Autor: Gustavo Souza Tenorio  de Barros
 * Versão: 1.0
 **************************************************************************************/

 //Import da biblioteca do prisma client
 var { PrismaClient } = require('@prisma/client');
 
 //Instância da classe PrismaClient
 var prisma = new PrismaClient()
 
 /********************Selects************************** */
 const selectAllQuestionario = async function () {
     let sql = 'Select * from tbl_questionario'

     let rsQuestionario = await prisma.$queryRawUnsafe(sql)

     if (rsQuestionario.length > 0) {
         
        return rsQuestionario
     } else {
         return false
     }
 }

 const selectQuestionarioByID = async function (idQuestionario){
 
    let sql = `SELECT * FROM tbl_questionario where id = ${idQuestionario}`
    let rsQuestionario = await prisma.$queryRawUnsafe(sql)

    if (rsQuestionario.length > 0) {
        return rsQuestionario [0]
    } else {
        return false
    }

}

 /**************************Inserts******************************/
 const insertQuestionario = async function (dadosQuestionario) {
     
    let sql = `insert into tbl_questionario(
        id_pergunta,
        resposta,
        id_relatorio
    ) values (
        ${dadosQuestionario.id_pergunta},
        '${dadosQuestionario.resposta}',
        ${dadosQuestionario.id_relatorio}
    )`
    

    let resultQuestionario = await prisma.$executeRawUnsafe(sql)

    if (resultQuestionario) {
        return true
    }else{
        return false
    }
}

module.exports ={
    selectAllQuestionario,
    selectQuestionarioByID,
    insertQuestionario
}