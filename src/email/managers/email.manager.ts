import { emailAdapter } from "../adapters/email.adapter";
import { UserWithConfirmation } from "../user.with.confirmation.type";

export const emailManager = {
    async sendEmailConfimationMessage(user: UserWithConfirmation) {
        await emailAdapter.sendEmail(user.email, "Registration Confirmation", `<h1>Thank for your registration</h1>
 <p>To finish registration please follow the link below:
     <a href='https://somesite.com/confirm-email?code=${user.emailConfirmation.confirmationCode}'>complete registration</a>
 </p>`)
    }
}