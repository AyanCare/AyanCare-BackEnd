/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos TURNOS no Banco de Dados.
 * Data: 21/11/2023
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
        // Cria um array para armazenar os usuários processados
        let usuarios = [];
    
        // Itera sobre os registros retornados do banco de dados
        rsTurnos.forEach(usuario => {
            // Verifica se o usuário já foi processado anteriormente
            let usuarioExistente = usuarios.find(u => u.id_conexao === usuario.id_conexao);
    
            // Se o usuário já foi processado, adiciona o dia ao array existente
            if (usuarioExistente) {
                usuarioExistente.dias.push({
                    id: usuario.id_dia_semana,
                    dia: usuario.dia,
                    turno_id: usuario.id,
                    status: usuario.status === 1,
                    cor: usuario.cor 
                });
            } else {
                // Se o usuário não foi processado, cria um novo objeto de usuário
                let novoUsuario = {
                    id: usuario.id,
                    id_paciente: usuario.id_paciente,
                    paciente: usuario.paciente,
                    id_cuidador: usuario.id_cuidador,
                    cuidador: usuario.cuidador,
                    id_conexao: usuario.id_conexao,
                    // Cria um array para armazenar os dias do usuário
                    dias: [
                        {
                            id: usuario.id_dia_semana,
                            dia: usuario.dia,
                            turno_id: usuario.id,
                            status: usuario.status === 1,
                            cor: usuario.cor 
                        }
                    ]
                };
    
                // Adiciona o novo usuário ao array de usuários
                usuarios.push(novoUsuario);
            }
        });
    
        // Retorna o array de usuários processados
        return usuarios
    } else {
        return false
    }

}

const selectLastId = async function () {
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
    on tbl_cuidador.id = tbl_paciente_cuidador.id_cuidador
    order by tbl_turno_dia_semana.id desc limit 7;`

    let rsTurnos = await prisma.$queryRawUnsafe(sql)

    if (rsTurnos.length > 0) {
        // Cria um array para armazenar os usuários processados
        let usuarios = [];
    
        // Itera sobre os registros retornados do banco de dados
        rsTurnos.forEach(usuario => {
            // Verifica se o usuário já foi processado anteriormente
            let usuarioExistente = usuarios.find(u => u.id_conexao === usuario.id_conexao);
    
            // Se o usuário já foi processado, adiciona o dia ao array existente
            if (usuarioExistente) {
                usuarioExistente.dias.push({
                    id: usuario.id_dia_semana,
                    dia: usuario.dia,
                    turno_id: usuario.id,
                    status: usuario.status === 1,
                    cor: usuario.cor 
                });
            } else {
                // Se o usuário não foi processado, cria um novo objeto de usuário
                let novoUsuario = {
                    id: usuario.id,
                    id_paciente: usuario.id_paciente,
                    paciente: usuario.paciente,
                    id_cuidador: usuario.id_cuidador,
                    cuidador: usuario.cuidador,
                    id_conexao: usuario.id_conexao,
                    // Cria um array para armazenar os dias do usuário
                    dias: [
                        {
                            id: usuario.id_dia_semana,
                            dia: usuario.dia,
                            turno_id: usuario.id,
                            status: usuario.status === 1,
                            cor: usuario.cor 
                        }
                    ]
                };
    
                // Adiciona o novo usuário ao array de usuários
                usuarios.push(novoUsuario);
            }
        });
    
        // Retorna o array de usuários processados
        return usuarios[0]
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}


const selectTurnoByPaciente = async function (idPaciente) {
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
    on tbl_cuidador.id = tbl_paciente_cuidador.id_cuidador
    where tbl_paciente.id = ${idPaciente}`

    let rsTurnos = await prisma.$queryRawUnsafe(sql)

    if (rsTurnos.length > 0) {
        // Cria um array para armazenar os usuários processados
        let usuarios = [];
    
        // Itera sobre os registros retornados do banco de dados
        rsTurnos.forEach(usuario => {
            // Verifica se o usuário já foi processado anteriormente
            let usuarioExistente = usuarios.find(u => u.id_conexao === usuario.id_conexao);
    
            // Se o usuário já foi processado, adiciona o dia ao array existente
            if (usuarioExistente) {
                usuarioExistente.dias.push({
                    id: usuario.id_dia_semana,
                    dia: usuario.dia,
                    turno_id: usuario.id,
                    status: usuario.status === 1,
                    cor: usuario.cor 
                });
            } else {
                // Se o usuário não foi processado, cria um novo objeto de usuário
                let novoUsuario = {
                    id: usuario.id,
                    id_paciente: usuario.id_paciente,
                    paciente: usuario.paciente,
                    id_cuidador: usuario.id_cuidador,
                    cuidador: usuario.cuidador,
                    id_conexao: usuario.id_conexao,
                    // Cria um array para armazenar os dias do usuário
                    dias: [
                        {
                            id: usuario.id_dia_semana,
                            dia: usuario.dia,
                            turno_id: usuario.id,
                            status: usuario.status === 1,
                            cor: usuario.cor 
                        }
                    ]
                };
    
                // Adiciona o novo usuário ao array de usuários
                usuarios.push(novoUsuario);
            }
        });
    
        // Retorna o array de usuários processados
        return usuarios
    } else {
        return false
    }
}

