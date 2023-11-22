/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos TURNOSS ÚNICOS no Banco de Dados.
 * Data: 05/10/2023
 * Autor: Lohannes da Silva Costa & Gustavo Souza Tenorio de Barros
 * Versão: 1.0
 **************************************************************************************/


//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllTurnos = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = `SELECT tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente,
    tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador,
    tbl_turno_dia_semana.id as id, tbl_turno_dia_semana.status as status,TIME_FORMAT(tbl_turno_dia_semana.horario_inicio, '%H:%i:%s') as inicio, TIME_FORMAT(tbl_turno_dia_semana.horario_fim, '%H:%i:%s') as fim,
    tbl_dia_semana.dia as dia, tbl_dia_semana.id as id_dia_semana,
    tbl_cor.hex as cor,
    tbl_paciente_cuidador.id as id_conexao
FROM tbl_paciente_cuidador
    inner join tbl_turno_dia_semana
on tbl_turno_dia_semana.id_paciente_cuidador = tbl_paciente_cuidador.id
    inner join tbl_dia_semana
on tbl_dia_semana.id = tbl_turno_dia_semana.id_dia_semana
    inner join tbl_cor
on tbl_cor.id = tbl_turno_dia_semana.id_cor
    inner join tbl_paciente
on tbl_paciente.id = tbl_paciente_cuidador.id_paciente
    inner join tbl_cuidador
on tbl_cuidador.id = tbl_paciente_cuidador.id_cuidador`

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsTurnos = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsTurnos.length > 0) {
        let dias = []
        let turnos = []
        let usuarios = []

        let arrayIDDia = []
        let arrayIDTurno = []
        let arrayIDUsuario = []
        let arrayIDStatus = []

        rsTurnos.forEach(usuario => {
            if (!arrayIDUsuario.includes(usuario.id_conexao)) {
                let conexaoJSON = {}

                arrayIDEvento.push(usuario.id)
                conexaoJSON.id = usuario.id
                conexaoJSON.paciente = usuario.paciente
                conexaoJSON.cuidador = usuario.cuidador
                conexaoJSON.nome = usuario.nome
                conexaoJSON.descricao = usuario.descricao
                conexaoJSON.local = usuario.local
                conexaoJSON.horario = usuario.horario
                conexaoJSON.cor = usuario.cor

                rsEvento.forEach(repeticao => {
                    if (!arrayIDDia.includes(repeticao.dia_id) && !arrayIDStatus.includes(repeticao.id_status) && usuario.id == repeticao.id) {
                        let dia = {}

                        arrayIDDia.push(repeticao.dia_id)
                        arrayIDStatus.push(repeticao.id_status)
                        dia.id = repeticao.dia_id
                        dia.dia = repeticao.dia
                        dia.status_id = repeticao.id_status

                        if (repeticao.status === 1) {
                            dia.status = true
                        } else {
                            dia.status = false
                        }

                        dias.push(dia)
                    }
                })

                conexaoJSON.dias = dias
                eventos.push(conexaoJSON)
            }

            arrayIDDia = []
            dias = []
        });

        return turnos
    } else {
        return false
    }

}

const selectLastId = async function () {
    let sql = `SELECT tbl_turnos.id as id, tbl_turnos.nome as nome, tbl_turnos.foto as foto, DATE_FORMAT(tbl_turnos.data_nascimento,'%d/%m/%Y') as data_nascimento, tbl_turnos.email as email, tbl_turnos.senha as senha, tbl_turnos.descricao_experiencia,
    tbl_genero.nome as genero
    from tbl_turnos
    inner join tbl_genero
    on tbl_genero.id = tbl_turnos.id_genero
    order by tbl_turnos.id desc limit 7;`

    let rsTurnos = await prisma.$queryRawUnsafe(sql)

    if (rsTurnos.length > 0) {
        return rsTurnos
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}


const selectTurnosByPaciente = async function (dadosTurnos) {
    let sql = `select tbl_turnos.id as id, tbl_turnos.nome as nome, tbl_turnos.email as email, DATE_FORMAT(tbl_turnos.data_nascimento,'%d/%m/%Y') as data_nascimento, tbl_turnos.foto as foto, tbl_turnos.descricao_experiencia as experiencia,
	tbl_genero.nome as genero
    from tbl_turnos 
        inner join tbl_genero 
    on tbl_genero.id = tbl_turnos.id_genero
    where tbl_turnos.email = '${dadosTurnos.email}' and tbl_turnos.senha = '${dadosTurnos.senha}'`

    let rsTurnos = await prisma.$queryRawUnsafe(sql)

    if (rsTurnos.length > 0) {
        return rsTurnos[0]
    } else {
        return false
    }
}

const selectTurnosByCuidador = async function (emailTurnos) {
    let sql = `select * from tbl_turnos where email = '${emailTurnos}'`

    let rsTurnos = await prisma.$queryRawUnsafe(sql)

    if (rsTurnos.length > 0) {
        return rsTurnos
    } else {
        return false
    }
}


const selectTurnosEmail = async function (emailTurnos) {
    let sql = `select * from tbl_turnos where email = '${emailTurnos}'`

    let rsTurnos = await prisma.$queryRawUnsafe(sql)

    if (rsTurnos.length > 0) {
        return rsTurnos
    } else {
        return false
    }
}

/************************** Inserts ******************************/
const insertTurnos = async function (dadosTurnos) {
    let sql = `call procInsertTurnoDiaSemanaCor( 
        1, '${dadosTurnos.domingo}', 
        2, '${dadosTurnos.segunda}', 
        3, '${dadosTurnos.terca}', 
        4, '${dadosTurnos.quarta}', 
        5, '${dadosTurnos.quinta}', 
        6, '${dadosTurnos.sexta}', 
        7, '${dadosTurnos.sabado}', 
        '12:00', 
        '17:00', 
        ${dadosTurnos.idCor}, 
        ${dadosTurnos.idConexao}
    )`
    //talvez ID de endereco e de genero mudem de nome

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}


/************************** Deletes ******************************/
const deleteTurnos = async function (idConexao) {
    let sql = `delete from tbl_turno_dia_semana where id_paciente_cuidador = ${idConexao}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

async function log() {
    console.log(await selectAllTurnos());
}

log()

module.exports = {
    deleteTurnos,
    insertTurnos,
    selectAllTurnos,
    selectLastId,
    selectTurnosByCuidador,
    selectTurnosByPaciente

}
