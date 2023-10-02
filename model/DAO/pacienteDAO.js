/**************************************************************************************
 * Objetivo: Responsável pela manipulação de dados dos PACIENTES no Banco de Dados.
 * Data: 06/09/2023
 * Autor: Lohannes da Silva Costa
 * Versão: 1.0
 **************************************************************************************/

//Import da biblioteca do prisma client
var { PrismaClient } = require('@prisma/client');

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

/************************** Selects ******************************/
const selectAllPacientes = async function () {

    //scriptSQL para buscar todos os itens do BD
    let sql = 'SELECT * FROM tbl_paciente'

    //$queryRawUnsafe(sql) - Permite interpretar uma variável como sendo um scriptSQL
    //$queryRaw('SELECT * FROM tbl_aluno') - Executa diretamente o script dentro do método
    let rsPaciente = await prisma.$queryRawUnsafe(sql)

    //Valida se o BD retornou algum registro
    if (rsPaciente.length > 0) {
        return rsPaciente
    } else {
        return false
    }

}

//,
//tbl_alarme_medicamento.id as alarme_id, tbl_alarme_medicamento.intervalo as intervalo

const selectPacienteById = async function (idPaciente) {
    let sql = `select tbl_paciente.*, DATE_FORMAT(tbl_paciente.data_nascimento,'%d/%m/%Y') as data_nascimento_formatada,
    tbl_doenca_cronica.id as doenca_id, tbl_doenca_cronica.nome as doenca, tbl_doenca_cronica.grau as doenca_grau, 
    tbl_comorbidade.id as comorbidade_id, tbl_comorbidade.nome as comorbidade,
    tbl_medicamento.id as medicamento_id, tbl_medicamento.nome as medicamento, concat(tbl_medicamento.quantidade, ' ',tbl_medida.sigla) as quantidade, DATE_FORMAT(tbl_medicamento.data_validade,'%d/%m/%Y') as validade, tbl_medicamento.estocado as estocado,
    tbl_alarme_medicamento.id as alarme_id, tbl_alarme_medicamento.id_medicamento as id_medicamento_do_alarme, tbl_alarme_medicamento.intervalo as intervalo, TIME_FORMAT(tbl_alarme_medicamento.horario, '%H:%i:%s') as horario
from tbl_paciente
    left join tbl_doenca_cronica_paciente
 on tbl_doenca_cronica_paciente.id_paciente = tbl_paciente.id
    left join tbl_comorbidade_paciente
 on tbl_comorbidade_paciente.id_paciente = tbl_paciente.id
    left join tbl_comorbidade
 on tbl_comorbidade.id = tbl_comorbidade_paciente.id_comorbidade
    left join tbl_doenca_cronica
 on tbl_doenca_cronica_paciente.id_doenca_cronica = tbl_doenca_cronica.id
    left join tbl_medicamento
 on tbl_medicamento.id_paciente = tbl_paciente.id
    left join tbl_medida
 on tbl_medida.id = tbl_medicamento.id_medida
    left join tbl_alarme_medicamento
 on tbl_alarme_medicamento.id_medicamento = tbl_medicamento.id
where tbl_paciente.id = ${idPaciente};`

    let rsPaciente = await prisma.$queryRawUnsafe(sql)

    if (rsPaciente.length > 0) {
        let pacienteJSON = {}
        let doencas = []
        let comorbidades = []
        let medicamentos = []
        let set = Array.from(new Set(rsPaciente))

        pacienteJSON.doenca_id = 0
        let arrayID = []
        pacienteJSON.medicamento_id = 0

        set.forEach(paciente => {
            pacienteJSON.id = paciente.id
            pacienteJSON.nome = paciente.nome
            pacienteJSON.data_nascimento = paciente.data_nascimento
            pacienteJSON.email = paciente.email
            pacienteJSON.senha = paciente.senha
            pacienteJSON.cpf = paciente.cpf
            pacienteJSON.foto = paciente.foto
            pacienteJSON.historico_medico = paciente.historico_medico

            if(paciente.doenca_id != pacienteJSON.doenca_id){
                let doenca = {}

                pacienteJSON.doenca_id = paciente.doenca_id
                doenca.id = paciente.doenca_id
                doenca.nome = paciente.doenca
                doenca.grau = paciente.doenca_grau

                doencas.push(doenca)
            }

            if(!arrayID.includes(paciente.comorbidade_id)){
                let comorbidade = {}

                arrayID.push(paciente.comorbidade_id)
                pacienteJSON.comorbidade_id = paciente.comorbidade_id
                comorbidade.id = paciente.comorbidade_id
                comorbidade.nome = paciente.comorbidade

                comorbidades.push(comorbidade)
            }

            if(paciente.medicamento_id != pacienteJSON.medicamento_id){
                let medicamento = {}

                pacienteJSON.medicamento_id = paciente.medicamento_id
                medicamento.id = paciente.medicamento_id
                medicamento.nome = paciente.medicamento
                medicamento.quantidade = paciente.quantidade
                medicamento.validade = paciente.validade

                if(paciente.estocado === 1){
                    medicamento.estaEstocado = true
                } else {
                    medicamento.estaEstocado = false
                }

                if(paciente.id_medicamento_do_alarme == medicamento.id){
                    let alarme = {}

                    alarme.id = paciente.alarme_id
                    alarme.intervaloTempo = conversaoDeMilissegundos(paciente.intervalo)
                    alarme.horario = paciente.horario

                    medicamento.alarme = alarme
                }

                medicamentos.push(medicamento)
            }

            pacienteJSON.doencas_cronicas = doencas
            pacienteJSON.comorbidades = comorbidades
            pacienteJSON.medicamentos = medicamentos
        })

        delete pacienteJSON.doenca_id
        delete pacienteJSON.medicamento_id

        return pacienteJSON
    } else {
        return false
    }
}

