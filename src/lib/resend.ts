import { Resend } from "resend";
import nodemailer from "nodemailer";

export const resend = new Resend(process.env.RESEND_API_KEY!);

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
})

interface SendEmailProps {
    to: string
    subject: string
    html: string
}

export const sendEmail = async ({to, subject, html}: SendEmailProps) => {
    try {
        let info = await transporter.sendMail({
            from: `CarMarket <${process.env.EMAIL_USER}>`,
            to: to,
            subject: subject,
            html: html
        })
        return info
    } catch (error) {
        console.error("Error al enviar el correo:", error)
        throw error
    }
}
