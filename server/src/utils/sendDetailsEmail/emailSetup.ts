import nodemailer from 'nodemailer'

export default function emailSetup(
  senderEmail: string,
  senderPassword: string,
  recipientEmail: string,
  content: { subject: string; text: string }
) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: senderEmail,
      pass: senderPassword,
    },
  })

  const mailOptions = {
    from: senderEmail,
    to: recipientEmail,
    ...content,
  }

  return { transporter, mailOptions }
}
