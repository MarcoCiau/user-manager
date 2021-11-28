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

export const compareHash = async (data: string, hashed: string) => {
    try {
        if (!data) {
            return false;
        }
        const compare: boolean = await bcrypt.compare(data, hashed);
        return compare;
    } catch (error) {
        throw new Error(`Compare Data failed. ${error}`);
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

export const sendEmail = async (toEmail: string, subject: string, resetLink: string) => {

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
        to: toEmail,
        subject: subject,
        html: `<p>Hi, You requested to reset your password.</p><p> Please, click the link below to reset your password</p> <a href="https://${resetLink}">Reset Password</a>`
    };

    try {
        const result = await transporter.sendMail(mailOptions);
        console.log('*********Email sent:********' + result.response);
    } catch (error) {
        console.log(error);
    }
}