const selectPacienteByEmail = async function (emailPaciente) {
    let sql = `select * from tbl_paciente where email = '${emailPaciente}'`

    let rsPaciente = await prisma.$queryRawUnsafe(sql)

    if (rsPaciente.length > 0) {
        return rsPaciente[0]
    } else {
        return false
    }
}

const selectLastId = async function () {
    let sql = 'select * from tbl_paciente order by id desc limit 1;'

    let rsPaciente = await prisma.$queryRawUnsafe(sql)

    if (rsPaciente.length > 0) {
        return rsPaciente[0]
    } else {
        return false
    }

    //retorna o ultimo id inserido no banco de dados
}

const selectPacienteByEmailAndSenhaAndNome = async function (dadosPaciente){
    let sql = `select 
    tbl_paciente.id as id,
    tbl_paciente.nome as nome, 
    tbl_paciente.email as email, 
    DATE_FORMAT(tbl_paciente.data_nascimento,'%d/%m/%Y') as data_nascimento, 
    tbl_paciente.foto as foto, 
    tbl_paciente.historico_medico as historico_medico,
	tbl_genero.nome as genero
    from tbl_paciente
        inner join tbl_genero on tbl_genero.id = tbl_paciente.id_genero
    where tbl_paciente.email = '${dadosPaciente.email}' and tbl_paciente.senha = '${dadosPaciente.senha}'`

    let rsPaciente = await prisma.$queryRawUnsafe(sql)

    if (rsPaciente.length > 0) {
        return rsPaciente[0]
    } else {
        return false
    }
}

/************************** Inserts ******************************/

/****************************************************************************************
VVVVV Depois fazer o tratamento para caso exista um paciente com dados parecidos!!! VVVVV
****************************************************************************************/
const insertPaciente = async function (dadosPaciente) {
    let sql = `insert into tbl_paciente(
        nome,
        data_nascimento,
        email,
        senha,
        cpf,
        foto,
        historico_medico,
        id_endereco_paciente,
        id_genero
    ) values (
        '${dadosPaciente.nome}',
        '2005-01-21',
        '${dadosPaciente.email}',
        '${dadosPaciente.senha}',
        '${dadosPaciente.cpf}',
        '${dadosPaciente.foto}',
        '${dadosPaciente.historico_medico}',
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
const updatePaciente = async function (dadosPaciente) {
    let sql = `update tbl_paciente set
            nome = '${dadosPaciente.nome}',
            data_nascimento = '${dadosPaciente.data_nascimento}',
            cpf = '${dadosPaciente.cpf}',
            foto = '${dadosPaciente.foto}',
            historico_medico = '${dadosPaciente.historico_medico}'
        where id = ${dadosPaciente.id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

const updateSenhaPaciente = async function (dadosPaciente) {
    let sql = `update tbl_paciente set
            senha = '${dadosPaciente.senha}'
        where id = ${dadosPaciente.id}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
} 

/************************** Deletes ******************************/
const deletePaciente = async function (idPaciente) {
    let sql = `delete from tbl_paciente where id = ${idPaciente}`

    let resultStatus = await prisma.$executeRawUnsafe(sql)

    if (resultStatus) {
        return true
    } else {
        return false
    }
}

module.exports = {
    deletePaciente,
    insertPaciente,
    selectAllPacientes,
    selectLastId,
    selectPacienteById,
    selectPacienteByEmailAndSenhaAndNome,
    updatePaciente,
    updateSenhaPaciente,
    selectPacienteByEmail
}
