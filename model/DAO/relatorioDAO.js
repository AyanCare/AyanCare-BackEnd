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

const definirGenero = function (idGenero) {
    let genero = idGenero;

    switch (genero) {
        case 1:
            genero = 'Mulher'
            break;

        case 2:
            genero = 'Homem'
            break;

        case 3:
            genero = 'Não-Binário'
            break;

        case 4:
            genero = 'Outros'
            break;
    }
    return genero;
}

/********************Selects************************** */
/********************Retorna Todos os relatorios************************** */
const selectAllRelatorios = async function () {

    let sql = `SELECT tbl_relatorio.id as id,
    tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, DATE_FORMAT(tbl_paciente.data_nascimento,'%d/%m/%Y') as data_nascimento_paciente, Cast(TIMESTAMPDIFF(YEAR, tbl_paciente.data_nascimento, CURDATE()) as char) AS idade_paciente, tbl_paciente.foto as foto_paciente, tbl_paciente.id_genero as genero_paciente,
    tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, DATE_FORMAT(tbl_cuidador.data_nascimento,'%d/%m/%Y') as data_nascimento_cuidador, Cast(TIMESTAMPDIFF(YEAR, tbl_cuidador.data_nascimento, CURDATE()) as char) AS idade_cuidador, tbl_cuidador.foto as foto_cuidador, tbl_cuidador.id_genero as genero_cuidador,
    DATE_FORMAT(tbl_relatorio.data,'%d/%m/%Y') as data, TIME_FORMAT(tbl_relatorio.horario, '%H:%i') as horario, tbl_relatorio.texto_relatorio as texto,
    tbl_pergunta.id as id_pergunta, tbl_pergunta.pergunta as pergunta,
    tbl_questionario.resposta as resposta, tbl_questionario.id as id_resposta
    from tbl_relatorio
        inner join tbl_paciente
    on tbl_paciente.id = tbl_relatorio.id_paciente
        inner join tbl_cuidador
    on tbl_cuidador.id = tbl_relatorio.id_cuidador
        left join tbl_questionario
    on tbl_questionario.id_relatorio = tbl_relatorio.id
        left join tbl_pergunta
    on tbl_pergunta.id = tbl_questionario.id_pergunta`

    let rsRelatorio = await prisma.$queryRawUnsafe(sql)

    if (rsRelatorio.length > 0) {
        let relatorios = []
        let perguntas = []

        let arrayIDRelatorios = []
        let arrayIDPerguntas = []
        let arrayIDRespostas = []

        rsRelatorio.forEach(relatorio => {
            if (!arrayIDRelatorios.includes(relatorio.id)) {
                let relatorioJSON = {}

                arrayIDRelatorios.push(relatorio.id)

                let paciente = {}
                paciente.id = relatorio.id_paciente
                paciente.foto = relatorio.foto_paciente
                paciente.nome = relatorio.paciente
                paciente.data_nascimento = relatorio.data_nascimento_paciente
                paciente.idade = relatorio.idade_paciente
                paciente.genero = definirGenero(relatorio.genero_paciente)

                let cuidador = {}
                cuidador.id = relatorio.id_cuidador
                cuidador.foto = relatorio.foto_cuidador
                cuidador.nome = relatorio.cuidador
                cuidador.data_nascimento = relatorio.data_nascimento_cuidador
                cuidador.idade = relatorio.idade_cuidador
                cuidador.genero = definirGenero(relatorio.genero_cuidador)

                relatorioJSON.id = relatorio.id
                relatorioJSON.cuidador = cuidador
                relatorioJSON.paciente = paciente
                relatorioJSON.data = relatorio.data
                relatorioJSON.horario = relatorio.horario
                relatorioJSON.texto = relatorio.texto

                rsRelatorio.forEach(repeticao => {
                    if (!arrayIDPerguntas.includes(repeticao.id_pergunta) && !arrayIDRespostas.includes(repeticao.id_resposta) && repeticao.id == relatorio.id) {
                        let pergunta = {}

                        arrayIDPerguntas.push(repeticao.id_pergunta)
                        arrayIDRespostas.push(repeticao.id_resposta)
                        pergunta.id = repeticao.id_pergunta
                        pergunta.pergunta = repeticao.pergunta

                        if (repeticao.resposta === 1) {
                            pergunta.resposta = true
                        } else {
                            pergunta.resposta = false
                        }

                        perguntas.push(pergunta)
                    }
                });

                relatorioJSON.perguntas = perguntas

                relatorios.push(relatorioJSON)
            }

            arrayIDPerguntas = []
            perguntas = []
        })

        return relatorios
    } else {
        return false
    }

}

