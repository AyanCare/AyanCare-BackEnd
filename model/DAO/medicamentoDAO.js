/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos MEDICAMENTO no Banco de Dados.
 * Data: 06/06/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllMedicamentos = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_Medicamento'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsMedicamento = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsMedicamento.length > 0) {
        return rsMedicamento
    } else {
        return false
    }

}

const selectMedicamentoById = async function (idMedicamento) {
    let sql = `SELECT * FROM tbl_Medicamento where id = ${idMedicamento}`

    let rsMedicamento = await prisma.$queryRawUnsafe(sql)

    if (rsMedicamento.length > 0) {
        return rsMedicamento
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = 'select * from tbl_Medicamento order by id desc limit 1;'

    let rsMedicamento = await prisma.$queryRawUnsafe(sql)

    if (rsMedicamento.length > 0) {
        return rsMedicamento
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

/************************** Inserts ******************************/

/****************************************************************************************
VVVVV Depois fazer o tratamento para caso exista um Medicamento com dados parecidos!!! VVVVV
****************************************************************************************/
const insertMedicamento = async function (dadosMedicamento) {
    let sql = `insert into tbl_Medicamento(
        nome,
        quantidade,
        data_validade,
        estocado,
        id_paciente,
        id_medida
    ) values (
        '${dadosMedicamento.nome}'
        '${dadosMedicamento.quantidade}',
        '${dadosMedicamento.data_validade}',
        '${dadosMedicamento.estocado}',
        ${dadosMedicamento.id_paciente},
        ${dadosMedicamento.id_medida}
    )`
    //talvez ID de endereco e de genero mudem de nome

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

/************************** Updates ******************************/
const updateMedicamento = async function (dadosMedicamento) {
    let sql = `update tbl_Medicamento set
            nome = '${dadosMedicamento.nome}',
            quantidade = '${dadosMedicamento.quantidade}',
            data_validade = '${dadosMedicamento.data_validade}',
            estocado = '${dadosMedicamento.estocado}'
        where id = ${dadosMedicamento.id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

/************************** Deletes ******************************/
const deleteMedicamento = async function (idMedicamento) {
    let sql = `delete from tbl_Medicamento where id = ${idMedicamento}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

module.exports = {
    deleteMedicamento,
    insertMedicamento,
    selectAllMedicamentos,
    selectLastId,
    selectMedicamentoById
}