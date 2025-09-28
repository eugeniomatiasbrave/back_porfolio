import { config } from "dotenv";

// Cargar variables de entorno desde un archivo .env
config();

export default {
    app: {
        PORT: process.env.PORT || 8080,
        FRONTEND_URL: process.env.FRONTEND_URL || 'https://frontporfolio.vercel.app/'
    },
    mailing: {
        sendgridApiKey: process.env.PORFOLIO_API_KEY || 'PORFOLIO_API_KEY',
        from: process.env.MAIL_FROM || 'Portafolio <eugenio_m_brave@hotmail.com>',
        developerEmail: process.env.DEVELOPER_EMAIL || 'eugeniomatiasbrave@gmail.com',
    },

};