/********************Select Pelo ID************************** */
const selectByIDRelatorio = async function (idRelatorio) {

    let sql = `SELECT tbl_relatorio.id as id,
    tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, DATE_FORMAT(tbl_paciente.data_nascimento,'%d/%m/%Y') as data_nascimento_paciente, Cast(TIMESTAMPDIFF(YEAR, tbl_paciente.data_nascimento, CURDATE()) as char) AS idade_paciente, tbl_paciente.foto as foto_paciente, tbl_paciente.id_genero as genero_paciente,
    tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, DATE_FORMAT(tbl_cuidador.data_nascimento,'%d/%m/%Y') as data_nascimento_cuidador, Cast(TIMESTAMPDIFF(YEAR, tbl_cuidador.data_nascimento, CURDATE()) as char) AS idade_cuidador, tbl_cuidador.foto as foto_cuidador, tbl_cuidador.id_genero as genero_cuidador,
    DATE_FORMAT(tbl_relatorio.data,'%d/%m/%Y') as data, TIME_FORMAT(tbl_relatorio.horario, '%H:%i') as horario, tbl_relatorio.texto_relatorio as texto,
    tbl_pergunta.id as id_pergunta, tbl_pergunta.pergunta as pergunta,
    tbl_questionario.resposta as resposta, tbl_questionario.id as id_resposta
    from tbl_relatorio
        inner join tbl_paciente
    on tbl_paciente.id = tbl_relatorio.id_paciente
        inner join tbl_cuidador
    on tbl_cuidador.id = tbl_relatorio.id_cuidador
        left join tbl_questionario
    on tbl_questionario.id_relatorio = tbl_relatorio.id
        left join tbl_pergunta
    on tbl_pergunta.id = tbl_questionario.id_pergunta
    where tbl_relatorio.id = ${idRelatorio}`

    let rsRelatorio = await prisma.$queryRawUnsafe(sql)

    if (rsRelatorio.length > 0) {
        let relatorioJSON = {}
        let perguntas = []

        let arrayIDPerguntas = []
        let arrayIDRespostas = []

        rsRelatorio.forEach(relatorio => {
            let paciente = {}
            paciente.id = relatorio.id_paciente
            paciente.foto = relatorio.foto_paciente
            paciente.nome = relatorio.paciente
            paciente.data_nascimento = relatorio.data_nascimento_paciente
            paciente.idade = relatorio.idade_paciente
            paciente.genero = definirGenero(relatorio.genero_paciente)

            let cuidador = {}
            cuidador.id = relatorio.id_cuidador
            cuidador.foto = relatorio.foto_cuidador
            cuidador.nome = relatorio.cuidador
            cuidador.data_nascimento = relatorio.data_nascimento_cuidador
            cuidador.idade = relatorio.idade_cuidador
            cuidador.genero = definirGenero(relatorio.genero_cuidador)

            relatorioJSON.id = relatorio.id
            relatorioJSON.cuidador = cuidador
            relatorioJSON.paciente = paciente
            relatorioJSON.data = relatorio.data
            relatorioJSON.horario = relatorio.horario
            relatorioJSON.texto = relatorio.texto

            rsRelatorio.forEach(repeticao => {
                if (!arrayIDPerguntas.includes(repeticao.id_pergunta) && !arrayIDRespostas.includes(repeticao.id_resposta)) {
                    let pergunta = {}

                    arrayIDPerguntas.push(repeticao.id_pergunta)
                    arrayIDRespostas.push(repeticao.id_resposta)
                    pergunta.id = repeticao.id_pergunta
                    pergunta.pergunta = repeticao.pergunta

                    if (repeticao.resposta === 1) {
                        pergunta.resposta = true
                    } else {
                        pergunta.resposta = false
                    }

                    perguntas.push(pergunta)
                }
            });

            relatorioJSON.perguntas = perguntas
        })

        return relatorioJSON
    } else {
        return false
    }

}

