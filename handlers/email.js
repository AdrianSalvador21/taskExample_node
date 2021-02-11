const nodemailer = require('nodemailer');
const pug = require('pug');
const juice = require('juice');
const htmlToText = require('html-to-text');
const util = require('util');
const emailConfig = require('../config/email');

let transport = nodemailer.createTransport({
  host: emailConfig.host,
  port: emailConfig.port,
  auth: {
    user: emailConfig.user, // generated ethereal user
    pass: emailConfig.pass, // generated ethereal password
  },
});

// generar html
const generarHTML = (archivo, opciones = {}) => {
  const html = pug.renderFile(`${__dirname}/../views/emails/${archivo}.pug`, opciones);
  return juice(html)
};

exports.enviar = async (opciones) => {
  let mailOptions = {
    from: 'UpTask <no-reply@uptask.com>', // sender address
    to: opciones.usuario.email, // list of receivers
    subject: opciones.subject, // Subject line
    text: htmlToText.fromString(generarHTML(opciones.archivo, opciones)), // plain text body
    html: generarHTML(opciones.archivo, opciones), // html body
  };

  // await transport.sendMail(mailOptions);

  const enviarEmail = util.promisify(transport.sendMail, transport);
  return enviarEmail.call(transport, mailOptions);
};

