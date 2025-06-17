"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.emailAdapter = void 0;
const nodemailer_1 = __importDefault(require("nodemailer"));
const settings_1 = require("../../core/settings/settings");
exports.emailAdapter = {
    sendEmail(email, subject, message) {
        return __awaiter(this, void 0, void 0, function* () {
            // If no API key is configured, just log and return success
            if (!settings_1.SETTINGS.SENDGRID_API_KEY) {
                console.log('No SendGrid API key configured, skipping email send');
                console.log(`Would send email to: ${email}, subject: ${subject}`);
                return { messageId: 'no-api-key-configured' };
            }
            try {
                let transport = nodemailer_1.default.createTransport({
                    host: "smtp.sendgrid.net",
                    port: 587,
                    secure: false,
                    auth: {
                        user: "apikey",
                        pass: settings_1.SETTINGS.SENDGRID_API_KEY,
                    },
                });
                let info = yield transport.sendMail({
                    from: `Igor <kadet3216@em3772.ftpropaganda.com>`,
                    to: email,
                    subject: subject,
                    html: message
                });
                console.log('Email sent: ', info.messageId);
                return info;
            }
            catch (error) {
                console.error('Error sending email:', error);
                // Don't throw errors to prevent breaking the flow
                console.log('Email sending failed, but continuing...');
                return { messageId: 'email-send-failed' };
            }
        });
    }
};
