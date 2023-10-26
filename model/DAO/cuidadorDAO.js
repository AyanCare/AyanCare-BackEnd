/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos CUIDADORES no Banco de Dados.
 * Data: 11/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllCuidadores = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = `SELECT tbl_cuidador.id as id, tbl_cuidador.nome as nome, tbl_cuidador.foto as foto, DATE_FORMAT(tbl_cuidador.data_nascimento,'%d/%m/%Y') as data_nascimento, tbl_cuidador.descricao_experiencia,
    tbl_genero.nome as genero
    FROM tbl_cuidador
    inner join tbl_genero
    on tbl_genero.id = tbl_cuidador.id_genero`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsCuidador = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsCuidador.length > 0) {
        return rsCuidador
    } else {
        return false
    }

}

	nome, data_nascimento, foto, genero, descrição_experiencia

const selectCuidadorById = async function (idCuidador) {
    let sql = `SELECT tbl_cuidador.id as id, tbl_cuidador.nome as nome, tbl_cuidador.foto as foto, DATE_FORMAT(tbl_cuidador.data_nascimento,'%d/%m/%Y') as data_nascimento, tbl_cuidador.descricao_experiencia,
    tbl_genero.nome as genero,
    tbl_endereco_cuidador.id as endereco_id, tbl_endereco_cuidador.logradouro as logradouro, tbl_endereco_cuidador.bairro as bairro, tbl_endereco_cuidador.numero as numero, tbl_endereco_cuidador.cep as cep, tbl_endereco_cuidador.cidade as cidade, tbl_endereco_cuidador.estado as estado
    from tbl_cuidador
    inner join tbl_genero
    on tbl_genero.id = tbl_cuidador.id_genero
    inner join tbl_endereco_cuidador
    on tbl_endereco_cuidador.id = tbl_cuidador.id_endereco_cuidador
    FROM tbl_cuidador where tbl_cuidador.id = ${idCuidador}`

    let rsCuidador = await prisma.$queryRawUnsafe(sql)

    if (rsCuidador.length > 0) {
        return rsCuidador[0]
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = `SELECT tbl_cuidador.id as id, tbl_cuidador.nome as nome, tbl_cuidador.foto as foto, DATE_FORMAT(tbl_cuidador.data_nascimento,'%d/%m/%Y') as data_nascimento, tbl_cuidador.descricao_experiencia,
    tbl_genero.nome as genero
    from tbl_cuidador
    inner join tbl_genero
    on tbl_genero.id = tbl_cuidador.id_genero
    order by tbl_cuidador.id desc limit 1;`

    let rsCuidador = await prisma.$queryRawUnsafe(sql)

    if (rsCuidador.length > 0) {
        return rsCuidador[0]
    } else {
        return false
    }
    
    //retorna o ultimo id inserido no banco de dados
}

const selectCuidadorByEmailAndSenhaAndNome = async function (dadosCuidador) {
    let sql = `select tbl_cuidador.nome as nome, tbl_cuidador.email as email, DATE_FORMAT(tbl_cuidador.data_nascimento,'%d/%m/%Y') as data_nascimento, tbl_cuidador.foto as foto, tbl_cuidador.descricao_experiencia as experiencia,
	tbl_genero.nome as genero
    from tbl_cuidador 
        inner join tbl_genero 
    on tbl_genero.id = tbl_cuidador.id_genero
    where tbl_cuidador.email = '${dadosCuidador.email}' and tbl_cuidador.senha = '${dadosCuidador.senha}'`

    let rsCuidador = await prisma.$queryRawUnsafe(sql)

    if (rsCuidador.length > 0) {
        return rsCuidador[0]
    } else {
        return false
    }
}

const selectCuidadorByEmail = async function (emailCuidador) {
    let sql = `select * from tbl_cuidador where email = '${emailCuidador}'`

    let rsCuidador = await prisma.$queryRawUnsafe(sql)

    if (rsCuidador.length > 0) {
        return rsCuidador[0]
    } else {
        return false
    }
}

/************************** Inserts ******************************/

/****************************************************************************************
VVVVV Depois fazer o tratamento para caso exista um cuidador com dados parecidos!!! VVVVV
****************************************************************************************/
const insertCuidador = async function (dadosCuidador) {
    let sql = `insert into tbl_cuidador(
        nome,
        data_nascimento,
        email,
        senha,
        foto,
        descricao_experiencia,
        id_endereco_cuidador,
        id_genero
    ) values (
        '${dadosCuidador.nome}',
        '2005-01-21',
        '${dadosCuidador.email}',
        '${dadosCuidador.senha}',
        '${dadosCuidador.foto}',
        '${dadosCuidador.descricao_experiencia}',
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
const updateCuidador = async function (dadosCuidador) {
    let sql = `update tbl_cuidador set
            nome = '${dadosCuidador.nome}',
            data_nascimento = '${dadosCuidador.data_nascimento}',
            foto = '${dadosCuidador.foto}',
            descricao_experiencia = '${dadosCuidador.descricao_experiencia}'
        where id = ${dadosCuidador.id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const updateSenhaCuidador = async function (dadosCuidador) {
    let sql = `update tbl_paciente set
            senha = '${dadosCuidador.senha}'
        where id = ${dadosCuidador.id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const updateEnderecoCuidador = async function (idEndereco, idCuidador) {
    let sql = `update tbl_cuidador set
            id_endereco_cuidador = '${idEndereco}'
        where id = ${idCuidador}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
} 

/************************** Deletes ******************************/
const deleteCuidador = async function (idCuidador) {
    let sql = `delete from tbl_cuidador where id = ${idCuidador}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

module.exports = {
    deleteCuidador,
    insertCuidador,
    selectAllCuidadores,
    selectLastId,
    selectCuidadorById,
    selectCuidadorByEmailAndSenhaAndNome,
    updateCuidador,
    updateSenhaCuidador,
    selectCuidadorByEmail,
    updateEnderecoCuidador
}
