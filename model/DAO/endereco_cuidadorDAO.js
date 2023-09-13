/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos Enderecos dos Cuidadores no Banco de Dados.
 * Data: 11/06/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/


//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()


/************************** Selects ******************************/
const selectEnderecoById = async function (idEndereco) {
    let sql = `SELECT * FROM tbl_endereco_cuidador where id = ${idEndereco}`

    let rsEndereco = await prisma.$queryRawUnsafe(sql)

    if (rsEndereco.length > 0) {
        return rsEndereco
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = 'select * from tbl_endereco_cuidador order by id desc limit 1;'

    let rsEndereco = await prisma.$queryRawUnsafe(sql)

    if (rsEndereco.length > 0) {
        return rsEndereco
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

/************************** Inserts ******************************/

/****************************************************************************************
VVVVV Depois fazer o tratamento para caso exista um Endereco com dados parecidos!!! VVVVV
****************************************************************************************/
const insertEndereco = async function (dadosEndereco) {
    let sql = `insert into tbl_endereco_cuidador(
        logradouro,
        bairro,
        cep,
        numero,
        cidade,
        estado
    ) values (
        '${dadosEndereco.logradouro}'
        '${dadosEndereco.bairro}',
        '${dadosEndereco.cep}',
        '${dadosEndereco.numero}',
        '${dadosEndereco.cidade}',
        '${dadosEndereco.estado}'
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
const updateEndereco = async function (dadosEndereco) {
    let sql = `update tbl_endereco_cuidador set
            logradouro = '${dadosEndereco.logradouro}',
            bairro = '${dadosEndereco.bairro}',
            cep = '${dadosEndereco.cep}',
            numero = '${dadosEndereco.numero}',
            cidade = '${dadosEndereco.cidade}',
            estado = '${dadosEndereco.estado}'
        where id = ${dadosEndereco.id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

module.exports = {
    insertEndereco,
    selectLastId,
    selectEnderecoById
}