const selectTurnoByCuidador = async function (idCuidador) {
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
    on tbl_cuidador.id = tbl_paciente_cuidador.id_cuidador
    where tbl_cuidador.id = ${idCuidador}`

    let rsTurnos = await prisma.$queryRawUnsafe(sql)

    if (rsTurnos.length > 0) {
        // Cria um array para armazenar os usuários processados
        let usuarios = [];
    
        // Itera sobre os registros retornados do banco de dados
        rsTurnos.forEach(usuario => {
            // Verifica se o usuário já foi processado anteriormente
            let usuarioExistente = usuarios.find(u => u.id_conexao === usuario.id_conexao);
    
            // Se o usuário já foi processado, adiciona o dia ao array existente
            if (usuarioExistente) {
                usuarioExistente.dias.push({
                    id: usuario.id_dia_semana,
                    dia: usuario.dia,
                    turno_id: usuario.id,
                    status: usuario.status === 1,
                    cor: usuario.cor 
                });
            } else {
                // Se o usuário não foi processado, cria um novo objeto de usuário
                let novoUsuario = {
                    id: usuario.id,
                    id_paciente: usuario.id_paciente,
                    paciente: usuario.paciente,
                    id_cuidador: usuario.id_cuidador,
                    cuidador: usuario.cuidador,
                    id_conexao: usuario.id_conexao,
                    // Cria um array para armazenar os dias do usuário
                    dias: [
                        {
                            id: usuario.id_dia_semana,
                            dia: usuario.dia,
                            turno_id: usuario.id,
                            status: usuario.status === 1,
                            cor: usuario.cor 
                        }
                    ]
                };
    
                // Adiciona o novo usuário ao array de usuários
                usuarios.push(novoUsuario);
            }
        });
    
        // Retorna o array de usuários processados
        return usuarios
    } else {
        return false
    }
}


const selectTurnoByConexao = async function (idConexao) {
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
    on tbl_cuidador.id = tbl_paciente_cuidador.id_cuidador
    where tbl_paciente_cuidador.id = ${idConexao}`

    let rsTurnos = await prisma.$queryRawUnsafe(sql)

    if (rsTurnos.length > 0) {
        // Cria um array para armazenar os usuários processados
        let usuarios = [];
    
        // Itera sobre os registros retornados do banco de dados
        rsTurnos.forEach(usuario => {
            // Verifica se o usuário já foi processado anteriormente
            let usuarioExistente = usuarios.find(u => u.id_conexao === usuario.id_conexao);
    
            // Se o usuário já foi processado, adiciona o dia ao array existente
            if (usuarioExistente) {
                usuarioExistente.dias.push({
                    id: usuario.id_dia_semana,
                    dia: usuario.dia,
                    turno_id: usuario.id,
                    status: usuario.status === 1,
                    cor: usuario.cor 
                });
            } else {
                // Se o usuário não foi processado, cria um novo objeto de usuário
                let novoUsuario = {
                    id: usuario.id,
                    id_paciente: usuario.id_paciente,
                    paciente: usuario.paciente,
                    id_cuidador: usuario.id_cuidador,
                    cuidador: usuario.cuidador,
                    id_conexao: usuario.id_conexao,
                    // Cria um array para armazenar os dias do usuário
                    dias: [
                        {
                            id: usuario.id_dia_semana,
                            dia: usuario.dia,
                            turno_id: usuario.id,
                            status: usuario.status === 1,
                            cor: usuario.cor 
                        }
                    ]
                };
    
                // Adiciona o novo usuário ao array de usuários
                usuarios.push(novoUsuario);
            }
        });
    
        // Retorna o array de usuários processados
        return usuarios[0]
    } else {
        return false
    }
}

/************************** Inserts ******************************/
const insertTurno = async function (dadosTurnos) {
    let sql = `call procInsertTurnoDiaSemanaCor( 
        1, ${dadosTurnos.domingo}, 
        2, ${dadosTurnos.segunda}, 
        3, ${dadosTurnos.terca}, 
        4, ${dadosTurnos.quarta}, 
        5, ${dadosTurnos.quinta}, 
        6, ${dadosTurnos.sexta}, 
        7, ${dadosTurnos.sabado}, 
        '${dadosTurnos.horario_comeco}', 
        '${dadosTurnos.horario_fim}', 
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
const deleteTurno = async function (idConexao) {
    let sql = `delete from tbl_turno_dia_semana where id_paciente_cuidador = ${idConexao}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

module.exports = {
    deleteTurno,
    insertTurno,
    selectAllTurnos,
    selectLastId,
    selectTurnoByConexao,
    selectTurnoByCuidador,
    selectTurnoByPaciente 
}
