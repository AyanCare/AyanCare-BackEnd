/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos TESTES DE HUMORES no Banco de Dados.
 * Data: 17/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllTestes = async function () {
    let sql = `SELECT tbl_data_horario_observacao_humor.id as id,
    tbl_paciente.nome as paciente,
    DATE_FORMAT(tbl_data_horario_observacao_humor.data,'%d/%m/%Y') as data, TIME_FORMAT(tbl_data_horario_observacao_humor.horario, '%H:%i:%s') as horario, tbl_data_horario_observacao_humor.observacao as observacao,
    tbl_sintoma.sintoma as nome_sintoma, tbl_sintoma.imagem as imagem_sintoma, tbl_sintoma.id as id_sintoma,
    tbl_resposta.resposta as nome_humor, tbl_resposta.imagem as imagem_humor, tbl_resposta.id as id_humor,
    tbl_exercicio.exercicio as nome_exercicio, tbl_exercicio.imagem as imagem_exercicio, tbl_exercicio.id as id_exercicio,
    tbl_sintoma_status.status_sintoma as status_sintoma, tbl_sintoma_status.id as id_statusSintoma,
    tbl_resposta_status.status_resposta as status_humor, tbl_resposta_status.id as id_statusHumor,
    tbl_exercicio_status.status_exercicio as status_exercicio, tbl_exercicio_status.id as id_statusExercicio
FROM tbl_data_horario_observacao_humor
    inner join tbl_humor_resposta_exercicio_sintoma_paciente
on tbl_humor_resposta_exercicio_sintoma_paciente.id_data_horario_observacao_humor = tbl_data_horario_observacao_humor.id
    inner join tbl_paciente
on tbl_paciente.id = tbl_humor_resposta_exercicio_sintoma_paciente.id_paciente
    inner join tbl_sintoma_status
on tbl_humor_resposta_exercicio_sintoma_paciente.id_sintoma = tbl_sintoma_status.id
    inner join tbl_exercicio_status
on tbl_humor_resposta_exercicio_sintoma_paciente.id_exercicio = tbl_exercicio_status.id
    inner join tbl_resposta_status
on tbl_humor_resposta_exercicio_sintoma_paciente.id_resposta = tbl_resposta_status.id
    inner join tbl_sintoma
on tbl_sintoma_status.tbl_sintoma_id = tbl_sintoma.id
    inner join tbl_resposta
on tbl_resposta_status.id_resposta = tbl_resposta.id
    inner join tbl_exercicio
on tbl_exercicio_status.id_exercicio = tbl_exercicio.id`

    let rsTeste = await prisma.$queryRawUnsafe(sql)

    if (rsTeste.length > 0) {
        let sintomas = []
        let humores = []
        let exercicios = []
        let testes = []

        let arrayIDEventos = []
        let arrayIDSintoma = []
        let arrayIDHumor = []
        let arrayIDExercicio = []
        let arrayIDStatus_Sintoma = []
        let arrayIDStatus_Humor = []
        let arrayIDStatus_Exercicio = []

        rsTeste.forEach(teste => {
            if (!arrayIDEventos.includes(teste.id)) {
                let testeJSON = {}

                arrayIDEventos.push(teste.id)
                testeJSON.id = teste.id
                testeJSON.paciente = teste.paciente
                testeJSON.data = teste.data
                testeJSON.horario = teste.horario
                testeJSON.observacao = teste.observacao

                rsTeste.forEach(repeticao => {
                    if (!arrayIDSintoma.includes(repeticao.id_sintoma) && !arrayIDStatus_Sintoma.includes(repeticao.id_statusSintoma) && repeticao.status_sintoma === 1 && repeticao.id == teste.id) {
                        let sintoma = {}

                        arrayIDSintoma.push(repeticao.id_sintoma)
                        arrayIDStatus_Sintoma.push(repeticao.id_statusSintoma)

                        sintoma.id = repeticao.id_sintoma
                        sintoma.nome = repeticao.nome_sintoma
                        sintoma.id_status = repeticao.id_statusSintoma
                        sintoma.icone = repeticao.imagem_sintoma

                        sintomas.push(sintoma)
                    }
                });

                rsTeste.forEach(repeticao => {
                    if (!arrayIDHumor.includes(repeticao.id_humor) && !arrayIDStatus_Humor.includes(repeticao.id_statusHumor) && repeticao.status_humor === 1 && repeticao.id == teste.id) {
                        let humor = {}

                        arrayIDHumor.push(repeticao.id_humor)
                        arrayIDStatus_Humor.push(repeticao.id_statusHumor)

                        humor.id = repeticao.id_humor
                        humor.nome = repeticao.nome_humor
                        humor.id_status = repeticao.id_statusHumor
                        humor.icone = repeticao.imagem_humor

                        humores.push(humor)
                    }
                });

                rsTeste.forEach(repeticao => {
                    if (!arrayIDExercicio.includes(repeticao.id_exercicio) && !arrayIDStatus_Exercicio.includes(repeticao.id_statusExercicio) && repeticao.status_exercicio === 1 && repeticao.id == teste.id) {
                        let exercicio = {}

                        arrayIDExercicio.push(repeticao.id_exercicio)
                        arrayIDStatus_Exercicio.push(repeticao.id_statusExercicio)

                        exercicio.id = repeticao.id_exercicio
                        exercicio.nome = repeticao.nome_exercicio
                        exercicio.id_status = repeticao.id_statusExercicio
                        exercicio.icone = repeticao.imagem_exercicio

                        exercicios.push(exercicio)
                    }
                });

                testeJSON.sintomas = sintomas
                testeJSON.humores = humores
                testeJSON.exercicios = exercicios

                testes.push(testeJSON)
            }

            arrayIDSintoma = []
            arrayIDHumor = []
            arrayIDExercicio = []
            sintomas = []
            humores = []
            exercicios = []
        })

        return testes
    } else {
        return false
    }
}

