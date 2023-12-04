/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados que irão para o calendário no Banco de Dados.
 * Data: 17/10/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');
const conexaoDAO = require('../DAO/conexaoDAO.js')

//Instância da classe PrismaClient
var prisma = new PrismaClient()

function conversaoDeMilissegundos(milissegundos) {
    // Crie um objeto Date com base nos milissegundos
    const data = new Date(milissegundos);

    // Extraia as horas, minutos e segundos
    const horas = data.getHours().toString().padStart(2, '0');
    const minutos = data.getMinutes().toString().padStart(2, '0');
    const segundos = data.getSeconds().toString().padStart(2, '0');

    // Crie a string de horário formatada
    const horarioFormatado = `${horas}:${minutos}:${segundos}`;

    return horarioFormatado;
}

const converterMes = function (numeroMes) {
    let mes = numeroMes;

    switch (mes) {
        case "01":
            mes = 'Janeiro'
            break;

        case "02":
            mes = 'Fevereiro'
            break;

        case "03":
            mes = 'Março'
            break;

        case "04":
            mes = 'Abril'
            break;

        case "05":
            mes = 'Maio'
            break;

        case "06":
            mes = 'Junho'
            break;

        case "07":
            mes = 'Julho'
            break;

        case "08":
            mes = 'Agosto'
            break;

        case "09":
            mes = 'Setembro'
            break;

        case "10":
            mes = 'Outubro'
            break;

        case "11":
            mes = 'Novembro'
            break;

        case "12":
            mes = 'Dezembro'
            break;
    }
    return mes;
}

const juncaoDeEventosUnicosMensal = function (arraySQL) {
    let eventosUnicos = []

    arraySQL.forEach(evento => {
        let eventoJSON = {}

        eventoJSON.id = evento.id_evento
        eventoJSON.id_paciente = evento.id_paciente
        eventoJSON.paciente = evento.paciente
        eventoJSON.id_cuidador = evento.id_cuidador
        eventoJSON.cuidador = evento.cuidador
        eventoJSON.nome = evento.nome_evento_unico
        eventoJSON.descricao = evento.descricao_evento_unico
        eventoJSON.local = evento.local_evento_unico
        eventoJSON.dia = evento.dia_evento_unico
        eventoJSON.horario = evento.horario_evento_unico
        eventoJSON.cor = evento.cor

        eventosUnicos.push(eventoJSON)
    });

    return eventosUnicos
}

const juncaoDeEventosSemanaisMensal = function (arraySQL) {
    let eventosSemanais = []

    // Mapeia os eventos semanais por ID
    let eventosSemanaisMap = new Map()
    arraySQL.forEach(evento => {
        if (!eventosSemanaisMap.has(evento.id_evento_semanal)) {
            eventosSemanaisMap.set(evento.id_evento_semanal, {
                id: evento.id_evento_semanal,
                id_paciente: evento.id_paciente,
                paciente: evento.paciente,
                id_cuidador: evento.id_cuidador,
                cuidador: evento.cuidador,
                nome: evento.nome_evento_semanal,
                descricao: evento.descricao_evento_semanal,
                local: evento.local_evento_semanal,
                horario: evento.horario_evento_semanal,
                dias: []
            });
        }
    });

    // Preenche os dias correspondentes para cada evento semanal
    arraySQL.forEach(repeticao => {
        let evento = eventosSemanaisMap.get(repeticao.id_evento_semanal);
        if (evento) {
            let dia = {
                id: repeticao.dia_semana_id,
                status_id: repeticao.dia_evento_id,
                dia: repeticao.dia,
                id_dia_semana: repeticao.id_dia,
                cor_id: repeticao.id_cor,
                cor: repeticao.cor,
                status: repeticao.status_dia_status === 1 ? true : false
            };
            evento.dias.push(dia);
        }
    });

    eventosSemanais = Array.from(eventosSemanaisMap.values());

    return eventosSemanais
}

const juncaoDeTurnosMensal = function (arraySQL) {
    let turnos = []

    arraySQL.forEach(usuario => {
        // Verifica se o usuário já foi processado anteriormente
        let usuarioExistente = turnos.find(u => u.id_conexao === usuario.id_conexao);

        // Se o usuário já foi processado, adiciona o dia ao array existente
        if (usuarioExistente) {
            usuarioExistente.dias.push({
                id_dia_semana: usuario.id_dia_semana,
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
                        id_dia_semana: usuario.id_dia_semana,
                        dia: usuario.dia,
                        turno_id: usuario.id,
                        status: usuario.status === 1,
                        cor: usuario.cor
                    }
                ]
            };

            // Adiciona o novo usuário ao array de usuários
            turnos.push(novoUsuario);
        }
    });

    return turnos
}