/********************Select Pelo ID do paciente************************** */
const selectByIDPaciente = async function (idPaciente) {

    let sql = `SELECT tbl_relatorio.id as id,
    tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, DATE_FORMAT(tbl_paciente.data_nascimento,'%d/%m/%Y') as data_nascimento_paciente, Cast(TIMESTAMPDIFF(YEAR, tbl_paciente.data_nascimento, CURDATE()) as char) AS idade_paciente, tbl_paciente.foto as foto_paciente, tbl_paciente.id_genero as genero_paciente,
    tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, DATE_FORMAT(tbl_cuidador.data_nascimento,'%d/%m/%Y') as data_nascimento_cuidador, Cast(TIMESTAMPDIFF(YEAR, tbl_cuidador.data_nascimento, CURDATE()) as char) AS idade_cuidador, tbl_cuidador.foto as foto_cuidador, tbl_cuidador.id_genero as genero_cuidador,
    DATE_FORMAT(tbl_relatorio.data,'%d/%m/%Y') as data, TIME_FORMAT(tbl_relatorio.horario, '%H:%i') as horario, tbl_relatorio.texto_relatorio as texto,
    tbl_pergunta.id as id_pergunta, tbl_pergunta.pergunta as pergunta,
    tbl_questionario.resposta as resposta, tbl_questionario.id as id_resposta
    from tbl_relatorio
        inner join tbl_paciente
    on tbl_paciente.id = tbl_relatorio.id_paciente
        inner join tbl_cuidador
    on tbl_cuidador.id = tbl_relatorio.id_cuidador
        left join tbl_questionario
    on tbl_questionario.id_relatorio = tbl_relatorio.id
        left join tbl_pergunta
    on tbl_pergunta.id = tbl_questionario.id_pergunta
    where tbl_paciente.id = ${idPaciente}
    order by tbl_relatorio.id desc`

    let rsRelatorio = await prisma.$queryRawUnsafe(sql)

    if (rsRelatorio.length > 0) {
        let relatorios = []
        let perguntas = []

        let arrayIDRelatorios = []
        let arrayIDPerguntas = []
        let arrayIDRespostas = []

        rsRelatorio.forEach(relatorio => {
            if (!arrayIDRelatorios.includes(relatorio.id)) {
                let relatorioJSON = {}

                arrayIDRelatorios.push(relatorio.id)

                let paciente = {}
                paciente.id = relatorio.id_paciente
                paciente.foto = relatorio.foto_paciente
                paciente.nome = relatorio.paciente
                paciente.data_nascimento = relatorio.data_nascimento_paciente
                paciente.idade = relatorio.idade_paciente
                paciente.genero = definirGenero(relatorio.genero_paciente)

                let cuidador = {}
                cuidador.id = relatorio.id_cuidador
                cuidador.foto = relatorio.foto_cuidador
                cuidador.nome = relatorio.cuidador
                cuidador.data_nascimento = relatorio.data_nascimento_cuidador
                cuidador.idade = relatorio.idade_cuidador
                cuidador.genero = definirGenero(relatorio.genero_cuidador)

                relatorioJSON.id = relatorio.id
                relatorioJSON.cuidador = cuidador
                relatorioJSON.paciente = paciente
                relatorioJSON.data = relatorio.data
                relatorioJSON.horario = relatorio.horario
                relatorioJSON.texto = relatorio.texto

                rsRelatorio.forEach(repeticao => {
                    if (!arrayIDPerguntas.includes(repeticao.id_pergunta) && !arrayIDRespostas.includes(repeticao.id_resposta) && repeticao.id == relatorio.id) {
                        let pergunta = {}

                        arrayIDPerguntas.push(repeticao.id_pergunta)
                        arrayIDRespostas.push(repeticao.id_resposta)
                        pergunta.id = repeticao.id_pergunta
                        pergunta.pergunta = repeticao.pergunta

                        if (repeticao.resposta === 1) {
                            pergunta.resposta = true
                        } else {
                            pergunta.resposta = false
                        }

                        perguntas.push(pergunta)
                    }
                });

                relatorioJSON.perguntas = perguntas

                relatorios.push(relatorioJSON)
            }

            arrayIDPerguntas = []
            perguntas = []
        })

        return relatorios
    } else {
        return false
    }


}

