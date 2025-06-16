import nodemailer from 'nodemailer';

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        let transport  = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "",
                pass: "",
            },
        });
    
        let info = await transport.sendMail({
            from: 'Igor <my@email.com>',
            to: email,
            subject: subject,
            html: message
        });
        return info
    }
}