const juncaoDeEventosUnicosDiario = function (arraySQL) {
    let eventosUnicos = []
    arraySQL.forEach(evento => {
        let eventoJSON = {}

        eventoJSON.id = evento.id_evento
        eventoJSON.id_paciente = evento.id_paciente
        eventoJSON.paciente = evento.paciente
        eventoJSON.id_cuidador = evento.id_cuidador
        eventoJSON.cuidador = evento.cuidador
        eventoJSON.nome = evento.nome_evento_unico
        eventoJSON.descricao = evento.descricao_evento_unico
        eventoJSON.local = evento.local_evento_unico
        eventoJSON.dia = evento.dia_evento_unico
        eventoJSON.dia_unico = evento.dia_unico
        eventoJSON.mes = converterMes(evento.mes)
        eventoJSON.horario = evento.horario_evento_unico
        eventoJSON.cor = evento.cor

        eventosUnicos.push(eventoJSON)
    });
    return eventosUnicos
}

const juncaoDeEventosSemanaisDiario = function (arraySQL) {
    let eventosSemanais = []
    arraySQL.forEach(evento => {
        let eventoJSON = {}

        eventoJSON.id = evento.id_evento_semanal
        eventoJSON.id_paciente = evento.id_paciente
        eventoJSON.paciente = evento.paciente
        eventoJSON.id_cuidador = evento.id_cuidador
        eventoJSON.cuidador = evento.cuidador
        eventoJSON.nome = evento.nome_evento_semanal
        eventoJSON.descricao = evento.descricao_evento_semanal
        eventoJSON.local = evento.local_evento_semanal
        eventoJSON.horario = evento.horario_evento_semanal
        eventoJSON.cor = evento.cor
        eventoJSON.id_dia_semana = evento.id_dia
        eventoJSON.dia_semana = evento.dia

        eventosSemanais.push(eventoJSON)
    })
    return eventosSemanais
}

const juncaoDeAlarmesDiario = function (arraySQL) {
    let alarmes = []
    arraySQL.forEach(alarme => {
        let alarmeJSON = {}

        alarmeJSON.id = alarme.id_alarme_unitario
        alarmeJSON.id_paciente = alarme.id_paciente
        alarmeJSON.paciente = alarme.paciente
        alarmeJSON.id_medicamento = alarme.id_medicamento
        alarmeJSON.medicamento = alarme.medicamento
        alarmeJSON.horario = alarme.horario_alarme_unitario
        alarmeJSON.intervalo = conversaoDeMilissegundos(alarme.intervalo_alarme)
        alarmeJSON.quantidade = alarme.quantidade
        alarmeJSON.medida = alarme.medida
        alarmeJSON.medida_sigla = alarme.medida_sigla
        alarmeJSON.id_status = alarme.id_status_alarme
        alarmeJSON.status = alarme.status_alarme

        alarmes.push(alarmeJSON)
    })
    return alarmes
}

const juncaoDeTurnosDiario = function (arraySQL) {
    let turnos = []
    arraySQL.forEach(turno => {
        let turnoJSON = {}

        turnoJSON.id = evento.id
        turnoJSON.id_paciente = turno.id_paciente
        turnoJSON.paciente = turno.paciente
        turnoJSON.id_cuidador = turno.id_cuidador
        turnoJSON.cuidador = turno.cuidador
        turnoJSON.id_dia_semana = turno.id_dia_semana
        turnoJSON.dia_semana = turno.dia
        turnoJSON.horario_inicio = turno.inicio
        turnoJSON.horario_fim = turno.fim
        turnoJSON.cor = turno.cor

        turnos.push(turnoJSON)
    });
    return turnos
}


