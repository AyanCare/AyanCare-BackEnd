const nodemailer = require('nodemailer')

const enviarEmail = function (token, emailUsuario) {
  const transportador = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    secure: true,
    auth: {
      user: 'ayancarecorporation@gmail.com',
      pass: 'rqvfhonfazmgghun'
    }
  })

  const email = {
    from: 'ayancarecorporation@gmail.com',
    to: `${emailUsuario}`,
    subject: 'Recuperacão de senha - AyanCare',
    template: 'forgotPassword',
    text: `Este é seu token para recuperar sua senha: ${token}`
  }

  transportador.sendMail(email)
}

const enviarSugestao = function (dadosUsuario) {
  const transportador = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    secure: true,
    auth: {
      user: 'ayancarecorporation@gmail.com',
      pass: 'rqvfhonfazmgghun'
    }
  })

  const email = {
    from: `${dadosUsuario.email}`,
    to: `ayancarecorporation@gmail.com`,
    subject: `Sugestão de ${dadosUsuario.nome} - AyanCare`,
    template: '',
    text: ` Email do usuário: ${dadosUsuario.emai} \n ${dadosUsuario.sugestao}`
  }

  transportador.sendMail(email)
}

module.exports = {
  enviarEmail,
  enviarSugestao
}