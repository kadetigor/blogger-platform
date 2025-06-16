import nodemailer from 'nodemailer';
import { SETTINGS } from '../../core/settings/settings';

export const emailAdapter = {
    async sendEmail(email: string, subject: string, message: string) {
        let transport  = nodemailer.createTransport({
            host: "smtp.yandex.com",
            port: 465,
            secure: true, // use SSL
            auth: {
                user: SETTINGS.YANDEX_EMAIL,
                pass: SETTINGS.YANDEX_PASSWORD, // App password (or account password if no 2FA)
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