/************************** Selects ******************************/
const selectAllEventosByPacienteMonthly = async function (dadosCalendario) {

    let sqlEvento_unico = `select tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, 
		   tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, 
		   tbl_evento.id as id_evento, tbl_evento.nome as nome_evento_unico, tbl_evento.descricao as descricao_evento_unico, tbl_evento.local as local_evento_unico, DATE_FORMAT(tbl_evento.dia,'%d/%m/%Y') as dia_evento_unico, TIME_FORMAT(tbl_evento.horario, '%H:%i') as horario_evento_unico,
           tbl_cor.id as id_cor, tbl_cor.hex as cor
    from tbl_paciente
		left JOIN tbl_paciente_evento_unitario
	on tbl_paciente_evento_unitario.id_paciente = tbl_paciente.id
		left join tbl_evento_unitario as tbl_evento
	on tbl_evento.id = tbl_paciente_evento_unitario.id_evento_unitario
		left join tbl_cor
	on tbl_evento.id_cor = tbl_cor.id
		left join tbl_cuidador_evento_unitario
	on tbl_cuidador_evento_unitario.id_evento_unitario = tbl_evento.id
		left join tbl_cuidador
	on tbl_cuidador.id = tbl_cuidador_evento_unitario.id_cuidador
    where tbl_paciente.id = ${dadosCalendario.id_paciente} and date_format(tbl_evento.dia, '%Y-%m') = '${dadosCalendario.mes}'`

    let sqlEvento_semanal = `select tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, 
		   tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, 
		   tbl_evento_semanal.id as id_evento_semanal, tbl_evento_semanal.nome as nome_evento_semanal, tbl_evento_semanal.descricao as descricao_evento_semanal, tbl_evento_semanal.local as local_evento_semanal,
		   tbl_dia_evento.id as id_dia_status, tbl_dia_evento.status as status_dia_status,  TIME_FORMAT(tbl_dia_evento.horario, '%H:%i') as horario_dia_status,
		   tbl_dia_semana.id as id_dia, tbl_dia_semana.dia as dia,
		   tbl_cor.id as id_cor, tbl_cor.hex as cor
	from tbl_paciente
		left join tbl_paciente_cuidador as tbl_conexao
	on tbl_conexao.id_paciente = tbl_paciente.id
		left join tbl_cuidador
	on tbl_conexao.id_cuidador = tbl_cuidador.id
		left join tbl_dia_semana_evento as tbl_dia_evento
	on tbl_conexao.id = tbl_dia_evento.id_paciente_cuidador
		left join tbl_nome_descricao_local_evento as tbl_evento_semanal
	on tbl_evento_semanal.id = tbl_dia_evento.id_nome_descricao_local_evento
		left join tbl_cor
	on tbl_cor.id = tbl_evento_semanal.id_cor
		left join tbl_dia_semana
	on tbl_dia_semana.id = tbl_dia_evento.id_dia_semana
    where tbl_paciente.id = ${dadosCalendario.id_paciente} and tbl_dia_evento.status = 1;`

    let sqlTurno = `SELECT tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente,
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
    where tbl_paciente.id = ${dadosCalendario.id_paciente} and tbl_turno_dia_semana.status = 1`

    let rsEvento_unico = await prisma.$queryRawUnsafe(sqlEvento_unico)
    let rsEvento_semanal = await prisma.$queryRawUnsafe(sqlEvento_semanal)
    let rsTurno = await prisma.$queryRawUnsafe(sqlTurno)

    //Valida se o BD retornou algum registro
    if (rsEvento_unico && rsEvento_semanal && rsTurno) {
        let calendarioJSON = {
            eventos_unicos: juncaoDeEventosUnicosMensal(rsEvento_unico),
            eventos_semanais: juncaoDeEventosSemanaisMensal(rsEvento_semanal),
            turnos: juncaoDeTurnosMensal(rsTurno)
        }

        return calendarioJSON
    } else {
        return false
    }

}

const selectAllEventosByCuidadorMonthly = async function (dadosCalendario) {

    let sqlEvento_unico = `select tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, 
		   tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, 
		   tbl_evento.id as id_evento, tbl_evento.nome as nome_evento_unico, tbl_evento.descricao as descricao_evento_unico, tbl_evento.local as local_evento_unico, DATE_FORMAT(tbl_evento.dia,'%d/%m/%Y') as dia_evento_unico, TIME_FORMAT(tbl_evento.horario, '%H:%i') as horario_evento_unico,
           tbl_cor.id as id_cor, tbl_cor.hex as cor
    from tbl_paciente
		left JOIN tbl_paciente_evento_unitario
	on tbl_paciente_evento_unitario.id_paciente = tbl_paciente.id
		left join tbl_evento_unitario as tbl_evento
	on tbl_evento.id = tbl_paciente_evento_unitario.id_evento_unitario
		left join tbl_cor
	on tbl_evento.id_cor = tbl_cor.id
		left join tbl_cuidador_evento_unitario
	on tbl_cuidador_evento_unitario.id_evento_unitario = tbl_evento.id
		left join tbl_cuidador
	on tbl_cuidador.id = tbl_cuidador_evento_unitario.id_cuidador
    where tbl_cuidador.id = ${dadosCalendario.id_cuidador} and date_format(tbl_evento.dia, '%Y-%m') = '${dadosCalendario.mes}'`

    let sqlEvento_semanal = `select tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, 
		   tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, 
		   tbl_evento_semanal.id as id_evento_semanal, tbl_evento_semanal.nome as nome_evento_semanal, tbl_evento_semanal.descricao as descricao_evento_semanal, tbl_evento_semanal.local as local_evento_semanal,
		   tbl_dia_evento.id as id_dia_status, tbl_dia_evento.status as status_dia_status,  TIME_FORMAT(tbl_dia_evento.horario, '%H:%i') as horario_dia_status,
		   tbl_dia_semana.id as id_dia, tbl_dia_semana.dia as dia,
		   tbl_cor.id as id_cor, tbl_cor.hex as cor
	from tbl_paciente
		left join tbl_paciente_cuidador as tbl_conexao
	on tbl_conexao.id_paciente = tbl_paciente.id
		left join tbl_cuidador
	on tbl_conexao.id_cuidador = tbl_cuidador.id
		left join tbl_dia_semana_evento as tbl_dia_evento
	on tbl_conexao.id = tbl_dia_evento.id_paciente_cuidador
		left join tbl_nome_descricao_local_evento as tbl_evento_semanal
	on tbl_evento_semanal.id = tbl_dia_evento.id_nome_descricao_local_evento
		left join tbl_cor
	on tbl_cor.id = tbl_evento_semanal.id_cor
		left join tbl_dia_semana
	on tbl_dia_semana.id = tbl_dia_evento.id_dia_semana
    where tbl_cuidador.id = ${dadosCalendario.id_cuidador} and tbl_dia_evento.status = 1;`

    let sqlTurno = `SELECT tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente,
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
    where tbl_cuidador.id = ${dadosCalendario.id_cuidador} and tbl_turno_dia_semana.status = 1`

    let rsEvento_unico = await prisma.$queryRawUnsafe(sqlEvento_unico)
    let rsEvento_semanal = await prisma.$queryRawUnsafe(sqlEvento_semanal)
    let rsTurno = await prisma.$queryRawUnsafe(sqlTurno)

    //Valida se o BD retornou algum registro
    if (rsEvento_unico && rsEvento_semanal && rsTurno) {
        let calendarioJSON = {
            eventos_unicos: juncaoDeEventosUnicosMensal(rsEvento_unico),
            eventos_semanais: juncaoDeEventosSemanaisMensal(rsEvento_semanal),
            turnos: juncaoDeTurnosMensal(rsTurno)
        }

        return calendarioJSON
    } else {
        return false
    }

}

