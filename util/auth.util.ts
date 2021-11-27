/*
hash password
compare password
generate JWT
validate JWT
*/
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import envConfig from '../config/config';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

export const hashPassword = async (password: string) => {
    try {
        const hashedPassword: string = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        console.log('Hashing password failed : ', error);
        return '';
    }
}

export const generateJWT = async (userId: string) => {
    return new Promise<string>((resolve, reject) => {
        jwt.sign({ userId }, envConfig.JWT_PRIVATE_KEY, { expiresIn: '1h' }, function (error, token = '') {
            if (error) {
                reject(error);
            }
            if (!token) {
                reject('Invalid JWT Token.')
            }
            resolve(token);
        });
    })
}

export const sendEmail = async () => {

    let transporter = nodemailer.createTransport(smtpTransport({
        name: 'hostgator',
        host: 'marcociau.com',
        port: 465,
        secure: true,
        auth: {
            user: "contact@marcociau.com",
            pass: "6upZR4K$hjwDR7"
        },
        tls: {
            rejectUnauthorized: false
        }
    }));

    let mailOptions = {
        from: 'contact@marcociau.com',
        to: 'marco@makerlab.mx',
        subject: 'Felicidades! Te ganaste un auto!',
        html: '<h3>Da click aquí : </br>'
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('*********Email sent:********' + result.response);
    } catch (error) {
        console.log(error);
    }
}