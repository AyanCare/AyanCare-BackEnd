/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos HORÁRIOS no Banco de Dados.
 * Data: 20/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllHorarios = async function (){
    let sql = `select tbl_horario.id ,time_format( tbl_Horario.hora, '%H:%i') as hora from tbl_horario`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsHorario = await prisma.$queryRawUnsafe(sql)

    if(rsHorario.length > 0){
        return rsHorario
    } else {
        return false
    }
}

const selectHorarioById = async function (idHorario){
    let sql = `select tbl_horario.id ,time_format( tbl_Horario.hora, '%H:%i') as hora from tbl_horario where id = ${idHorario}`

    let rsHorario = await prisma.$queryRawUnsafe(sql)

    if(rsHorario.length > 0){
        return rsHorario
    } else {
        return false
    }

}

const selectLastId = async function () {
    let sql = `select tbl_horario.id ,time_format( tbl_Horario.hora, '%H:%i') as hora from tbl_horario order by id desc limit 1;`

    let rsHorario = await prisma.$queryRawUnsafe(sql)

    if (rsHorario.length > 0) {
        return rsHorario
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

/************************** Inserts ******************************/
const insertHorario = async function (dadosHorario){
    let sql = `insert into tbl_horario(
        hora
    ) values (
        '${dadosHorario.hora}'
    )`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    }else{
        return false
    }
}

/************************** Updates ******************************/
const updateHorario = async function (dadosHorario){
    let sql = `update tbl_horario set
        hora = '${dadosHorario.hora}'
    where id = ${dadosHorario.id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    }else{
        return false
    }
}

/************************** Deletes ******************************/
const deleteHorario = async function (id){
    let sql = `delete from tbl_horario where id = ${id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if(resultStatus){
        return true
    }else{
        return false
    }
}

module.exports = {
    deleteHorario,
    insertHorario,
    selectAllHorarios,
    selectHorarioById,
    updateHorario,
    selectLastId
}