const selectAllEventosByCuidadorAndPacienteMonthly = async function (dadosCalendario) {

    let sqlEvento_unico = `select tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, 
		   tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, 
		   tbl_evento.id as id_evento, tbl_evento.nome as nome_evento_unico, tbl_evento.descricao as descricao_evento_unico, tbl_evento.local as local_evento_unico, DATE_FORMAT(tbl_evento.dia,'%d/%m/%Y') as dia_evento_unico, TIME_FORMAT(tbl_evento.horario, '%H:%i') as horario_evento_unico,
           tbl_cor.id as id_cor, tbl_cor.hex as cor
    from tbl_paciente
		left JOIN tbl_paciente_evento_unitario
	on tbl_paciente_evento_unitario.id_paciente = tbl_paciente.id
		left join tbl_evento_unitario as tbl_evento
	on tbl_evento.id = tbl_paciente_evento_unitario.id_evento_unitario
		left join tbl_cor
	on tbl_evento.id_cor = tbl_cor.id
		left join tbl_cuidador_evento_unitario
	on tbl_cuidador_evento_unitario.id_evento_unitario = tbl_evento.id
		left join tbl_cuidador
	on tbl_cuidador.id = tbl_cuidador_evento_unitario.id_cuidador
    where tbl_paciente.id = ${dadosCalendario.id_paciente} and tbl_cuidador.id = ${dadosCalendario.id_cuidador} and date_format(tbl_evento.dia, '%Y-%m') = '${dadosCalendario.mes}'`

    let sqlEvento_semanal = `select tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, 
		   tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, 
		   tbl_evento_semanal.id as id_evento_semanal, tbl_evento_semanal.nome as nome_evento_semanal, tbl_evento_semanal.descricao as descricao_evento_semanal, tbl_evento_semanal.local as local_evento_semanal,
		   tbl_dia_evento.id as id_dia_status, tbl_dia_evento.status as status_dia_status,  TIME_FORMAT(tbl_dia_evento.horario, '%H:%i') as horario_dia_status,
		   tbl_dia_semana.id as id_dia, tbl_dia_semana.dia as dia,
		   tbl_cor.id as id_cor, tbl_cor.hex as cor
	from tbl_paciente
		left join tbl_paciente_cuidador as tbl_conexao
	on tbl_conexao.id_paciente = tbl_paciente.id
		left join tbl_cuidador
	on tbl_conexao.id_cuidador = tbl_cuidador.id
		left join tbl_dia_semana_evento as tbl_dia_evento
	on tbl_conexao.id = tbl_dia_evento.id_paciente_cuidador
		left join tbl_nome_descricao_local_evento as tbl_evento_semanal
	on tbl_evento_semanal.id = tbl_dia_evento.id_nome_descricao_local_evento
		left join tbl_cor
	on tbl_cor.id = tbl_evento_semanal.id_cor
		left join tbl_dia_semana
	on tbl_dia_semana.id = tbl_dia_evento.id_dia_semana
    where tbl_paciente.id = ${dadosCalendario.id_paciente} and tbl_cuidador.id = ${dadosCalendario.id_cuidador} and tbl_dia_evento.status = 1;`

    let sqlTurno = `SELECT tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente,
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
    where tbl_paciente.id = ${dadosCalendario.id_paciente} and tbl_cuidador.id = ${dadosCalendario.id_cuidador} and tbl_turno_dia_semana.status = 1`

    let rsEvento_unico = await prisma.$queryRawUnsafe(sqlEvento_unico)
    let rsEvento_semanal = await prisma.$queryRawUnsafe(sqlEvento_semanal)
    let rsTurno = await prisma.$queryRawUnsafe(sqlTurno)

    //Valida se o BD retornou algum registro
    if (rsEvento_unico && rsEvento_semanal && rsTurno) {
        let calendarioJSON = {
            eventos_unicos: juncaoDeEventosUnicosMensal(rsEvento_unico),
            eventos_semanais: juncaoDeEventosSemanaisMensal(rsEvento_semanal),
            turnos: juncaoDeTurnosMensal(rsTurno)
        }

        return calendarioJSON
    } else {
        return false
    }

}

