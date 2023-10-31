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

module.exports = {
  enviarEmail
}