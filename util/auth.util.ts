/*
hash password
compare password
generate JWT
validate JWT
*/
import bcrypt from 'bcrypt';
import jwt, { VerifyErrors } from 'jsonwebtoken';
import config from '../config/config';
import nodemailer from 'nodemailer';
import smtpTransport from 'nodemailer-smtp-transport';

const generateJWT = async (userId: string, privateKey: string, expires: string) => {
    return new Promise<string>((resolve, reject) => {
        jwt.sign({ userId }, privateKey, { expiresIn: expires }, function (error, token = '') {
            if (error) {
                reject(error);
            }
            if (!token) {
                reject(null)
            }
            resolve(token);
        });
    })
};

const verifyJWT = (token: string, privateKey: string) => {
    return new Promise((resolve, reject) => {
        jwt.verify(token, privateKey, function (err: VerifyErrors | null, decoded: object | undefined) {
            if (err) {
                reject(err);
            }
            resolve(decoded);
        });
    })
};

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

export const generateAccessToken = async (userId: string) => {
    return generateJWT(userId, config.ACCESS_TOKEN_KEY, '1h');
};

export const generateRefreshToken = async (userId: string) => {
    return generateJWT(userId, config.REFRESH_TOKEN_KEY, '60d');
};

export const verifyAccessToken = async (token: string) => {
    return verifyJWT(token, config.ACCESS_TOKEN_KEY);
};

export const verifyRefreshToken = async (token: string) => {
    return verifyJWT(token, config.REFRESH_TOKEN_KEY);
};

export const getUserIdFromToken = (token: string) => {
    try {
        jwt.decode(token)
        
    } catch (error) {
        
    }
};


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