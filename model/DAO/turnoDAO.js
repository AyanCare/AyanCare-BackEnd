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
                    status: usuario.status === 1 
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
                            status: usuario.status === 1 
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
                    status: usuario.status === 1 
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
                            status: usuario.status === 1 
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
                    status: usuario.status === 1 
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
                            status: usuario.status === 1 
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

const selectTurnosByCuidador = async function (emailTurnos) {
    let sql = `select * from tbl_turnos where email = '${emailTurnos}'`

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
                    status: usuario.status === 1 
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
                            status: usuario.status === 1 
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


const selectTurnosByConexao = async function (emailTurnos) {
    let sql = `select * from tbl_turnos where email = '${emailTurnos}'`

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
                    status: usuario.status === 1 
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
                            status: usuario.status === 1 
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
    console.log(await selectLastId());
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