const selectTesteById = async function (idTeste) {
    let sql = `SELECT tbl_data_horario_observacao_humor.id as id,
        tbl_paciente.nome as paciente,
        DATE_FORMAT(tbl_data_horario_observacao_humor.data,'%d/%m/%Y') as data, TIME_FORMAT(tbl_data_horario_observacao_humor.horario, '%H:%i:%s') as horario, tbl_data_horario_observacao_humor.observacao as observacao,
        tbl_sintoma.sintoma as nome_sintoma, tbl_sintoma.imagem as imagem_sintoma, tbl_sintoma.id as id_sintoma,
        tbl_resposta.resposta as nome_humor, tbl_resposta.imagem as imagem_humor, tbl_resposta.id as id_humor,
        tbl_exercicio.exercicio as nome_exercicio, tbl_exercicio.imagem as imagem_exercicio, tbl_exercicio.id as id_exercicio,
        tbl_sintoma_status.status_sintoma as status_sintoma, tbl_sintoma_status.id as id_statusSintoma,
        tbl_resposta_status.status_resposta as status_humor, tbl_resposta_status.id as id_statusHumor,
        tbl_exercicio_status.status_exercicio as status_exercicio, tbl_exercicio_status.id as id_statusExercicio
    FROM tbl_data_horario_observacao_humor
        inner join tbl_humor_resposta_exercicio_sintoma_paciente
    on tbl_humor_resposta_exercicio_sintoma_paciente.id_data_horario_observacao_humor = tbl_data_horario_observacao_humor.id
        inner join tbl_paciente
    on tbl_paciente.id = tbl_humor_resposta_exercicio_sintoma_paciente.id_paciente
        inner join tbl_sintoma_status
    on tbl_humor_resposta_exercicio_sintoma_paciente.id_sintoma = tbl_sintoma_status.id
        inner join tbl_exercicio_status
    on tbl_humor_resposta_exercicio_sintoma_paciente.id_exercicio = tbl_exercicio_status.id
        inner join tbl_resposta_status
    on tbl_humor_resposta_exercicio_sintoma_paciente.id_resposta = tbl_resposta_status.id
        inner join tbl_sintoma
    on tbl_sintoma_status.tbl_sintoma_id = tbl_sintoma.id
        inner join tbl_resposta
    on tbl_resposta_status.id_resposta = tbl_resposta.id
        inner join tbl_exercicio
    on tbl_exercicio_status.id_exercicio = tbl_exercicio.id
    where tbl_data_horario_observacao_humor.id = ${idTeste}`

    let rsTeste = await prisma.$queryRawUnsafe(sql)

    if (rsTeste.length > 0) {
        let testeJSON = {}
        let sintomas = []
        let humores = []
        let exercicios = []

        let arrayIDSintoma = []
        let arrayIDHumor = []
        let arrayIDExercicio = []
        let arrayIDStatus_Sintoma = []
        let arrayIDStatus_Humor = []
        let arrayIDStatus_Exercicio = []

        rsTeste.forEach(teste => {
            testeJSON.id = teste.id
            testeJSON.paciente = teste.paciente
            testeJSON.data = teste.data
            testeJSON.horario = teste.horario
            testeJSON.observacao = teste.observacao

            rsTeste.forEach(repeticao => {
                if (!arrayIDSintoma.includes(repeticao.id_sintoma) && !arrayIDStatus_Sintoma.includes(repeticao.id_statusSintoma) && repeticao.status_sintoma === 1) {
                    let sintoma = {}

                    arrayIDSintoma.push(repeticao.id_sintoma)
                    arrayIDStatus_Sintoma.push(repeticao.id_statusSintoma)

                    sintoma.id = repeticao.id_sintoma
                    sintoma.nome = repeticao.nome_sintoma
                    sintoma.icone = repeticao.imagem_sintoma

                    sintomas.push(sintoma)
                }
            });

            rsTeste.forEach(repeticao => {
                if (!arrayIDHumor.includes(repeticao.id_humor) && !arrayIDStatus_Humor.includes(repeticao.id_statusHumor) && repeticao.status_humor === 1) {
                    let humor = {}

                    arrayIDHumor.push(repeticao.id_humor)
                    arrayIDStatus_Humor.push(repeticao.id_statusHumor)

                    humor.id = repeticao.id_humor
                    humor.nome = repeticao.nome_humor
                    humor.icone = repeticao.imagem_humor

                    humores.push(humor)
                }
            });

            rsTeste.forEach(repeticao => {
                if (!arrayIDExercicio.includes(repeticao.id_exercicio) && !arrayIDStatus_Exercicio.includes(repeticao.id_statusExercicio) && repeticao.status_exercicio === 1) {
                    let exercicio = {}

                    arrayIDExercicio.push(repeticao.id_exercicio)
                    arrayIDStatus_Exercicio.push(repeticao.id_statusExercicio)

                    exercicio.id = repeticao.id_exercicio
                    exercicio.nome = repeticao.nome_exercicio
                    exercicio.icone = repeticao.imagem_exercicio

                    exercicios.push(exercicio)
                }
            });

            testeJSON.sintomas = sintomas
            testeJSON.humores = humores
            testeJSON.exercicios = exercicios
        })

        return testeJSON
    } else {
        return false
    }
}

