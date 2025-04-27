import { Resend } from "resend";

export const resend = new Resend(process.env.RESEND_API_KEY!);

interface SendEmailProps {
    to: string
    subject: string
    html: string
}

export const sendEmail = async ({to, subject, html}: SendEmailProps) => {
    const response = await resend.emails.send({
        from: "AutoMarket <valentinocopperi@gmail.com>",
        to: to,
        subject: subject,
        html: html
    })
    return response
}
