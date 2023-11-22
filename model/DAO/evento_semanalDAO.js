/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos EVENTOS RECORRENTES no Banco de Dados.
 * Data: 05/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/

const selectAllEventos = async function () {
    let sql = `SELECT tbl_nome_descricao_local_evento.id as id, 
    tbl_paciente.nome as paciente, tbl_cuidador.nome as cuidador,
    tbl_nome_descricao_local_evento.nome as nome, tbl_nome_descricao_local_evento.descricao as descricao, tbl_nome_descricao_local_evento.local as local,
    time_format(tbl_dia_semana_evento.horario, '%T') as horario, tbl_dia_semana_evento.status as status, tbl_dia_semana_evento.id as id_status,
    tbl_dia_semana.dia as dia, tbl_dia_semana.id as dia_id,
    tbl_cor.hex as cor
FROM tbl_dia_semana_evento
    inner join tbl_nome_descricao_local_evento
on tbl_nome_descricao_local_evento.id = tbl_dia_semana_evento.id_nome_descricao_local_evento
    inner join tbl_dia_semana
on tbl_dia_semana.id = tbl_dia_semana_evento.id_dia_semana
    inner join tbl_paciente_cuidador
on tbl_paciente_cuidador.id = tbl_dia_semana_evento.id_paciente_cuidador
    inner join tbl_paciente
on tbl_paciente.id = tbl_paciente_cuidador.id_paciente
    inner join tbl_cuidador
on tbl_cuidador.id = tbl_paciente_cuidador.id_cuidador
    inner join tbl_cor
on tbl_cor.id = tbl_nome_descricao_local_evento.id_cor`

    let rsEvento = await prisma.$queryRawUnsafe(sql)

    if (rsEvento.length > 0) {
        let dias = []
        let eventos = []

        let arrayIDDia = []
        let arrayIDEvento = []
        let arrayIDStatus = []

        rsEvento.forEach(evento => {
            if (!arrayIDEvento.includes(evento.id)) {
                let eventoJSON = {}

                arrayIDEvento.push(evento.id)
                eventoJSON.id = evento.id
                eventoJSON.paciente = evento.paciente
                eventoJSON.cuidador = evento.cuidador
                eventoJSON.nome = evento.nome
                eventoJSON.descricao = evento.descricao
                eventoJSON.local = evento.local
                eventoJSON.horario = evento.horario
                eventoJSON.cor = evento.cor

                rsEvento.forEach(repeticao => {
                    if (!arrayIDDia.includes(repeticao.dia_id) && !arrayIDStatus.includes(repeticao.id_status) && evento.id == repeticao.id) {
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

                eventoJSON.dias = dias
                eventos.push(eventoJSON)
            }

            arrayIDDia = []
            dias = []
        });

        return eventos
    } else {
        return false
    }
}

const selectEventoById = async function (idEvento) {
    let sql = `SELECT tbl_nome_descricao_local_evento.id as id, 
    tbl_paciente.nome as paciente, tbl_cuidador.nome as cuidador,
    tbl_nome_descricao_local_evento.nome as nome, tbl_nome_descricao_local_evento.descricao as descricao, tbl_nome_descricao_local_evento.local as local,
    time_format(tbl_dia_semana_evento.horario, '%T') as horario, tbl_dia_semana_evento.status as status, tbl_dia_semana_evento.id as id_status,
    tbl_dia_semana.dia as dia, tbl_dia_semana.id as dia_id,
    tbl_cor.hex as cor
FROM tbl_dia_semana_evento
    inner join tbl_nome_descricao_local_evento
on tbl_nome_descricao_local_evento.id = tbl_dia_semana_evento.id_nome_descricao_local_evento
    inner join tbl_dia_semana
on tbl_dia_semana.id = tbl_dia_semana_evento.id_dia_semana
    inner join tbl_paciente_cuidador
on tbl_paciente_cuidador.id = tbl_dia_semana_evento.id_paciente_cuidador
    inner join tbl_paciente
on tbl_paciente.id = tbl_paciente_cuidador.id_paciente
    inner join tbl_cuidador
on tbl_cuidador.id = tbl_paciente_cuidador.id_cuidador
    inner join tbl_cor
on tbl_cor.id = tbl_nome_descricao_local_evento.id_cor
    WHERE tbl_nome_descricao_local_evento.id = ${idEvento}`

    let rsEvento = await prisma.$queryRawUnsafe(sql)

    if (rsEvento.length > 0) {
        let dias = []
        let eventoJSON = {}
        

        let arrayIDDia = []

        rsEvento.forEach(evento => {
            eventoJSON.id = evento.id
            eventoJSON.paciente = evento.paciente
            eventoJSON.cuidador = evento.cuidador
            eventoJSON.nome = evento.nome
            eventoJSON.descricao = evento.descricao
            eventoJSON.local = evento.local
            eventoJSON.horario = evento.horario
            eventoJSON.cor = evento.cor

            if (!arrayIDDia.includes(evento.dia_id)) {
                let dia = {}

                arrayIDDia.push(evento.dia_id)
                dia.id = evento.dia_id
                dia.id_status = evento.dia_statu
                dia.dia = evento.dia

                if (evento.status === 1) {
                    dia.status = true
                } else {
                    dia.status = false
                }

                dias.push(dia)
            }

            eventoJSON.dias = dias
        });

        return eventoJSON
    } else {
        return false
    }
}

const selectEventoByCuidador = async function (idCuidador) {
    let sql = `SELECT tbl_nome_descricao_local_evento.id as id, 
    tbl_paciente.nome as paciente, tbl_cuidador.nome as cuidador,
    tbl_nome_descricao_local_evento.nome as nome, tbl_nome_descricao_local_evento.descricao as descricao, tbl_nome_descricao_local_evento.local as local,
    time_format(tbl_dia_semana_evento.horario, '%T') as horario, tbl_dia_semana_evento.status as status, tbl_dia_semana_evento.id as id_status,
    tbl_dia_semana.dia as dia, tbl_dia_semana.id as dia_id,
    tbl_cor.hex as cor
FROM tbl_dia_semana_evento
    inner join tbl_nome_descricao_local_evento
on tbl_nome_descricao_local_evento.id = tbl_dia_semana_evento.id_nome_descricao_local_evento
    inner join tbl_dia_semana
on tbl_dia_semana.id = tbl_dia_semana_evento.id_dia_semana
    inner join tbl_paciente_cuidador
on tbl_paciente_cuidador.id = tbl_dia_semana_evento.id_paciente_cuidador
    inner join tbl_paciente
on tbl_paciente.id = tbl_paciente_cuidador.id_paciente
    inner join tbl_cuidador
on tbl_cuidador.id = tbl_paciente_cuidador.id_cuidador
    inner join tbl_cor
on tbl_cor.id = tbl_nome_descricao_local_evento.id_cor
    WHERE tbl_cuidador.id = ${idCuidador}`

    let rsEvento = await prisma.$queryRawUnsafe(sql)

    if (rsEvento.length > 0) {
        let dias = []
        let eventos = []

        let arrayIDDia = []
        let arrayIDEvento = []
        let arrayIDStatus = []

        rsEvento.forEach(evento => {
            if (!arrayIDEvento.includes(evento.id)) {
                let eventoJSON = {}

                arrayIDEvento.push(evento.id)
                eventoJSON.id = evento.id
                eventoJSON.paciente = evento.paciente
                eventoJSON.cuidador = evento.cuidador
                eventoJSON.nome = evento.nome
                eventoJSON.descricao = evento.descricao
                eventoJSON.local = evento.local
                eventoJSON.horario = evento.horario
                eventoJSON.cor = evento.cor

                rsEvento.forEach(repeticao => {
                    if (!arrayIDDia.includes(repeticao.dia_id) && !arrayIDStatus.includes(repeticao.id_status) && evento.id == repeticao.id) {
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

                eventoJSON.dias = dias
                eventos.push(eventoJSON)
            }

            arrayIDDia = []
            dias = []
        });

        return eventos
    } else {
        return false
    }
}

const selectEventoByPaciente = async function (idPaciente) {
    let sql = `SELECT tbl_nome_descricao_local_evento.id as id, 
    tbl_paciente.nome as paciente, tbl_cuidador.nome as cuidador,
    tbl_nome_descricao_local_evento.nome as nome, tbl_nome_descricao_local_evento.descricao as descricao, tbl_nome_descricao_local_evento.local as local,
    time_format(tbl_dia_semana_evento.horario, '%T') as horario, tbl_dia_semana_evento.status as status, tbl_dia_semana_evento.id as id_status,
    tbl_dia_semana.dia as dia, tbl_dia_semana.id as dia_id,
    tbl_cor.hex as cor
FROM tbl_dia_semana_evento
    inner join tbl_nome_descricao_local_evento
on tbl_nome_descricao_local_evento.id = tbl_dia_semana_evento.id_nome_descricao_local_evento
    inner join tbl_dia_semana
on tbl_dia_semana.id = tbl_dia_semana_evento.id_dia_semana
    inner join tbl_paciente_cuidador
on tbl_paciente_cuidador.id = tbl_dia_semana_evento.id_paciente_cuidador
    inner join tbl_paciente
on tbl_paciente.id = tbl_paciente_cuidador.id_paciente
    inner join tbl_cuidador
on tbl_cuidador.id = tbl_paciente_cuidador.id_cuidador
    inner join tbl_cor
on tbl_cor.id = tbl_nome_descricao_local_evento.id_cor
    WHERE tbl_paciente.id = ${idPaciente}`

    let rsEvento = await prisma.$queryRawUnsafe(sql)

    if (rsEvento.length > 0) {
        let eventos = []
        let dias = []

        let arrayIDDia = []
        let arrayIDEvento = []
        let arrayIDStatus = []

        rsEvento.forEach(evento => {
            if (!arrayIDEvento.includes(evento.id)) {
                let eventoJSON = {}

                arrayIDEvento.push(evento.id)
                eventoJSON.id = evento.id
                eventoJSON.paciente = evento.paciente
                eventoJSON.cuidador = evento.cuidador
                eventoJSON.nome = evento.nome
                eventoJSON.descricao = evento.descricao
                eventoJSON.local = evento.local
                eventoJSON.horario = evento.horario
                eventoJSON.cor = evento.cor

                rsEvento.forEach(repeticao => {
                    if (!arrayIDDia.includes(repeticao.dia_id) && !arrayIDStatus.includes(repeticao.id_status) && evento.id == repeticao.id) {
                        let dia = {}

                        arrayIDDia.push(repeticao.dia_id)
                        arrayIDStatus.push(repeticao.id_status)
                        dia.id = repeticao.dia_id
                        dia.status_id = repeticao.id_status
                        dia.dia = repeticao.dia

                        if (repeticao.status === 1) {
                            dia.status = true
                        } else {
                            dia.status = false
                        }

                        dias.push(dia)
                    }
                })

                eventoJSON.dias = dias
                eventos.push(eventoJSON)
            }

            arrayIDDia = []
            dias = []
        });

        return eventos
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = `SELECT tbl_nome_descricao_local_evento.id as id, 
    tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador,
    tbl_nome_descricao_local_evento.nome as nome, tbl_nome_descricao_local_evento.descricao as descricao, tbl_nome_descricao_local_evento.local as local,
    time_format(tbl_dia_semana_evento.horario, '%T') as horario, tbl_dia_semana_evento.status as status, 
    tbl_dia_semana.dia as dia,tbl_dia_semana.id as dia_id,
    tbl_cor.hex as cor
FROM tbl_dia_semana_evento
    inner join tbl_nome_descricao_local_evento
on tbl_nome_descricao_local_evento.id = tbl_dia_semana_evento.id_nome_descricao_local_evento
    inner join tbl_dia_semana
on tbl_dia_semana.id = tbl_dia_semana_evento.id_dia_semana
    inner join tbl_paciente_cuidador
on tbl_paciente_cuidador.id = tbl_dia_semana_evento.id_paciente_cuidador
    inner join tbl_paciente
on tbl_paciente.id = tbl_paciente_cuidador.id_paciente
    inner join tbl_cuidador
on tbl_cuidador.id = tbl_paciente_cuidador.id_cuidador
    inner join tbl_cor
on tbl_cor.id = tbl_nome_descricao_local_evento.id_cor
order by tbl_nome_descricao_local_evento.id desc limit 7`

    let rsEvento = await prisma.$queryRawUnsafe(sql)

    if (rsEvento.length > 0) {
        let dias = []
        let eventoJSON = {}

        let arrayIDDia = []

        rsEvento.forEach(evento => {
            eventoJSON.id = evento.id
            eventoJSON.id_paciente = evento.id_paciente
            eventoJSON.paciente = evento.paciente
            eventoJSON.id_cuidador = evento.id_cuidador
            eventoJSON.cuidador = evento.cuidador
            eventoJSON.nome = evento.nome
            eventoJSON.descricao = evento.descricao
            eventoJSON.local = evento.local
            eventoJSON.horario = evento.horario
            eventoJSON.cor = evento.cor

            if (!arrayIDDia.includes(evento.dia_id)) {
                let dia = {}

                arrayIDDia.push(evento.dia_id)
                dia.id = evento.dia_id
                dia.dia = evento.dia

                if (evento.status === 1) {
                    dia.status = true
                } else {
                    dia.status = false
                }

                dias.push(dia)
            }

            let sortedList = dias.sort(function (a, b) {
                if (a.id < b.id) {
                    return -1;
                }
                if (a.id > b.id) {
                    return 1;
                }
            });

            eventoJSON.dias = sortedList
        });

        return eventoJSON
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

/************************** Inserts ******************************/

//call procInsertEventoSemanal('passeio', null, 'rua pitanga', '12:00', 1, 1, 0, 2, 1, 3, 0, 4, 0, 5, 1, 6, 1, 7, 0);

const insertEvento = async function (dadosEvento) {
    let sql = `call procInsertEventoSemanal(
        '${dadosEvento.nome}',
        '${dadosEvento.descricao}',
        '${dadosEvento.local}',
        ${dadosEvento.cor_id},
        '${dadosEvento.hora}',
        ${dadosEvento.id_paciente_cuidador},
        1,
        ${dadosEvento.domingo},
        2,
        ${dadosEvento.segunda},
        3,
        ${dadosEvento.terca},
        4,
        ${dadosEvento.quarta},
        5,
        ${dadosEvento.quinta},
        6,
        ${dadosEvento.sexta},
        7,
        ${dadosEvento.sabado}
    )`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

/************************** Updates ******************************/
const updateEvento = async function (dadosEvento) {
    let sql = `call procUpdateEventoSemanal(
        ${dadosEvento.id}, 
        '${dadosEvento.nome}', 
        '${dadosEvento.descricao}', 
        '${dadosEvento.local}', 
        ${dadosEvento.cor_id},
        '${dadosEvento.hora}', 
        ${dadosEvento.id_paciente_cuidador}, 
        ${dadosEvento.sabado_id}, 
        1, 
        ${dadosEvento.sabado}, 
        /**/
        ${dadosEvento.segunda_id}, 
        2, 
        ${dadosEvento.segunda}, 
        /**/
        ${dadosEvento.terca_id}, 
        3, 
        ${dadosEvento.terca}, 
        /**/
        ${dadosEvento.quarta_id}, 
        4, 
        ${dadosEvento.quarta}, 
        /**/
        ${dadosEvento.quinta_id}, 
        5, 
        ${dadosEvento.quinta}, 
        /**/
        ${dadosEvento.sexta_id}, 
        6, 
        ${dadosEvento.sexta}, 
        /**/
        ${dadosEvento.domingo_id}, 
        7, 
        ${dadosEvento.domingo}
    );`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

/************************** Deletes ******************************/
const deleteEvento = async function (idEvento) {
    let sql = `delete from tbl_nome_descricao_local_evento where id = ${idEvento};`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

module.exports = {
    deleteEvento,
    insertEvento,
    selectEventoById,
    selectLastId,
    updateEvento,
    selectEventoByPaciente,
    selectEventoByCuidador,
    selectAllEventos
}
