import { config } from "dotenv";

// Cargar variables de entorno desde un archivo .env
config();

export default {
    app: {
        PORT: process.env.PORT || 8080,
        FRONTEND_URL: process.env.FRONTEND_URL || 'http://localhost:5173'
    },
    mailing: {
        sendgridApiKey: process.env.PORFOLIO_API_KEY || process.env.SENDGRID_API_KEY || 'PORFOLIO_API_KEY_no_definida',
        from: process.env.MAIL_FROM || 'Portafolio <eugeniomatiasbrave@gmail.com>',
        developerEmail: process.env.DEVELOPER_EMAIL || 'eugeniomatiasbrave@gmail.com',
    },

};