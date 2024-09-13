import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: 'asispassrecovery@gmail.com', // Tu dirección de correo electrónico de Gmail
        pass: 'efht qcnr juri lzwh' // La contraseña de aplicación generada
    }
});

const sendMail = async (destinatario, asunto, texto) => {
    try {
        const info = await transporter.sendMail({
            from: 'sispassrecovery@gmail.com',
            to: destinatario,
            subject: asunto,
            text: texto
        });

        console.log('Correo enviado:', info.response);
    } catch (error) {
        console.error('Error al enviar el correo:', error);
    }
};

export default sendMail

