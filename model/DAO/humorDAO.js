/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos HUMORES no Banco de Dados.
 * Data: 17/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

//Instância da classe PrismaClient
var prisma = new PrismaClient()

/************************** Selects ******************************/
const selectAllCategorias = async function (){
    let sql = 'SELECT * from tbl_resposta'

    let rsHumor = await prisma.$queryRawUnsafe(sql)

    if (rsHumor.length > 0) {
        let humores = rsHumor

        sql = 'SELECT * FROM tbl_sintoma'

        let rsSintoma = await prisma.$queryRawUnsafe(sql)

        if (rsSintoma.length > 0) {
            let sintomas = rsSintoma

            sql = 'SELECT * FROM tbl_exercicio'

            let rsExercicio = await prisma.$queryRawUnsafe(sql)

            if (rsExercicio.length > 0) {
                let exercicios = rsExercicio

                let opcoes = {}

                opcoes.humores = humores
                opcoes.sintomas = sintomas
                opcoes.exercicios = exercicios

                return opcoes
            } else {
                return false
            }
        } else {
            return false
        }
    } else {
        return false
    }
}

const selectAllHumores = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_resposta'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsHumor = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsHumor.length > 0) {
        return rsHumor
    } else {
        return false
    }

}

const selectHumorById = async function (idHumor) {
    let sql = `SELECT * FROM tbl_resposta where id = ${idHumor}`

    let rsHumor = await prisma.$queryRawUnsafe(sql)

    if (rsHumor.length > 0) {
        return rsHumor[0]
    } else {
        return false
    }
}

module.exports = {
    selectAllHumores,
    selectHumorById,
    selectAllCategorias
}