const selectTesteByPaciente = async function (idPaciente) {
    let sql = `SELECT tbl_data_horario_observacao_humor.id as id,
        tbl_paciente.nome as paciente,
        DATE_FORMAT(tbl_data_horario_observacao_humor.data,'%d/%m/%Y') as data, TIME_FORMAT(tbl_data_horario_observacao_humor.horario, '%H:%i:%s') as horario, tbl_data_horario_observacao_humor.observacao as observacao,
        tbl_sintoma.sintoma as nome_sintoma, tbl_sintoma.imagem as imagem_sintoma, tbl_sintoma.id as id_sintoma,
        tbl_resposta.resposta as nome_humor, tbl_resposta.imagem as imagem_humor, tbl_resposta.id as id_humor,
        tbl_exercicio.exercicio as nome_exercicio, tbl_exercicio.imagem as imagem_exercicio, tbl_exercicio.id as id_exercicio,
        tbl_sintoma_status.status_sintoma as status_sintoma, tbl_sintoma_status.id as id_statusSintoma,
        tbl_resposta_status.status_resposta as status_humor, tbl_resposta_status.id as id_statusHumor,
        tbl_exercicio_status.status_exercicio as status_exercicio, tbl_exercicio_status.id as id_statusExercicio
    FROM tbl_data_horario_observacao_humor
        inner join tbl_humor_resposta_exercicio_sintoma_paciente
    on tbl_humor_resposta_exercicio_sintoma_paciente.id_data_horario_observacao_humor = tbl_data_horario_observacao_humor.id
        inner join tbl_paciente
    on tbl_paciente.id = tbl_humor_resposta_exercicio_sintoma_paciente.id_paciente
        inner join tbl_sintoma_status
    on tbl_humor_resposta_exercicio_sintoma_paciente.id_sintoma = tbl_sintoma_status.id
        inner join tbl_exercicio_status
    on tbl_humor_resposta_exercicio_sintoma_paciente.id_exercicio = tbl_exercicio_status.id
        inner join tbl_resposta_status
    on tbl_humor_resposta_exercicio_sintoma_paciente.id_resposta = tbl_resposta_status.id
        inner join tbl_sintoma
    on tbl_sintoma_status.tbl_sintoma_id = tbl_sintoma.id
        inner join tbl_resposta
    on tbl_resposta_status.id_resposta = tbl_resposta.id
        inner join tbl_exercicio
    on tbl_exercicio_status.id_exercicio = tbl_exercicio.id
    where tbl_paciente.id = ${idPaciente}`

    let rsTeste = await prisma.$queryRawUnsafe(sql)

    if (rsTeste.length > 0) {
        let sintomas = []
        let humores = []
        let exercicios = []
        let testes = []

        let arrayIDEventos = []
        let arrayIDSintoma = []
        let arrayIDHumor = []
        let arrayIDExercicio = []
        let arrayIDStatus_Sintoma = []
        let arrayIDStatus_Humor = []
        let arrayIDStatus_Exercicio = []

        rsTeste.forEach(teste => {
            if (!arrayIDEventos.includes(teste.id)) {
                let testeJSON = {}

                arrayIDEventos.push(teste.id)
                testeJSON.id = teste.id
                testeJSON.paciente = teste.paciente
                testeJSON.data = teste.data
                testeJSON.horario = teste.horario
                testeJSON.observacao = teste.observacao

                rsTeste.forEach(repeticao => {
                    if (!arrayIDSintoma.includes(repeticao.id_sintoma) && !arrayIDStatus_Sintoma.includes(repeticao.id_statusSintoma) && repeticao.status_sintoma === 1 && repeticao.id == teste.id) {
                        let sintoma = {}

                        arrayIDSintoma.push(repeticao.id_sintoma)
                        arrayIDStatus_Sintoma.push(repeticao.id_statusSintoma)

                        sintoma.id = repeticao.id_sintoma
                        sintoma.nome = repeticao.nome_sintoma
                        sintoma.id_status = repeticao.id_statusSintoma
                        sintoma.icone = repeticao.imagem_sintoma

                        sintomas.push(sintoma)
                    }
                });

                rsTeste.forEach(repeticao => {
                    if (!arrayIDHumor.includes(repeticao.id_humor) && !arrayIDStatus_Humor.includes(repeticao.id_statusHumor) && repeticao.status_humor === 1 && repeticao.id == teste.id) {
                        let humor = {}

                        arrayIDHumor.push(repeticao.id_humor)
                        arrayIDStatus_Humor.push(repeticao.id_statusHumor)

                        humor.id = repeticao.id_humor
                        humor.nome = repeticao.nome_humor
                        humor.id_status = repeticao.id_statusHumor
                        humor.icone = repeticao.imagem_humor

                        humores.push(humor)
                    }
                });

                rsTeste.forEach(repeticao => {
                    if (!arrayIDExercicio.includes(repeticao.id_exercicio) && !arrayIDStatus_Exercicio.includes(repeticao.id_statusExercicio) && repeticao.status_exercicio === 1 && repeticao.id == teste.id) {
                        let exercicio = {}

                        arrayIDExercicio.push(repeticao.id_exercicio)
                        arrayIDStatus_Exercicio.push(repeticao.id_statusExercicio)

                        exercicio.id = repeticao.id_exercicio
                        exercicio.nome = repeticao.nome_exercicio
                        exercicio.id_status = repeticao.id_statusExercicio
                        exercicio.icone = repeticao.imagem_exercicio

                        exercicios.push(exercicio)
                    }
                });

                testeJSON.sintomas = sintomas
                testeJSON.humores = humores
                testeJSON.exercicios = exercicios

                testes.push(testeJSON)
            }

            arrayIDSintoma = []
            arrayIDHumor = []
            arrayIDExercicio = []
            sintomas = []
            humores = []
            exercicios = []
        })

        return testes
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = `SELECT tbl_data_horario_observacao_humor.id as id,
        tbl_paciente.nome as paciente,
        DATE_FORMAT(tbl_data_horario_observacao_humor.data,'%d/%m/%Y') as data, TIME_FORMAT(tbl_data_horario_observacao_humor.horario, '%H:%i:%s') as horario, tbl_data_horario_observacao_humor.observacao as observacao,
        tbl_sintoma.sintoma as nome_sintoma, tbl_sintoma.imagem as imagem_sintoma, tbl_sintoma.id as id_sintoma,
        tbl_resposta.resposta as nome_humor, tbl_resposta.imagem as imagem_humor, tbl_resposta.id as id_humor,
        tbl_exercicio.exercicio as nome_exercicio, tbl_exercicio.imagem as imagem_exercicio, tbl_exercicio.id as id_exercicio,
        tbl_sintoma_status.status_sintoma as status_sintoma, tbl_sintoma_status.id as id_statusSintoma,
        tbl_resposta_status.status_resposta as status_humor, tbl_resposta_status.id as id_statusHumor,
        tbl_exercicio_status.status_exercicio as status_exercicio, tbl_exercicio_status.id as id_statusExercicio
    FROM tbl_data_horario_observacao_humor
        inner join tbl_humor_resposta_exercicio_sintoma_paciente
    on tbl_humor_resposta_exercicio_sintoma_paciente.id_data_horario_observacao_humor = tbl_data_horario_observacao_humor.id
        inner join tbl_paciente
    on tbl_paciente.id = tbl_humor_resposta_exercicio_sintoma_paciente.id_paciente
        inner join tbl_sintoma_status
    on tbl_humor_resposta_exercicio_sintoma_paciente.id_sintoma = tbl_sintoma_status.id
        inner join tbl_exercicio_status
    on tbl_humor_resposta_exercicio_sintoma_paciente.id_exercicio = tbl_exercicio_status.id
        inner join tbl_resposta_status
    on tbl_humor_resposta_exercicio_sintoma_paciente.id_resposta = tbl_resposta_status.id
        inner join tbl_sintoma
    on tbl_sintoma_status.tbl_sintoma_id = tbl_sintoma.id
        inner join tbl_resposta
    on tbl_resposta_status.id_resposta = tbl_resposta.id
        inner join tbl_exercicio
    on tbl_exercicio_status.id_exercicio = tbl_exercicio.id
    order by id desc limit 12`

    let rsTeste = await prisma.$queryRawUnsafe(sql)

    if (rsTeste.length > 0) {
        let testeJSON = {}
        let sintomas = []
        let humores = []
        let exercicios = []

        let arrayIDSintoma = []
        let arrayIDHumor = []
        let arrayIDExercicio = []
        let arrayIDStatus_Sintoma = []
        let arrayIDStatus_Humor = []
        let arrayIDStatus_Exercicio = []

        rsTeste.forEach(teste => {
            testeJSON.id = teste.id
            testeJSON.paciente = teste.paciente
            testeJSON.data = teste.data
            testeJSON.horario = teste.horario
            testeJSON.observacao = teste.observacao

            rsTeste.forEach(repeticao => {
                if (!arrayIDSintoma.includes(repeticao.id_sintoma) && !arrayIDStatus_Sintoma.includes(repeticao.id_statusSintoma) && repeticao.status_sintoma === 1) {
                    let sintoma = {}

                    arrayIDSintoma.push(repeticao.id_sintoma)
                    arrayIDStatus_Sintoma.push(repeticao.id_statusSintoma)

                    sintoma.id = repeticao.id_sintoma
                    sintoma.nome = repeticao.nome_sintoma
                    sintoma.icone = repeticao.imagem_sintoma

                    sintomas.push(sintoma)
                }
            });

            rsTeste.forEach(repeticao => {
                if (!arrayIDHumor.includes(repeticao.id_humor) && !arrayIDStatus_Humor.includes(repeticao.id_statusHumor) && repeticao.status_humor === 1) {
                    let humor = {}

                    arrayIDHumor.push(repeticao.id_humor)
                    arrayIDStatus_Humor.push(repeticao.id_statusHumor)

                    humor.id = repeticao.id_humor
                    humor.nome = repeticao.nome_humor
                    humor.icone = repeticao.imagem_humor

                    humores.push(humor)
                }
            });

            rsTeste.forEach(repeticao => {
                if (!arrayIDExercicio.includes(repeticao.id_exercicio) && !arrayIDStatus_Exercicio.includes(repeticao.id_statusExercicio) && repeticao.status_exercicio === 1) {
                    let exercicio = {}

                    arrayIDExercicio.push(repeticao.id_exercicio)
                    arrayIDStatus_Exercicio.push(repeticao.id_statusExercicio)

                    exercicio.id = repeticao.id_exercicio
                    exercicio.nome = repeticao.nome_exercicio
                    exercicio.icone = repeticao.imagem_exercicio

                    exercicios.push(exercicio)
                }
            });

            testeJSON.sintomas = sintomas
            testeJSON.humores = humores
            testeJSON.exercicios = exercicios
        })

        return testeJSON
    } else {
        return false
    }
}

/************************** Inserts ******************************/

const insertTeste = async function (dadosTeste) {
    let sql = `call procInsertHumorRespostaExercicioSintoma(
        '${dadosTeste.observacao}', 
        ${dadosTeste.id_paciente}, 
        5, 
        ${dadosTeste.caminhada}, 
        8, 
        ${dadosTeste.natacao}, 
        9, 
        ${dadosTeste.danca}, 
        12, 
        ${dadosTeste.alongamento}, 
        13, 
        ${dadosTeste.yoga}, 
        14, 
        ${dadosTeste.volei}, 
        15, 
        ${dadosTeste.tenis}, 
        16, 
        ${dadosTeste.corrida}, 
        17, 
        ${dadosTeste.ginastica}, 
        12, 
        ${dadosTeste.futebol}, 
        19, 
        ${dadosTeste.artesMarciais}, 
        20, 
        ${dadosTeste.academia}, 
        1, 
        ${dadosTeste.irritado}, 
        2, 
        ${dadosTeste.culpado}, 
        4, 
        ${dadosTeste.mudancaHumor}, 
        5, 
        ${dadosTeste.agitado}, 
        8, 
        ${dadosTeste.confuso}, 
        10, 
        ${dadosTeste.apatico}, 
        11, 
        ${dadosTeste.energetico}, 
        12, 
        ${dadosTeste.calmo}, 
        14, 
        ${dadosTeste.feliz}, 
        15, 
        ${dadosTeste.confiante}, 
        18, 
        ${dadosTeste.confortavel}, 
        20, 
        ${dadosTeste.desanimado},
        1, 
        ${dadosTeste.apertoPeito}, 
        2, 
        ${dadosTeste.doresAbdominais}, 
        3, 
        ${dadosTeste.faltaDeAr}, 
        5, 
        ${dadosTeste.tontura}, 
        6,
        ${dadosTeste.calafrios}, 
        7, 
        ${dadosTeste.nausea}, 
        8, 
        ${dadosTeste.cansaco}, 
        9, 
        ${dadosTeste.poucoApetite}, 
        12, 
        ${dadosTeste.dorDeCabeca}, 
        13,
        ${dadosTeste.visaoEmbacada}, 
        17, 
        ${dadosTeste.dorNoBraco}, 
        19, 
        ${dadosTeste.intestinoPreso});`
    //talvez ID de endereco e de genero mudem de nome

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

/************************** Deletes ******************************/
const deleteTeste = async function (idTeste) {
    let sql = `delete from tbl_data_horario_observacao_humor where id = ${idTeste}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}


module.exports = {
    insertTeste,
    selectAllTestes,
    selectLastId,
    selectTesteById,
    selectTesteByPaciente,
    deleteTeste
}