/********************Select Pelo ID do Cuidador************************** */

const selectByIDCuidador = async function (idCuidador) {

    let sql = `SELECT tbl_relatorio.id as id,
    tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, DATE_FORMAT(tbl_paciente.data_nascimento,'%d/%m/%Y') as data_nascimento_paciente, Cast(TIMESTAMPDIFF(YEAR, tbl_paciente.data_nascimento, CURDATE()) as char) AS idade_paciente, tbl_paciente.foto as foto_paciente, tbl_paciente.id_genero as genero_paciente,
    tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, DATE_FORMAT(tbl_cuidador.data_nascimento,'%d/%m/%Y') as data_nascimento_cuidador, Cast(TIMESTAMPDIFF(YEAR, tbl_cuidador.data_nascimento, CURDATE()) as char) AS idade_cuidador, tbl_cuidador.foto as foto_cuidador, tbl_cuidador.id_genero as genero_cuidador,
    DATE_FORMAT(tbl_relatorio.data,'%d/%m/%Y') as data, TIME_FORMAT(tbl_relatorio.horario, '%H:%i') as horario, tbl_relatorio.texto_relatorio as texto,
    tbl_pergunta.id as id_pergunta, tbl_pergunta.pergunta as pergunta,
    tbl_questionario.resposta as resposta, tbl_questionario.id as id_resposta
    from tbl_relatorio
        inner join tbl_paciente
    on tbl_paciente.id = tbl_relatorio.id_paciente
        inner join tbl_cuidador
    on tbl_cuidador.id = tbl_relatorio.id_cuidador
        left join tbl_questionario
    on tbl_questionario.id_relatorio = tbl_relatorio.id
        left join tbl_pergunta
    on tbl_pergunta.id = tbl_questionario.id_pergunta
    where tbl_cuidador.id = ${idCuidador}
    order by tbl_relatorio.id desc`

    let rsRelatorio = await prisma.$queryRawUnsafe(sql)

    if (rsRelatorio.length > 0) {
        let relatorios = []
        let perguntas = []

        let arrayIDRelatorios = []
        let arrayIDPerguntas = []
        let arrayIDRespostas = []

        rsRelatorio.forEach(relatorio => {
            if (!arrayIDRelatorios.includes(relatorio.id)) {
                let relatorioJSON = {}

                arrayIDRelatorios.push(relatorio.id)

                let paciente = {}
                paciente.id = relatorio.id_paciente
                paciente.foto = relatorio.foto_paciente
                paciente.nome = relatorio.paciente
                paciente.data_nascimento = relatorio.data_nascimento_paciente
                paciente.idade = relatorio.idade_paciente
                paciente.genero = definirGenero(relatorio.genero_paciente)

                let cuidador = {}
                cuidador.id = relatorio.id_cuidador
                cuidador.foto = relatorio.foto_cuidador
                cuidador.nome = relatorio.cuidador
                cuidador.data_nascimento = relatorio.data_nascimento_cuidador
                cuidador.idade = relatorio.idade_cuidador
                cuidador.genero = definirGenero(relatorio.genero_cuidador)

                relatorioJSON.id = relatorio.id
                relatorioJSON.cuidador = cuidador
                relatorioJSON.paciente = paciente
                relatorioJSON.data = relatorio.data
                relatorioJSON.horario = relatorio.horario
                relatorioJSON.texto = relatorio.texto

                rsRelatorio.forEach(repeticao => {
                    if (!arrayIDPerguntas.includes(repeticao.id_pergunta) && !arrayIDRespostas.includes(repeticao.id_resposta) && repeticao.id == relatorio.id) {
                        let pergunta = {}

                        arrayIDPerguntas.push(repeticao.id_pergunta)
                        arrayIDRespostas.push(repeticao.id_resposta)
                        pergunta.id = repeticao.id_pergunta
                        pergunta.pergunta = repeticao.pergunta

                        if (repeticao.resposta === 1) {
                            pergunta.resposta = true
                        } else {
                            pergunta.resposta = false
                        }

                        perguntas.push(pergunta)
                    }
                });

                relatorioJSON.perguntas = perguntas

                relatorios.push(relatorioJSON)
            }

            arrayIDPerguntas = []
            perguntas = []
        })

        return relatorios
    } else {
        return false
    }


}

