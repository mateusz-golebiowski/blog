const config = {
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpUsername: process.env.SMTP_USER || '',
    smtpPassword: process.env.SMTP_PASS || '',
}
export default config;