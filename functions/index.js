const functions = require('firebase-functions');
const nodemailer = require('nodemailer');

// Configuração do transporte para envio de e-mail
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'seu-email@gmail.com',
    pass: 'sua-senha'
  }
});

exports.sendContactEmail = functions.https.onCall(async (data, context) => {
  const { nome, email, mensagem } = data;

  const mailOptions = {
    from: 'seu-email@gmail.com',
    to: 'alexnanni@gmail.com', 
    subject: 'Novo Contato - Oficina Mecânica',
    text: `Você recebeu uma nova mensagem de contato:\n\nNome: ${nome}\nE-mail: ${email}\nMensagem: ${mensagem}`
  };

  try {
    await transporter.sendMail(mailOptions);
    return { success: true };
  } catch (error) {
    console.error('Erro ao enviar e-mail:', error);
    throw new functions.https.HttpsError('internal', 'Erro ao enviar e-mail');
  }
});