/********************Select Pelo ID do Cuidador e Paciente************************** */
const selectByIDCuidadorAndPaciente = async function (idCuidador, idPaciente) {

    let sql = `SELECT tbl_relatorio.id as id,
    tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, DATE_FORMAT(tbl_paciente.data_nascimento,'%d/%m/%Y') as data_nascimento_paciente, Cast(TIMESTAMPDIFF(YEAR, tbl_paciente.data_nascimento, CURDATE()) as char) AS idade_paciente, tbl_paciente.foto as foto_paciente, tbl_paciente.id_genero as genero_paciente,
    tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, DATE_FORMAT(tbl_cuidador.data_nascimento,'%d/%m/%Y') as data_nascimento_cuidador, Cast(TIMESTAMPDIFF(YEAR, tbl_cuidador.data_nascimento, CURDATE()) as char) AS idade_cuidador, tbl_cuidador.foto as foto_cuidador, tbl_cuidador.id_genero as genero_cuidador,
    DATE_FORMAT(tbl_relatorio.data,'%d/%m/%Y') as data, TIME_FORMAT(tbl_relatorio.horario, '%H:%i') as horario, tbl_relatorio.texto_relatorio as texto,
    tbl_pergunta.id as id_pergunta, tbl_pergunta.pergunta as pergunta,
    tbl_questionario.resposta as resposta, tbl_questionario.id as id_resposta
    from tbl_relatorio
        inner join tbl_paciente
    on tbl_paciente.id = tbl_relatorio.id_paciente
        inner join tbl_cuidador
    on tbl_cuidador.id = tbl_relatorio.id_cuidador
        left join tbl_questionario
    on tbl_questionario.id_relatorio = tbl_relatorio.id
        left join tbl_pergunta
    on tbl_pergunta.id = tbl_questionario.id_pergunta
    where tbl_paciente.id = ${idPaciente} and tbl_cuidador.id = ${idCuidador}
    order by tbl_relatorio.id desc`

    let rsRelatorio = await prisma.$queryRawUnsafe(sql)

    if (rsRelatorio.length > 0) {
        let relatorios = []
        let perguntas = []

        let arrayIDRelatorios = []
        let arrayIDPerguntas = []
        let arrayIDRespostas = []

        rsRelatorio.forEach(relatorio => {
            if (!arrayIDRelatorios.includes(relatorio.id)) {
                let relatorioJSON = {}

                arrayIDRelatorios.push(relatorio.id)

                let paciente = {}
                paciente.id = relatorio.id_paciente
                paciente.foto = relatorio.foto_paciente
                paciente.nome = relatorio.paciente
                paciente.data_nascimento = relatorio.data_nascimento_paciente
                paciente.idade = relatorio.idade_paciente
                paciente.genero = definirGenero(relatorio.genero_paciente)

                let cuidador = {}
                cuidador.id = relatorio.id_cuidador
                cuidador.foto = relatorio.foto_cuidador
                cuidador.nome = relatorio.cuidador
                cuidador.data_nascimento = relatorio.data_nascimento_cuidador
                cuidador.idade = relatorio.idade_cuidador
                cuidador.genero = definirGenero(relatorio.genero_cuidador)

                relatorioJSON.id = relatorio.id
                relatorioJSON.cuidador = cuidador
                relatorioJSON.paciente = paciente
                relatorioJSON.data = relatorio.data
                relatorioJSON.horario = relatorio.horario
                relatorioJSON.texto = relatorio.texto

                rsRelatorio.forEach(repeticao => {
                    if (!arrayIDPerguntas.includes(repeticao.id_pergunta) && !arrayIDRespostas.includes(repeticao.id_resposta) && repeticao.id == relatorio.id) {
                        let pergunta = {}

                        arrayIDPerguntas.push(repeticao.id_pergunta)
                        arrayIDRespostas.push(repeticao.id_resposta)
                        pergunta.id = repeticao.id_pergunta
                        pergunta.pergunta = repeticao.pergunta

                        if (repeticao.resposta === 1) {
                            pergunta.resposta = true
                        } else {
                            pergunta.resposta = false
                        }

                        perguntas.push(pergunta)
                    }
                });

                relatorioJSON.perguntas = perguntas

                relatorios.push(relatorioJSON)
            }

            arrayIDPerguntas = []
            perguntas = []
        })

        return relatorios
    } else {
        return false
    }

}