const selectAllEventosAndAlarmesByCuidadorDiary = async function (dadosCalendario) {

    //scriptSQL para buscar todos os itens do BD
    let sqlEvento_unico = `select tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, 
		   tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, 
		   tbl_evento.id as id_evento, tbl_evento.nome as nome_evento_unico, tbl_evento.descricao as descricao_evento_unico, tbl_evento.local as local_evento_unico, DATE_FORMAT(tbl_evento.dia,'%d/%m/%Y') as dia_evento_unico, DATE_FORMAT(tbl_evento.dia,'%d') as dia_unico, DATE_FORMAT(tbl_evento.dia,'%m') as mes, TIME_FORMAT(tbl_evento.horario, '%H:%i') as horario_evento_unico,
           tbl_cor.id as id_cor, tbl_cor.hex as cor
    from tbl_paciente
		left JOIN tbl_paciente_evento_unitario
	on tbl_paciente_evento_unitario.id_paciente = tbl_paciente.id
		left join tbl_evento_unitario as tbl_evento
	on tbl_evento.id = tbl_paciente_evento_unitario.id_evento_unitario
		left join tbl_cor
	on tbl_evento.id_cor = tbl_cor.id
		left join tbl_cuidador_evento_unitario
	on tbl_cuidador_evento_unitario.id_evento_unitario = tbl_evento.id
		left join tbl_cuidador
	on tbl_cuidador.id = tbl_cuidador_evento_unitario.id_cuidador
    where tbl_cuidador.id = ${dadosCalendario.id_cuidador} and tbl_evento.dia = '${dadosCalendario.dia}'`

    let sqlEvento_semanal = `select tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, 
		   tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, 
		   tbl_evento_semanal.id as id_evento_semanal, tbl_evento_semanal.nome as nome_evento_semanal, tbl_evento_semanal.descricao as descricao_evento_semanal, tbl_evento_semanal.local as local_evento_semanal,
		   tbl_dia_evento.id as id_dia_status, tbl_dia_evento.status as status_dia_status,  TIME_FORMAT(tbl_dia_evento.horario, '%H:%i') as horario_dia_status,
		   tbl_dia_semana.id as id_dia, tbl_dia_semana.dia as dia,
		   tbl_cor.id as id_cor, tbl_cor.hex as cor
	from tbl_paciente
		left join tbl_paciente_cuidador as tbl_conexao
	on tbl_conexao.id_paciente = tbl_paciente.id
		left join tbl_cuidador
	on tbl_conexao.id_cuidador = tbl_cuidador.id
		left join tbl_dia_semana_evento as tbl_dia_evento
	on tbl_conexao.id = tbl_dia_evento.id_paciente_cuidador
		left join tbl_nome_descricao_local_evento as tbl_evento_semanal
	on tbl_evento_semanal.id = tbl_dia_evento.id_nome_descricao_local_evento
		left join tbl_cor
	on tbl_cor.id = tbl_evento_semanal.id_cor
		left join tbl_dia_semana
	on tbl_dia_semana.id = tbl_dia_evento.id_dia_semana
    where tbl_cuidador.id = ${dadosCalendario.id_cuidador} and tbl_dia_semana.dia = '${dadosCalendario.dia_semana}' and tbl_dia_evento.status = 1;`

    let sqlTurno = `SELECT tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente,
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
    where tbl_cuidador.id = ${dadosCalendario.id_cuidador} and tbl_dia_semana.dia = '${dadosCalendario.dia_semana}' and tbl_turno_dia_semana.status = 1;`

    let rsEvento_unico = await prisma.$queryRawUnsafe(sqlEvento_unico)
    let rsEvento_semanal = await prisma.$queryRawUnsafe(sqlEvento_semanal)
    let rsTurno = await prisma.$queryRawUnsafe(sqlTurno)

    //Valida se o BD retornou algum registro
    if (rsEvento_unico && rsEvento_semanal && rsTurno) {
        let calendarioJSON = {}
        let alarmes = []

        let getAlarmes = await conexaoDAO.selectConexaoByCuidador(dadosCalendario.id_cuidador)

            getAlarmes.forEach(async conexao => {
                let sqlAlarme = `select tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, 
                        tbl_alarme_unico.id as id_alarme_unitario, TIME_FORMAT(tbl_alarme_unico.horario, '%H:%i') as horario_alarme_unitario, tbl_alarme_unico.dia as dia_criacao_alarme_unico, tbl_alarme_unico.quantidade as quantidade,
                        tbl_status_alarme.id as id_status_alarme, tbl_status_alarme.nome as status_alarme,
                        tbl_alarme_medicamento.id as id_alarme, tbl_alarme_medicamento.intervalo as intervalo_alarme,
                        tbl_medicamento.id as id_medicamento, tbl_medicamento.nome as medicamento,
           tbl_medida.tipo as medida, tbl_medida.sigla as medida_sigla
                    from tbl_paciente
                        left join tbl_medicamento
                    on tbl_paciente.id = tbl_medicamento.id_paciente
                        left join tbl_alarme_medicamento
                    on tbl_alarme_medicamento.id_medicamento = tbl_medicamento.id
                        left join tbl_alarme_unitario_status as tbl_alarme_unico
                    on tbl_alarme_unico.id_alarme_medicamento = tbl_alarme_medicamento.id
                        left join tbl_status_alarme
                    on tbl_status_alarme.id = tbl_alarme_unico.id_status_alarme
                        left join tbl_medida
                    on tbl_medida.id = tbl_medicamento.id_medida
                    WHERE tbl_paciente.id = ${conexao.id_paciente} AND 
                    (
                        tbl_alarme_unico.dia IS NOT NULL AND 
                        (
                            DATE_FORMAT(DATE_ADD(CONCAT(tbl_alarme_unico.dia, ' ', tbl_alarme_unico.horario), INTERVAL (tbl_alarme_medicamento.intervalo / 1000) SECOND), '%Y-%m-%d') = '${dadosCalendario.dia}'
                        )
                    );`
    
                let rsAlarme = await prisma.$queryRawUnsafe(sqlAlarme)
    
                rsAlarme .forEach(alarme => {
                    let alarmeJSON = {}
    
                    alarmeJSON.id = alarme.id_alarme_unitario
                    alarmeJSON.id_paciente = alarme.id_paciente
                    alarmeJSON.paciente = alarme.paciente
                    alarmeJSON.id_medicamento = alarme.id_medicamento
                    alarmeJSON.medicamento = alarme.medicamento
                    alarmeJSON.horario = alarme.horario_alarme_unitario
                    alarmeJSON.intervalo = conversaoDeMilissegundos(alarme.intervalo_alarme)
                    alarmeJSON.quantidade = alarme.quantidade
                    alarmeJSON.id_status = alarme.id_status_alarme
                    alarmeJSON.status = alarme.status_alarme
    
                    alarmes.push(alarmeJSON)
                })
            })

        calendarioJSON.eventos_unicos = juncaoDeEventosUnicosDiario(rsEvento_unico)
        calendarioJSON.eventos_semanais = juncaoDeEventosSemanaisDiario(rsEvento_semanal)
        calendarioJSON.turnos = juncaoDeTurnosDiario(rsTurno)
        calendarioJSON.alarmes = alarmes

        return calendarioJSON
    } else {
        return false
    }

}

