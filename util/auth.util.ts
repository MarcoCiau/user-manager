/*
hash password
compare password
generate JWT
validate JWT
*/
import bcrypt from 'bcrypt';

export const hashPassword = async (password: string) => {
    try {
        const hashedPassword: string = await bcrypt.hash(password, 10);
        return hashedPassword;
    } catch (error) {
        console.log('Hashing password failed : ', error);
        return '';
    }
}