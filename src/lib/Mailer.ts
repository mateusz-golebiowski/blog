import nodemailer from 'nodemailer'
import config from "../config/config";
class Mailer{
    private static instance: Mailer;
    private transporter!: nodemailer.Transporter;

    private constructor() {
        this.transporter = nodemailer.createTransport({
            host: config.smtpHost,
            port: 465,
            secure: true, // true for 465, false for other ports
            auth: {
                user: config.smtpUsername,
                pass: config.smtpPassword,
            },
        });
    }
    public static getInstance() {
        if (!Mailer.instance) {
            Mailer.instance = new Mailer();
        }
        return Mailer.instance
    }
    public async sendPassword(email: string, password: string) {
        await this.transporter.sendMail({
            from: `"Blog" <${config.smtpUsername}>`, // sender address
            to: email, // list of receivers
            subject: " Your invitation", // Subject line
            text: `Here is your password: ${password}`, // plain text body
        });
    }
}

export default Mailer