const selectAllEventosAndAlarmesByPacienteDiary = async function (dadosCalendario) {

    //scriptSQL para buscar todos os itens do BD
    let sqlEvento_unico = `select tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, 
		   tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, 
		   tbl_evento.id as id_evento, tbl_evento.nome as nome_evento_unico, tbl_evento.descricao as descricao_evento_unico, tbl_evento.local as local_evento_unico, DATE_FORMAT(tbl_evento.dia,'%d/%m/%Y') as dia_evento_unico, DATE_FORMAT(tbl_evento.dia,'%d') as dia_unico, DATE_FORMAT(tbl_evento.dia,'%m') as mes, TIME_FORMAT(tbl_evento.horario, '%H:%i') as horario_evento_unico,
           tbl_cor.id as id_cor, tbl_cor.hex as cor
    from tbl_paciente
		left JOIN tbl_paciente_evento_unitario
	on tbl_paciente_evento_unitario.id_paciente = tbl_paciente.id
		left join tbl_evento_unitario as tbl_evento
	on tbl_evento.id = tbl_paciente_evento_unitario.id_evento_unitario
		left join tbl_cor
	on tbl_evento.id_cor = tbl_cor.id
		left join tbl_cuidador_evento_unitario
	on tbl_cuidador_evento_unitario.id_evento_unitario = tbl_evento.id
		left join tbl_cuidador
	on tbl_cuidador.id = tbl_cuidador_evento_unitario.id_cuidador
    where tbl_paciente.id = ${dadosCalendario.id_paciente} and tbl_evento.dia = '${dadosCalendario.dia}'`

    let sqlEvento_semanal = `select tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, 
		   tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, 
		   tbl_evento_semanal.id as id_evento_semanal, tbl_evento_semanal.nome as nome_evento_semanal, tbl_evento_semanal.descricao as descricao_evento_semanal, tbl_evento_semanal.local as local_evento_semanal,
		   tbl_dia_evento.id as id_dia_status, tbl_dia_evento.status as status_dia_status,  TIME_FORMAT(tbl_dia_evento.horario, '%H:%i') as horario_dia_status,
		   tbl_dia_semana.id as id_dia, tbl_dia_semana.dia as dia,
		   tbl_cor.id as id_cor, tbl_cor.hex as cor
	from tbl_paciente
		left join tbl_paciente_cuidador as tbl_conexao
	on tbl_conexao.id_paciente = tbl_paciente.id
		left join tbl_cuidador
	on tbl_conexao.id_cuidador = tbl_cuidador.id
		left join tbl_dia_semana_evento as tbl_dia_evento
	on tbl_conexao.id = tbl_dia_evento.id_paciente_cuidador
		left join tbl_nome_descricao_local_evento as tbl_evento_semanal
	on tbl_evento_semanal.id = tbl_dia_evento.id_nome_descricao_local_evento
		left join tbl_cor
	on tbl_cor.id = tbl_evento_semanal.id_cor
		left join tbl_dia_semana
	on tbl_dia_semana.id = tbl_dia_evento.id_dia_semana
    where tbl_paciente.id = ${dadosCalendario.id_paciente} and tbl_dia_semana.dia = '${dadosCalendario.dia_semana}' and tbl_dia_evento.status = 1;`

    let sqlAlarme = `select tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, 
		   tbl_alarme_unico.id as id_alarme_unitario, TIME_FORMAT(tbl_alarme_unico.horario, '%H:%i') as horario_alarme_unitario, tbl_alarme_unico.dia as dia_criacao_alarme_unico, tbl_alarme_unico.quantidade as quantidade,
		   tbl_status_alarme.id as id_status_alarme, tbl_status_alarme.nome as status_alarme,
		   tbl_alarme_medicamento.id as id_alarme, tbl_alarme_medicamento.intervalo as intervalo_alarme,
		   tbl_medicamento.id as id_medicamento, tbl_medicamento.nome as medicamento,
           tbl_medida.tipo as medida, tbl_medida.sigla as medida_sigla
	from tbl_paciente
		left join tbl_medicamento
	on tbl_paciente.id = tbl_medicamento.id_paciente
		left join tbl_alarme_medicamento
	on tbl_alarme_medicamento.id_medicamento = tbl_medicamento.id
		left join tbl_alarme_unitario_status as tbl_alarme_unico
	on tbl_alarme_unico.id_alarme_medicamento = tbl_alarme_medicamento.id
		left join tbl_status_alarme
	on tbl_status_alarme.id = tbl_alarme_unico.id_status_alarme
        left join tbl_medida
    on tbl_medida.id = tbl_medicamento.id_medida
    WHERE tbl_paciente.id = ${dadosCalendario.id_paciente} AND 
    (
		tbl_alarme_unico.dia IS NOT NULL AND 
		(
			DATE_FORMAT(DATE_ADD(CONCAT(tbl_alarme_unico.dia, ' ', tbl_alarme_unico.horario), INTERVAL (tbl_alarme_medicamento.intervalo / 1000) SECOND), '%Y-%m-%d') = '${dadosCalendario.dia}'
		)
	);`

    let sqlTurno = `SELECT tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente,
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
    where tbl_paciente.id = ${dadosCalendario.id_paciente} and tbl_dia_semana.dia = '${dadosCalendario.dia_semana}' and tbl_turno_dia_semana.status = 1;`

    let rsEvento_unico = await prisma.$queryRawUnsafe(sqlEvento_unico)
    let rsEvento_semanal = await prisma.$queryRawUnsafe(sqlEvento_semanal)
    let rsAlarme = await prisma.$queryRawUnsafe(sqlAlarme)
    let rsTurno = await prisma.$queryRawUnsafe(sqlTurno)

    //Valida se o BD retornou algum registro
    if (rsEvento_unico && rsEvento_semanal && rsAlarme && rsTurno) {
        let calendarioJSON = {}

        calendarioJSON.eventos_unicos = juncaoDeEventosUnicosDiario(rsEvento_unico)
        calendarioJSON.eventos_semanais = juncaoDeEventosSemanaisDiario(rsEvento_semanal)
        calendarioJSON.alarmes = juncaoDeAlarmesDiario(rsAlarme)
        calendarioJSON.turnos = juncaoDeTurnosDiario(rsTurno)

        return calendarioJSON
    } else {
        return false
    }

}

