const nodemailer = require('nodemailer')


const transportador = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    service: 'gmail',
    secure: true,
    auth:{
        user: 'ayancarecorporation@gmail.com',
        pass: 'rqvfhonfazmgghun'

    }
})


const emailASerEnviado = {
    from: 'ayancarecorporation@gmail.com',
    to: 'lohannes18silva@gmail.com',
    subject: 'Teste de envio de email1',
    Text: 'Tá pegando'
}

transportador.sendMail(emailASerEnviado,(err)=>{
    if (err) {
        console.log(err)
        return
    }

    console.log("E-mail enviado com sucesso!!");
})