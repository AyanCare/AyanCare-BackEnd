/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos  Alarme unitario no Banco de Dados.
 * Data: 02/11/2023
 * Autor: Gustavo Souza Tenorio de Barros
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllAlarmeUnitarios = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = `SELECT tbl_alarme_unitario_status.id as id, tbl_alarme_unitario_status.nome as nome, tbl_alarme_unitario_status.foto as foto, DATE_FORMAT(tbl_alarme_unitario_status.data_nascimento,'%d/%m/%Y') as data_nascimento, tbl_alarme_unitario_status.descricao_experiencia,
    tbl_genero.nome as genero
    FROM tbl_alarme_unitario_status
    inner join tbl_genero
    on tbl_genero.id = tbl_alarme_unitario_status.id_genero`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsAlarmeUnitario = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsAlarmeUnitario.length > 0) {
        return rsAlarmeUnitario
    } else {
        return false
    }

}

const selectAlarmeUnitarioById = async function (idAlarmeUnitario) {
    let sql = `SELECT tbl_alarme_unitario_status.id as id, tbl_alarme_unitario_status.nome as nome, tbl_alarme_unitario_status.email as email, tbl_alarme_unitario_status.foto as foto, DATE_FORMAT(tbl_alarme_unitario_status.data_nascimento,'%d/%m/%Y') as data_nascimento, tbl_alarme_unitario_status.descricao_experiencia,
    tbl_genero.nome as genero,
    tbl_endereco_alarmeunitario.id as endereco_id, tbl_endereco_alarmeunitario.logradouro as logradouro, tbl_endereco_alarmeunitario.bairro as bairro, tbl_endereco_alarmeunitario.numero as numero, tbl_endereco_alarmeunitario.cep as cep, tbl_endereco_alarmeunitario.cidade as cidade, tbl_endereco_alarmeunitario.estado as estado
    from tbl_alarme_unitario_status
    inner join tbl_genero
    on tbl_genero.id = tbl_alarme_unitario_status.id_genero
    inner join tbl_endereco_alarmeunitario
    on tbl_endereco_alarmeunitario.id = tbl_alarme_unitario_status.id_endereco_alarmeunitario
    where tbl_alarme_unitario_status.id = ${idAlarmeUnitario}`

    let rsAlarmeUnitario = await prisma.$queryRawUnsafe(sql)

    if (rsAlarmeUnitario.length > 0) {
        return rsAlarmeUnitario[0]
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = `SELECT tbl_alarme_unitario_status.id as id, tbl_alarme_unitario_status.nome as nome, tbl_alarme_unitario_status.foto as foto, DATE_FORMAT(tbl_alarme_unitario_status.data_nascimento,'%d/%m/%Y') as data_nascimento, tbl_alarme_unitario_status.email as email, tbl_alarme_unitario_status.senha as senha, tbl_alarme_unitario_status.descricao_experiencia,
    tbl_genero.nome as genero
    from tbl_alarme_unitario_status
    inner join tbl_genero
    on tbl_genero.id = tbl_alarme_unitario_status.id_genero
    order by tbl_alarme_unitario_status.id desc limit 1;`

    let rsAlarmeUnitario = await prisma.$queryRawUnsafe(sql)

    if (rsAlarmeUnitario.length > 0) {
        return rsAlarmeUnitario[0]
    } else {
        return false
    }
    
    //retorna o ultimo id inserido no banco de dados
}


const selectAlarmeUnitarioByEmailAndSenhaAndNome = async function (dadosAlarmeUnitario) {
    let sql = `select tbl_alarme_unitario_status.id as id, tbl_alarme_unitario_status.nome as nome, tbl_alarme_unitario_status.email as email, DATE_FORMAT(tbl_alarme_unitario_status.data_nascimento,'%d/%m/%Y') as data_nascimento, tbl_alarme_unitario_status.foto as foto, tbl_alarme_unitario_status.descricao_experiencia as experiencia,
	tbl_genero.nome as genero
    from tbl_alarme_unitario_status 
        inner join tbl_genero 
    on tbl_genero.id = tbl_alarme_unitario_status.id_genero
    where tbl_alarme_unitario_status.email = '${dadosAlarmeUnitario.email}' and tbl_alarme_unitario_status.senha = '${dadosAlarmeUnitario.senha}'`

    let rsAlarmeUnitario = await prisma.$queryRawUnsafe(sql)

    if (rsAlarmeUnitario.length > 0) {
        return rsAlarmeUnitario[0]
    } else {
        return false
    }
}


/************************** Inserts ******************************/
const insertAlarmeUnitario = async function (dadosAlarmeUnitario) {
    let sql = `insert into tbl_alarme_unitario_status(
        nome,
        data_nascimento,
        email,
        senha,
        foto,
        descricao_experiencia,
        id_endereco_alarmeunitario,
        id_genero
    ) values (
        '${dadosAlarmeUnitario.nome}',
        '2005-01-21',
        '${dadosAlarmeUnitario.email}',
        '${dadosAlarmeUnitario.senha}',
        '${dadosAlarmeUnitario.foto}',
        '${dadosAlarmeUnitario.descricao_experiencia}',
        1,
        1
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
const updateAlarmeUnitario = async function (dadosAlarmeUnitario) {
    let sql = `update tbl_alarme_unitario_status set
            nome = '${dadosAlarmeUnitario.nome}',
            data_nascimento = '${dadosAlarmeUnitario.data_nascimento}',
            foto = '${dadosAlarmeUnitario.foto}',
            descricao_experiencia = '${dadosAlarmeUnitario.descricao_experiencia}'
        where id = ${dadosAlarmeUnitario.id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

/************************** Deletes ******************************/
const deleteAlarmeUnitario = async function (idAlarmeUnitario) {
    let sql = `delete from tbl_alarme_unitario_status where id = ${idAlarmeUnitario}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

module.exports = {
    
    selectAlarmeUnitarioByEmailAndSenhaAndNome,
    selectAlarmeUnitarioById,
    selectAllAlarmeUnitarios,
    selectLastId,
    insertAlarmeUnitario,
    updateAlarmeUnitario,
    deleteAlarmeUnitario
    
}
