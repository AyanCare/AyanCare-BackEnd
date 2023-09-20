"use strict";
const nodemailer = require("nodemailer");
//import * as nodemailer from 'nodemailer'

const transporter = nodemailer.createTransport({
  host: "smtp.resend.com",
  port: 465,
  secure: true,
  auth: {
    // TODO: replace `user` and `pass` values from <https://forwardemail.net>
    user: "resend",
    pass: "re_gYrdv39S_BjAJjxyyGiwxv5nWkDzU9us1",
  },
});

// async..await is not allowed in global scope, must use a wrapper
async function sendEmail(email, token) {
  console.log(`${email}`);

  // send mail with defined transport object
  const info = await transporter.sendMail({
    from: `${email}`, // sender address
    to: 'Acme <onboarding@resend.dev>', // list of receivers
    subject: "Token Password Recovery", // Subject line
    text: "Seu Token para recuperar a senha", // plain text body
    html: `Este é seu Token: <b>${token}</b>`, // html body
  });

  console.log("Message sent: %s", info.messageId);
  // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

  //
  // NOTE: You can go to https://forwardemail.net/my-account/emails to see your email delivery status and preview
  //       Or you can use the "preview-email" npm package to preview emails locally in browsers and iOS Simulator
  //       <https://github.com/forwardemail/preview-email>
  //
}

module.exports = {
  sendEmail
}