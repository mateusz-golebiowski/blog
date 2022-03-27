const config = {
    host: process.env.HOST || '127.0.0.1',
    port: process.env.PORT || '4000',
    smtpHost: process.env.SMTP_HOST || 'smtp.gmail.com',
    smtpUsername: process.env.SMTP_USER || '',
    smtpPassword: process.env.SMTP_PASS || '',
    dbHost: process.env.DB_HOST || 'localhost',
}
export default config;