/********************Select Pela DATA e Cuidador e Paciente************************** */
const selectByData = async function (idCuidador, idPaciente, data) {

    let sql = `SELECT tbl_relatorio.id as id,
    tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, DATE_FORMAT(tbl_paciente.data_nascimento,'%d/%m/%Y') as data_nascimento_paciente, Cast(TIMESTAMPDIFF(YEAR, tbl_paciente.data_nascimento, CURDATE()) as char) AS idade_paciente, tbl_paciente.foto as foto_paciente, tbl_paciente.id_genero as genero_paciente,
    tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, DATE_FORMAT(tbl_cuidador.data_nascimento,'%d/%m/%Y') as data_nascimento_cuidador, Cast(TIMESTAMPDIFF(YEAR, tbl_cuidador.data_nascimento, CURDATE()) as char) AS idade_cuidador, tbl_cuidador.foto as foto_cuidador, tbl_cuidador.id_genero as genero_cuidador,
    DATE_FORMAT(tbl_relatorio.data,'%d/%m/%Y') as data, TIME_FORMAT(tbl_relatorio.horario, '%H:%i') as horario, tbl_relatorio.texto_relatorio as texto,
    tbl_pergunta.id as id_pergunta, tbl_pergunta.pergunta as pergunta,
    tbl_questionario.resposta as resposta, tbl_questionario.id as id_resposta
    from tbl_relatorio
        inner join tbl_paciente
    on tbl_paciente.id = tbl_relatorio.id_paciente
        inner join tbl_cuidador
    on tbl_cuidador.id = tbl_relatorio.id_cuidador
        left join tbl_questionario
    on tbl_questionario.id_relatorio = tbl_relatorio.id
        left join tbl_pergunta
    on tbl_pergunta.id = tbl_questionario.id_pergunta
    where tbl_paciente.id = ${idPaciente} and tbl_cuidador.id = ${idCuidador} and tbl_relatorio.data = '${data}'`

    let rsRelatorio = await prisma.$queryRawUnsafe(sql)

    if (rsRelatorio.length > 0) {
        let relatorios = []
        let perguntas = []

        let arrayIDRelatorios = []
        let arrayIDPerguntas = []
        let arrayIDRespostas = []

        rsRelatorio.forEach(relatorio => {
            if (!arrayIDRelatorios.includes(relatorio.id)) {
                let relatorioJSON = {}

                arrayIDRelatorios.push(relatorio.id)

                let paciente = {}
                paciente.id = relatorio.id_paciente
                paciente.foto = relatorio.foto_paciente
                paciente.nome = relatorio.paciente
                paciente.data_nascimento = relatorio.data_nascimento_paciente
                paciente.idade = relatorio.idade_paciente
                paciente.genero = definirGenero(relatorio.genero_paciente)

                let cuidador = {}
                cuidador.id = relatorio.id_cuidador
                cuidador.foto = relatorio.foto_cuidador
                cuidador.nome = relatorio.cuidador
                cuidador.data_nascimento = relatorio.data_nascimento_cuidador
                cuidador.idade = relatorio.idade_cuidador
                cuidador.genero = definirGenero(relatorio.genero_cuidador)

                relatorioJSON.id = relatorio.id
                relatorioJSON.cuidador = cuidador
                relatorioJSON.paciente = paciente
                relatorioJSON.data = relatorio.data
                relatorioJSON.horario = relatorio.horario
                relatorioJSON.texto = relatorio.texto

                rsRelatorio.forEach(repeticao => {
                    if (!arrayIDPerguntas.includes(repeticao.id_pergunta) && !arrayIDRespostas.includes(repeticao.id_resposta) && repeticao.id == relatorio.id) {
                        let pergunta = {}

                        arrayIDPerguntas.push(repeticao.id_pergunta)
                        arrayIDRespostas.push(repeticao.id_resposta)
                        pergunta.id = repeticao.id_pergunta
                        pergunta.pergunta = repeticao.pergunta

                        if (repeticao.resposta === 1) {
                            pergunta.resposta = true
                        } else {
                            pergunta.resposta = false
                        }

                        perguntas.push(pergunta)
                    }
                });

                relatorioJSON.perguntas = perguntas

                relatorios.push(relatorioJSON)
            }

            arrayIDPerguntas = []
            perguntas = []
        })

        return relatorios
    } else {
        return false
    }

}

