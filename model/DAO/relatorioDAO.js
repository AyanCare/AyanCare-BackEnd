/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Relatorio no Banco de Dados.
 * Data: 04/10/2023
 * Autor: Gustavo Souza Tenorio  de Barros
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/********************Selects************************** */




/********************Retorna Todos os relatorios************************** */
const selectAllRelatorio = async function(){

    let sql = 'SELECT * tbl_relatorio'
    
    let rsRelatorio= await prisma.$queryRawUnsafe(sql)

    if(rsRelatorio.length > 0){

        return rsRelatorio

    }else{
        return false
    }

}

/********************Select Pelo ID************************** */
const selectByIDRelatorio = async function(idRelatorio){

    let sql = `SELECT * tbl_relatorio FROM tbl_relatorio id = ${idRelatorio}`
    
    let rsRelatorio= await prisma.$queryRawUnsafe(sql)

    if(rsRelatorio.length > 0){

        return rsRelatorio[0]

    }else{
        return false
    }

}


/********************Select Pelo ID do paciente************************** */
const selectByIDPaciente = async function(idPaciente){

    let sql = `SELECT * FROM tbl_relatorio 
        inner join tbl_paciente 
    on tbl_relatorio.paciente_id = tbl_paciente.id
        where tbl_paciente.id = ${idPaciente}`
    
    let rsRelatorio= await prisma.$queryRawUnsafe(sql)

    if(rsRelatorio.length > 0){

        return rsRelatorio

    }else{
        return false
    }

}



/********************Select Pelo ID do Cuidador************************** */

const selectByIDCuidador = async function(idCuidador){

    let sql = `SELECT * FROM tbl_relatorio 
        inner join tbl_cuidador 
    on tbl_relatorio.cuidador_id = tbl_cuidador.id
        where tbl_cuidador.id = ${idCuidador}`
    
    let rsRelatorio= await prisma.$queryRawUnsafe(sql)

    if(rsRelatorio.length > 0){

        return rsRelatorio

    }else{
        return false
    }

}

/********************retorna o ultimo id inserido no banco de dados************************** */
const selectLastId = async function () {
    let sql = 'select * from tbl_relatorio order by id desc limit 1;'

    let rsRelatorio = await prisma.$queryRawUnsafe(sql)

    if (rsRelatorio.length > 0) {
        return rsRelatorio[0]
    } else {
        return false
    }

}

/************************** Inserts ******************************/


const insertRelatorio = async function(dadosRelatorio){
    let sql = `insert into tbl_Relatorio(
        data,
        horario,
        descricao,
        validacao,
        id_paciente,
        id_Relatorio
    ) values (
        CURDATE(),
        ${dadosRelatorio.horario},
        ${dadosRelatorio.descricao},
        ${dadosRelatorio.validacao},

    )`

    let resultRelatorio = await prisma.$executeRawUnsafe(sql)

    if (resultRelatorio) {
        return true
    }else{
        return false
    }
}


/************************** Updates ******************************/

const updateRelatorio = async function(dadosRelatorio){

    let sql = `update tbl_relatorio set 
        descricao = ${dadosRelatorio.descricao} where id = ${dadosRelatorio.id}
    `

    let resultRelatorio = await prisma.$executeRawUnsafe(sql)

    if(resultRelatorio){
        return true

    }else{
    
        return false
    }


}



/************************** Deletes ******************************/
const deleteRelatorio = async function (idRelatorio) {
    let sql = `delete from tbl_Relatorio where id = ${idRelatorio}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}


module.exports = {
    selectAllRelatorio,
    selectByIDRelatorio,
    selectLastId,
    selectByIDCuidador,
    selectByIDPaciente,
    insertRelatorio,
    updateRelatorio,
    deleteRelatorio
}