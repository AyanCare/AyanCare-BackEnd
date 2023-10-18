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
const selectAllRelatorios = async function(){

    let sql = `SELECT tbl_relatorio.id as id,
    tbl_paciente.nome as paciente,
    tbl_cuidador.nome as cuidador,
    DATE_FORMAT(tbl_relatorio.data,'%d/%m/%Y') as data, TIME_FORMAT(tbl_relatorio.horario, '%H:%i:%s') as horario, tbl_relatorio.texto_relatorio as texto_relatorio
    from tbl_relatorio
        inner join tbl_paciente
    on tbl_paciente.id = tbl_relatorio.id_paciente
        inner join tbl_cuidador
    on tbl_cuidador.id = tbl_relatorio.id_cuidador`
    
    let rsRelatorio= await prisma.$queryRawUnsafe(sql)

    if (rsRelatorio.length > 0) {
        return rsRelatorio
    } else {
        return false
    }

}

/********************Select Pelo ID************************** */
const selectByIDRelatorio = async function(idRelatorio){

    let sql = `SELECT tbl_relatorio.id as id,
    tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, tbl_paciente.data_nascimento as data_nascimento, TIMESTAMPDIFF(YEAR, tbl_paciente.data_nascimento, CURDATE()) AS idade,
    tbl_cuidador.nome as cuidador,
    DATE_FORMAT(tbl_relatorio.data,'%d/%m/%Y') as data, TIME_FORMAT(tbl_relatorio.horario, '%H:%i:%s') as horario, tbl_relatorio.texto_relatorio as texto_relatorio,
    tbl_pergunta.id as id_pergunta, tbl_pergunta.pergunta as pergunta,
    tbl_questionario.resposta as resposta, tbl_questionario.id as id_resposta
    from tbl_relatorio
        inner join tbl_paciente
    on tbl_paciente.id = tbl_relatorio.id_paciente
        inner join tbl_cuidador
    on tbl_cuidador.id = tbl_relatorio.id_cuidador
        inner join tbl_questionario
    on tbl_questionario.id_relatorio = tbl_relatorio.id
        inner join tbl_pergunta
    on tbl_pergunta.id = tbl_questionario.id_pergunta
    where id = ${idRelatorio}`

    let rsRelatorio = await prisma.$queryRawUnsafe(sql)

    if (rsRelatorio.length > 0) {

    } else {
        return false
    }

}

/********************Select Pelo ID do paciente************************** */
const selectByIDPaciente = async function (idPaciente) {

    let sql = `SELECT * FROM tbl_relatorio 
        inner join tbl_paciente 
    on tbl_paciente.id = tbl_relatorio.id_paciente
        where tbl_paciente.id = ${idPaciente}`

    let rsRelatorio = await prisma.$queryRawUnsafe(sql)

    if (rsRelatorio.length > 0) {

        return rsRelatorio

    } else {
        return false
    }

}

/********************Select Pelo ID do Cuidador************************** */

const selectByIDCuidador = async function (idCuidador) {

    let sql = `SELECT * FROM tbl_relatorio 
        inner join tbl_cuidador 
    on tbl_cuidador.id = tbl_relatorio.id_cuidador
        where tbl_cuidador.id = ${idCuidador}`

    let rsRelatorio = await prisma.$queryRawUnsafe(sql)

    if (rsRelatorio.length > 0) {

        return rsRelatorio

    } else {
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


const insertRelatorio = async function (dadosRelatorio) {
    let sql = `insert into tbl_relatorio(
        data,
        horario,
        texto_relatorio,
        validacao,
        id_paciente,
        id_cuidador 
    ) values (
        CURDATE(),
        CURTIME(),
        '${dadosRelatorio.texto_relatorio}',
        ${dadosRelatorio.validacao},
        2,
        4
    )`

    console.log(sql);
    let resultRelatorio = await prisma.$executeRawUnsafe(sql)

    

    if (resultRelatorio) {
        return true
    } else {
        return false
    }
}

/************************** Updates ******************************/

const updateRelatorio = async function (dadosRelatorio) {

    let sql = `update tbl_relatorio set 
        texto_relatorio = '${dadosRelatorio.texto_relatorio}' 
        where id = ${dadosRelatorio.id}
    `

    let resultRelatorio = await prisma.$executeRawUnsafe(sql)

    if (resultRelatorio) {
        return true
    } else {
        return false
    }
}

/************************** Deletes ******************************/
const deleteRelatorio = async function (idRelatorio) {
    let sql = `delete from tbl_relatorio where id = ${idRelatorio}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}


module.exports = {
    selectAllRelatorios,
    selectByIDRelatorio,
    selectLastId,
    selectByIDCuidador,
    selectByIDPaciente,
    insertRelatorio,
    updateRelatorio,
    deleteRelatorio
}