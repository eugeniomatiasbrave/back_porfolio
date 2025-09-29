import { config } from "dotenv";

// Cargar variables de entorno desde un archivo .env
config();

export default {
    app: {
        PORT: process.env.PORT || 8080,
        NODE_ENV: process.env.NODE_ENV || 'development' || 'production',
        FRONTEND_URL: process.env.FRONTEND_URL || 'https://frontporfolio.vercel.app/',
        // URLs permitidas para CORS (separadas por comas)
        ALLOWED_ORIGINS: process.env.ALLOWED_ORIGINS?.split(',') || [
            'https://frontporfolio.vercel.app',
            'http://localhost:5173', // Desarrollo local SvelteKit
            'http://localhost:8080'  // Desarrollo local alternativo
        ]
    },
    mailing: {
        sendgridApiKey: process.env.SENDGRID_API_KEY || process.env.PORFOLIO_API_KEY || '',
        fromEmail: process.env.FROM_EMAIL || 'eugenio_m_brave@hotmail.com',
        devEmail: process.env.DEV_EMAIL || '',

    },

};