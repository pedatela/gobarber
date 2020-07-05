import nodemailer from 'nodemailer'
import mailConfig from '../config/mail'
import exphbs from 'express-handlebars'
import nodemailerhbs from 'nodemailer-express-handlebars'

class Mail {
  constructor() {
    const { host, port, secure, auth } = mailConfig
    this.transporter = nodemailer.createTransport({
      host,
      port,
      secure,
      auth: auth.user ? auth : null
    })
  }
  configureTemplates() {
    const viewPath = (__dirname, '..', 'app', 'views', 'emails')
    this.transporter.use('compile', nodemailerhbs({
      viewEngine: exphbs({
        layoutsDir: resolve(viewPath, 'layouts'),
        partialsDir: resolve(viewPath, 'partials'),
        defaultLayout: 'default',
        extname: '.hbs'
      }),
      viewPath,
      extName: '.hbs'
    }))
  }

  sendMail(message) {
    this.transporter.sendMail({
      ...mailConfig.default,
      ...message
    })
  }

}

export default new Mail();