import { sendContactUserNotification, sendContactDevNotification } from '../services/MailingService.js';
// Controlador para manejar el envío de correos electrónicos de contacto
export const sendContactEmail = async (req, res) => {
    const { name, email, message } = req.body;

    console.log('=== NUEVO MENSAJE DE CONTACTO ===');
    console.log('Datos recibidos:', { name, email, message });

    try {
        // Enviar notificación al usuario
        await sendContactUserNotification({ to: email, name, email, message });
        console.log('✅ Notificación al usuario enviada');
		
        // Enviar notificación al desarrollador
        await sendContactDevNotification({ name, email, message });
        console.log('✅ Notificación al desarrollador enviada');

        return res.status(200).json({ 
            success: true,
            message: 'Tu mensaje ha sido enviado exitosamente. Te responderé lo antes posible.',
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Error al enviar correos electrónicos de contacto:', error);
        return res.status(500).json({ 
            success: false,
            error: 'Error al enviar correos electrónicos de contacto' 
        });
    }
};



