import sgMail from '@sendgrid/mail';
import config from '../config/config.js';

// Configurar la clave de API de SendGrid

export default class MailingService { // Exportar la clase MailingService
	constructor() {
		console.log('API Key configurada:', config.mailing.sendgridApiKey ? `${config.mailing.sendgridApiKey.substring(0, 6)}...` : 'NO CONFIGURADA');
		console.log('API Key starts with SG:', config.mailing.sendgridApiKey?.startsWith('SG.'));
		sgMail.setApiKey(config.mailing.sendgridApiKey);
	}

	sendMail = async (mailRequest) => { 
		try {
			const msg = { // Configurar el mensaje de correo
				to: mailRequest.to,  // Destinatario
				from: mailRequest.from || config.mailing.from, // Usar from del request o default
				subject: mailRequest.subject, // Asunto
				text: mailRequest.text, // Texto plano
				html: mailRequest.html,  // Contenido HTML
				...(mailRequest.attachments && { attachments: mailRequest.attachments }) // Adjuntos si existen
			};

			const result = await sgMail.send(msg);
			return result;
		} catch (error) {
			console.error('Error sending email:', error);
			throw error;
		}
	};
}
