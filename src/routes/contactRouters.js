import { Router } from 'express';
import { sendContactEmail } from '../controllers/contactController.js';

const router = Router();

// Ruta para enviar formulario de contacto
router.post('/', sendContactEmail);

export default router;