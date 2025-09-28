import { Router } from "express";
import MailingService from "../services/MailingService.js";
import __dirname from '../utils.js';

const router = Router();

router.post('/', async (req, res) => { // Ruta para manejar el formulario de contacto
    // Extraer los datos del formulario desde el cuerpo de la solicitud
    const { name, email, menssage } = req.body; // Desestructurar los datos del cuerpo de la solicitud.

    // No guardo en base de datos, solo envio mails.
    // A futuro podria guardar en una base de datos si quiero tener un registro de los contactos.

    const newContact = {
        name,
        email,
        menssage
    };

    //console.log("Llego el body al BACK:", newContact);

    // Correo para el reclutador o quien se quiera contactar mediante el formulario.
    const mailToRecruiter = {
        from: "Porfolio Contact Form",
        to: [email],
        subject: "Porfolio Eugenio M. Brave y CV",
        html: `
        <div>
            <h4>Hola!</h4>
            <p>Gracias <strong>${name}</strong> por tu interés.</p>
            <p>Adjunto encontrarás mi CV en PDF.</p>
            <p>Espero que podamos contactarnos pronto.</p>
            <p>Saludos, Eugenio Brave</p>
            <p>Email: eugeniomatiasbrave@gmail.com o eugenio_m_brave@hotmail.com</p>
        </div>
        `,
        attachments: [
            {
                filename: 'CV-3-2025-EugenioBrave.pdf',
                path: `${__dirname}/public/CV-3-2025-EugenioBrave.pdf`, // Ruta absoluta
            }
        ]
    };

    // Configurar el correo para mi mismo, el desarrollador, con los detalles del contacto, etc.
    const mailToDeveloper = {
        from: "Porfolio Contact Form",
        to: ["eugeniomatiasbrave@gmail.com"],
        subject: "Nuevo contacto desde tu porfolio",
        html: `
        <div>
            <h4>Nuevo contacto recibido</h4>
            <p><strong>Nombre:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Mensaje:</strong> ${menssage}</p>
        </div>
        `
    };

    try {
        const mailingService = new MailingService();

        // Enviar correo al reclutador
        const recruiterResult = await mailingService.sendMail(mailToRecruiter);
        console.log("Correo enviado al reclutador:", recruiterResult);

        // Enviar correo a ti mismo
        const developerResult = await mailingService.sendMail(mailToDeveloper);
        console.log("Correo enviado al desarrollador:", developerResult);

        res.status(200).json({ message: "Contact created and emails sent", contact: newContact });
    } catch (error) {
        console.error("Error al enviar los correos:", error);
        res.status(500).json({ message: "Error al enviar los correos", error });
    }
});

export default router;