/********************Select DATAS de todos os relatórios cadastrados daquele Cuidador e Paciente************************** */
const selectAllDatas = async function (idCuidador, idPaciente) {

    let sql = `SELECT DATE_FORMAT(tbl_relatorio.data,'%d/%m/%Y') as data_formatada, DATE_FORMAT(tbl_relatorio.data,'%Y-%m-%d') as data_sql
    from tbl_relatorio
    inner join tbl_paciente
    on tbl_paciente.id = tbl_relatorio.id_paciente
        inner join tbl_cuidador
    on tbl_cuidador.id = tbl_relatorio.id_cuidador
    where tbl_paciente.id = ${idPaciente} and tbl_cuidador.id = ${idCuidador}`

    let rsRelatorio = await prisma.$queryRawUnsafe(sql)

    if (rsRelatorio.length > 0) {
        return rsRelatorio
    } else {
        return false
    }

}

/********************retorna o ultimo id inserido no banco de dados************************** */
const selectLastId = async function () {
    let sql = 'select tbl_relatorio.*, tbl_cuidador.nome as cuidador from tbl_relatorio inner join tbl_cuidador on tbl_cuidador.id = tbl_relatorio.id_cuidador order by id desc limit 1;'

    let rsRelatorio = await prisma.$queryRawUnsafe(sql)

    if (rsRelatorio.length > 0) {
        return rsRelatorio[0]
    } else {
        return false
    }

}

/************************** Inserts ******************************/


const insertRelatorio = async function (dadosRelatorio) {
    let sql = `call procInsertRelatorio(${dadosRelatorio.texto_relatorio}, ${dadosRelatorio.id_cuidador}, ${dadosRelatorio.id_paciente});`
    
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
    selectByIDCuidadorAndPaciente,
    selectByData,
    selectAllDatas,
    insertRelatorio,
    updateRelatorio,
    deleteRelatorio
}
