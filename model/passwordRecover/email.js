import { Resend } from 'resend';
const resend = new Resend('re_gYrdv39S_BjAJjxyyGiwxv5nWkDzU9us1');

const sendEmailFinal = async function (token, email) {
    try {
      const data = await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: [`${email}`],
        subject: 'Teste',
        html: `<strong>${token}</strong>`,
      });

      console.log(data);
    } catch (error) {
      console.error(error);
  }
}

const sendEmail = async function () {
  try {
    const data = await resend.emails.send({
      from: 'Acme <onboarding@resend.dev>',
      to: ['ayancarecorporation@gmail.com'],
      subject: 'Teste',
      html: '<strong>é isso</strong>',
    });

    console.log(data);
  } catch (error) {
    console.error(error);
  }
}

sendEmail()