const selectAllEventosAndAlarmesByCuidadorAndPacienteDiary = async function (dadosCalendario) {

    //scriptSQL para buscar todos os itens do BD
    let sqlEvento_unico = `select tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, 
		   tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, 
		   tbl_evento.id as id_evento, tbl_evento.nome as nome_evento_unico, tbl_evento.descricao as descricao_evento_unico, tbl_evento.local as local_evento_unico, DATE_FORMAT(tbl_evento.dia,'%d/%m/%Y') as dia_evento_unico, DATE_FORMAT(tbl_evento.dia,'%d') as dia_unico, DATE_FORMAT(tbl_evento.dia,'%m') as mes, TIME_FORMAT(tbl_evento.horario, '%H:%i') as horario_evento_unico,
           tbl_cor.id as id_cor, tbl_cor.hex as cor
    from tbl_paciente
		left JOIN tbl_paciente_evento_unitario
	on tbl_paciente_evento_unitario.id_paciente = tbl_paciente.id
		left join tbl_evento_unitario as tbl_evento
	on tbl_evento.id = tbl_paciente_evento_unitario.id_evento_unitario
		left join tbl_cor
	on tbl_evento.id_cor = tbl_cor.id
		left join tbl_cuidador_evento_unitario
	on tbl_cuidador_evento_unitario.id_evento_unitario = tbl_evento.id
		left join tbl_cuidador
	on tbl_cuidador.id = tbl_cuidador_evento_unitario.id_cuidador
    where tbl_paciente.id = ${dadosCalendario.id_paciente} and tbl_cuidador.id = ${dadosCalendario.id_cuidador} and tbl_evento.dia = '${dadosCalendario.dia}'`

    let sqlEvento_semanal = `select tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, 
		   tbl_cuidador.id as id_cuidador, tbl_cuidador.nome as cuidador, 
		   tbl_evento_semanal.id as id_evento_semanal, tbl_evento_semanal.nome as nome_evento_semanal, tbl_evento_semanal.descricao as descricao_evento_semanal, tbl_evento_semanal.local as local_evento_semanal,
		   tbl_dia_evento.id as id_dia_status, tbl_dia_evento.status as status_dia_status,  TIME_FORMAT(tbl_dia_evento.horario, '%H:%i') as horario_dia_status,
		   tbl_dia_semana.id as id_dia, tbl_dia_semana.dia as dia,
		   tbl_cor.id as id_cor, tbl_cor.hex as cor
	from tbl_paciente
		left join tbl_paciente_cuidador as tbl_conexao
	on tbl_conexao.id_paciente = tbl_paciente.id
		left join tbl_cuidador
	on tbl_conexao.id_cuidador = tbl_cuidador.id
		left join tbl_dia_semana_evento as tbl_dia_evento
	on tbl_conexao.id = tbl_dia_evento.id_paciente_cuidador
		left join tbl_nome_descricao_local_evento as tbl_evento_semanal
	on tbl_evento_semanal.id = tbl_dia_evento.id_nome_descricao_local_evento
		left join tbl_cor
	on tbl_cor.id = tbl_evento_semanal.id_cor
		left join tbl_dia_semana
	on tbl_dia_semana.id = tbl_dia_evento.id_dia_semana
    where tbl_paciente.id = ${dadosCalendario.id_paciente} and tbl_cuidador.id = ${dadosCalendario.id_cuidador} and tbl_dia_semana.dia = '${dadosCalendario.dia_semana}' and tbl_dia_evento.status = 1;`

    let sqlAlarme = `select tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente, 
		   tbl_alarme_unico.id as id_alarme_unitario, TIME_FORMAT(tbl_alarme_unico.horario, '%H:%i') as horario_alarme_unitario, tbl_alarme_unico.dia as dia_criacao_alarme_unico, tbl_alarme_unico.quantidade as quantidade,
		   tbl_status_alarme.id as id_status_alarme, tbl_status_alarme.nome as status_alarme,
		   tbl_alarme_medicamento.id as id_alarme, tbl_alarme_medicamento.intervalo as intervalo_alarme,
		   tbl_medicamento.id as id_medicamento, tbl_medicamento.nome as medicamento,
           tbl_medida.tipo as medida, tbl_medida.sigla as medida_sigla
	from tbl_paciente
		left join tbl_medicamento
	on tbl_paciente.id = tbl_medicamento.id_paciente
		left join tbl_alarme_medicamento
	on tbl_alarme_medicamento.id_medicamento = tbl_medicamento.id
		left join tbl_alarme_unitario_status as tbl_alarme_unico
	on tbl_alarme_unico.id_alarme_medicamento = tbl_alarme_medicamento.id
		left join tbl_status_alarme
	on tbl_status_alarme.id = tbl_alarme_unico.id_status_alarme
        left join tbl_medida
    on tbl_medida.id = tbl_medicamento.id_medida
    WHERE tbl_paciente.id = ${dadosCalendario.id_paciente} AND 
    (
		tbl_alarme_unico.dia IS NOT NULL AND 
		(
			DATE_FORMAT(DATE_ADD(CONCAT(tbl_alarme_unico.dia, ' ', tbl_alarme_unico.horario), INTERVAL (tbl_alarme_medicamento.intervalo / 1000) SECOND), '%Y-%m-%d') = '${dadosCalendario.dia}'
		)
	);`

    let sqlTurno = `SELECT tbl_paciente.id as id_paciente, tbl_paciente.nome as paciente,
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
    where tbl_paciente.id = ${dadosCalendario.id_paciente} and tbl_cuidador.id = ${dadosCalendario.id_cuidador} and tbl_dia_semana.dia = '${dadosCalendario.dia_semana}' and tbl_turno_dia_semana.status = 1;`

    let rsEvento_unico = await prisma.$queryRawUnsafe(sqlEvento_unico)
    let rsEvento_semanal = await prisma.$queryRawUnsafe(sqlEvento_semanal)
    let rsAlarme = await prisma.$queryRawUnsafe(sqlAlarme)
    let rsTurno = await prisma.$queryRawUnsafe(sqlTurno)

    //Valida se o BD retornou algum registro
    if (rsEvento_unico && rsEvento_semanal && rsAlarme && rsTurno) {
        let calendarioJSON = {}

        calendarioJSON.eventos_unicos = juncaoDeEventosUnicosDiario(rsEvento_unico)
        calendarioJSON.eventos_semanais = juncaoDeEventosSemanaisDiario(rsEvento_semanal)
        calendarioJSON.alarmes = juncaoDeAlarmesDiario(rsAlarme)
        calendarioJSON.turnos = juncaoDeTurnosDiario(rsTurno)

        return calendarioJSON
    } else {
        return false
    }

}

module.exports = {
    selectAllEventosAndAlarmesByCuidadorAndPacienteDiary,
    selectAllEventosAndAlarmesByPacienteDiary,
    selectAllEventosByCuidadorAndPacienteMonthly,
    selectAllEventosByPacienteMonthly,
    selectAllEventosAndAlarmesByCuidadorDiary,
    selectAllEventosByCuidadorMonthly
}
