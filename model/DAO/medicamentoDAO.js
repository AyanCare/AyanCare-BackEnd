/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos MEDICAMENTO no Banco de Dados.
 * Data: 06/09/2023
 * Autor: Lohannes da Silva Costa
 * Data Atualização mais Recente: 29/09/2023
 * Versão: 2.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllMedicamentos = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'select * from tbl_medicamento;'

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

const selectMedicamentosNomes = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'select DISTINCT tbl_medicamento.nome from tbl_medicamento;'

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

const selectMedicamentoByNameAndMedidaAndPaciente = async function (nomeMedicamento, idPaciente, idMedida) {
    let sql = ` select * from tbl_medicamento
        inner join tbl_paciente
    on tbl_paciente.id = tbl_medicamento.id_paciente
        inner join tbl_medida
    on tbl_medida.id = tbl_medicamento.id_medida
    where tbl_paciente.id = ${idPaciente} and tbl_medicamento.nome like '${nomeMedicamento}' and tbl_medida.id = ${idMedida}`

    let rsMedicamento = await prisma.$queryRawUnsafe(sql)

    if (rsMedicamento.length > 0) {
        return rsMedicamento
    } else {
        return false
    }
}

const selectMedicamentoById = async function (idMedicamento) {
    let sql = `SELECT * FROM tbl_medicamento where id = ${idMedicamento}`

    let rsMedicamento = await prisma.$queryRawUnsafe(sql)

    if (rsMedicamento.length > 0) {
        return rsMedicamento[0]
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = 'select * from tbl_medicamento order by id desc limit 1;'

    let rsMedicamento = await prisma.$queryRawUnsafe(sql)

    if (rsMedicamento.length > 0) {
        return rsMedicamento[0]
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

const selectAllMedicamentosByPaciente =  async function (idPaciente) {
    let sql = `select tbl_medicamento.* from tbl_medicamento
    inner join tbl_paciente on tbl_paciente.id = tbl_medicamento.id_paciente
    where tbl_paciente.id = ${idPaciente} and tbl_medicamento.estocado = 1`

    let rsMedicamento = await prisma.$queryRawUnsafe(sql)

    if (rsMedicamento.length > 0) {
        return rsMedicamento
    } else {
        return false
    }
}

/************************** Inserts ******************************/
const insertMedicamento = async function (dadosMedicamento) {
    let sql = `insert into tbl_medicamento(
        nome,
        quantidade,
        limite,
        data_validade,
        estocado,
        id_paciente,
        id_medida
    ) values (
        '${dadosMedicamento.nome}',
        1,
        1,
        '${dadosMedicamento.data_validade}',
        false,
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
    let sql = `update tbl_medicamento set
            quantidade = '${dadosMedicamento.quantidade}',
            limite = '${dadosMedicamento.limite},
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
    let sql = `delete from tbl_medicamento where id = ${idMedicamento}`

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
    selectMedicamentoById,
    selectAllMedicamentosByPaciente,
    updateMedicamento,
    selectMedicamentoByNameAndMedidaAndPaciente,
    selectMedicamentosNomes
}
