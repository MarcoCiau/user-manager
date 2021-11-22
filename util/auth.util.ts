/*
hash password
compare password
generate JWT
validate JWT
*/
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import envConfig from '../config/config';

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