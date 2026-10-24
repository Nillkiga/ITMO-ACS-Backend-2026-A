import bcrypt from 'bcryptjs';

const checkPassword = (userPassword: string, password: string): boolean => {
    return bcrypt.compareSync(password, userPassword);
};

export default checkPassword;