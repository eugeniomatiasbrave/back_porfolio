import express from "express";
import contactsRouter from "./routes/contactRouters.js";
import config from './config/config.js';
import cors from 'cors'; 
import path from 'path';
import __dirname from './utils.js';

const app = express();

// Configuración CORS mejorada
const corsOptions = {
    origin: (origin, callback) => {
        // Permitir requests sin origin (ej: aplicaciones móviles, Postman)
        if (!origin) return callback(null, true);
        
        if (config.app.ALLOWED_ORIGINS.includes(origin)) {
            callback(null, true);
        } else {
            console.warn(`[CORS] Origin no permitido: ${origin}`);
            callback(new Error('No permitido por política CORS'));
        }
    },
    credentials: true, // Permitir cookies/credenciales
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    optionsSuccessStatus: 200 // Para navegadores legacy
};

app.use(cors(corsOptions));

// Confiar en proxy (importante para obtener IP real en producción)
app.set('trust proxy', 1);

app.use(express.json({ limit: '10mb' })); // Middleware para parsear JSON con límite
app.use(express.urlencoded({ extended: true })); // Middleware para parsear el cuerpo de las peticiones URL-encoded

// Configurar archivos estáticos con rutas absolutas
const publicPath = path.join(__dirname, '../public');
console.log('📁 Configurando archivos estáticos desde:', publicPath);
app.use(express.static(publicPath)); // Middleware para servir archivos estáticos

// IMPORTANTE: Definir rutas ANTES de app.listen()
app.use('/api/contacts', contactsRouter);

// Ruta de prueba
app.get('/', (req, res) => {
    res.json({ 
        message: 'Backend del Portafolio funcionando correctamente',
        environment: config.app.NODE_ENV,
        timestamp: new Date().toISOString()
    });
});

const PORT = config.app.PORT;

app.listen(PORT, () => {
    console.log(`Server is running on ${PORT}`);
    console.log(`Environment: ${config.app.NODE_ENV}`);
    console.log(`CORS enabled for: ${config.app.ALLOWED_ORIGINS.join(', ')}`);
});
