import sgMail from '@sendgrid/mail';
import config from '../config/config.js';
import __dirname from '../utils.js';
import fs from 'fs';
import path from 'path';

// Validar y configurar SendGrid API Key
const validateAndSetApiKey = () => {
    const apiKey = config.mailing.sendgridApiKey;
    
    if (!apiKey) {
        console.error('❌ No se encontró la API key de SendGrid');
        console.error('📋 Variables de entorno disponibles para mailing:');
        console.error('   - SENDGRID_API_KEY:', process.env.SENDGRID_API_KEY ? 'SET' : 'NOT SET');
        console.error('   - PORFOLIO_API_KEY:', process.env.PORFOLIO_API_KEY ? 'SET' : 'NOT SET');
        return false;
    }
    
    if (!apiKey.startsWith('SG.')) {
        console.error('❌ API key de SendGrid inválida: debe comenzar con "SG."');
        console.error('🔑 API key actual:', apiKey.substring(0, 10) + '...');
        return false;
    }
    
    sgMail.setApiKey(apiKey);
    console.log('✅ API key de SendGrid configurada correctamente');
    return true;
};

// Verificar configuración al importar el módulo
const isApiKeyValid = validateAndSetApiKey();

// Envía un email de notificación al usuario que completó el formulario
export const sendContactUserNotification = async ({ to, name, email, message }) => {
	try {
		// Verificar que la API key esté configurada correctamente
		if (!isApiKeyValid) {
			throw new Error('SendGrid API key no está configurada correctamente');
		}

		// Construir la ruta al archivo PDF usando el módulo utils
		const pdfPath = path.join(__dirname, '../public/CV_Eugenio_Brave.pdf');
		
		console.log('🔍 Buscando PDF en:', pdfPath);
		
		let pdfBuffer;
		let finalPdfPath;
		
		// Verificar si el archivo PDF existe
		if (!fs.existsSync(pdfPath)) {
			console.warn('⚠️ Archivo PDF no encontrado en:', pdfPath);
			console.log('📂 Intentando con ruta alternativa...');
			
			// Intentar con ruta alternativa (directamente en public/)
			const alternativePdfPath = path.join(process.cwd(), 'src/public/CV_Eugenio_Brave.pdf');
			console.log('🔍 Ruta alternativa:', alternativePdfPath);
			
			if (!fs.existsSync(alternativePdfPath)) {
				console.error('❌ El archivo CV no existe en ninguna de las rutas verificadas');
				console.log('📁 Enviando email sin adjunto...');
				// Continuar sin adjunto en lugar de fallar completamente
				finalPdfPath = null;
			} else {
				finalPdfPath = alternativePdfPath;
			}
		} else {
			finalPdfPath = pdfPath;
		}

		let attachments = [];
		if (finalPdfPath) {
			// Leer el archivo PDF y convertirlo a base64
			pdfBuffer = fs.readFileSync(finalPdfPath);
			const pdfBase64 = pdfBuffer.toString('base64');
			
			console.log('📎 Preparando email con CV adjunto para:', to);
			console.log('📄 Tamaño del PDF:', (pdfBuffer.length / 1024 / 1024).toFixed(2), 'MB');
			console.log('✅ PDF encontrado en:', finalPdfPath);

			attachments = [
				{
					content: pdfBase64,
					filename: 'CV_Eugenio_Brave.pdf',
					type: 'application/pdf',
					disposition: 'attachment'
				}
			];
		}

		const mailOptions = {
			to, // Destinatario (el usuario que completó el formulario)
			from: config.mailing.fromEmail, // Remitente configurado, este debe ser un email verificado en SendGrid
			replyTo: config.mailing.devEmail, // Email de respuesta
			subject: 'Gracias por tu mensaje - CV Adjunto',
			html: `
				<p>Hola ${name},</p>
				<p>Gracias por ponerte en contacto conmigo. He recibido tu mensaje:</p>
				<blockquote>${message}</blockquote>
				<p>Te responderé lo antes posible.</p>
				${finalPdfPath ? '<p>Adjunto encontrarás mi CV actualizado en formato PDF para tu revisión.</p>' : '<p>Mi CV estará disponible próximamente.</p>'}
				<p>Saludos,<br>Eugenio Brave</p>
			`,
			attachments
		};

		await sgMail.send(mailOptions);
		console.log('✅ Email de confirmación enviado al usuario:', to);
	} catch (error) {
		console.error('❌ Error al enviar el email al usuario:', error);
		
		// Manejo específico de errores de autorización
		if (error.code === 401 || (error.response && error.response.status === 401)) {
			console.error('🔐 Error de autorización - verifica la API key de SendGrid');
			console.error('📋 Configuración actual:');
			console.error('   - API Key configurada:', config.mailing.sendgridApiKey ? 'Sí' : 'No');
			console.error('   - From Email:', config.mailing.fromEmail);
		}
		
		if (error.response) {
			console.error('Código de estado:', error.response.statusCode);
			console.error('Cuerpo de la respuesta:', error.response.body);
		}
		throw new Error('Error al enviar el email al usuario');
	}
};


// Envía un email de notificación al administrador/desarrollador
export const sendContactDevNotification = async ({ name, email, message }) => {
	try {
		// Verificar que la API key esté configurada correctamente
		if (!isApiKeyValid) {
			throw new Error('SendGrid API key no está configurada correctamente');
		}

		console.log('=== ENVIANDO EMAIL AL DESARROLLADOR ===');
		console.log('Email del desarrollador:', config.mailing.devEmail);
		console.log('Email del remitente:', config.mailing.fromEmail);
		console.log('Datos del contacto:', { name, email, message });

		if (!config.mailing.devEmail) {
			console.warn('⚠️ Email del desarrollador no configurado - saltando notificación');
			return;
		}

		const mailOptions = {
			to: config.mailing.devEmail, // Email del desarrollador/administrador
			from: config.mailing.fromEmail, // Remitente configurado, este debe ser un email verificado en SendGrid
			subject: 'Nuevo mensaje de contacto',
			html: `
				<p>Hola,</p>
				<p>Has recibido un nuevo mensaje de contacto:</p>
				<ul>
					<li><strong>Nombre:</strong> ${name}</li>
					<li><strong>Email:</strong> ${email}</li>
					<li><strong>Mensaje:</strong></li>
					<blockquote>${message}</blockquote>
				</ul>
			`
		};

		console.log('Opciones del email:', mailOptions);
		
        const result = await sgMail.send(mailOptions);
		console.log('✅ Email al desarrollador enviado exitosamente:', result[0]?.statusCode);
		
	} catch (error) {
		console.error('❌ Error al enviar el email al desarrollador:', error);
		
		// Manejo específico de errores de autorización
		if (error.code === 401 || (error.response && error.response.status === 401)) {
			console.error('🔐 Error de autorización - verifica la API key de SendGrid');
			console.error('📋 Configuración actual:');
			console.error('   - API Key configurada:', config.mailing.sendgridApiKey ? 'Sí' : 'No');
			console.error('   - From Email:', config.mailing.fromEmail);
			console.error('   - Dev Email:', config.mailing.devEmail);
		}
		
		if (error.response) {
			console.error('Código de estado:', error.response.statusCode);
			console.error('Cuerpo de la respuesta:', error.response.body);
		}
		console.error('Mensaje del error:', error.message);
		throw new Error('Error al enviar el email al desarrollador');
	}
};
export const MailingService = {
    sendContactUserNotification,
    sendContactDevNotification
};