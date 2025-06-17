import * as bcrypt from 'bcrypt';

export const generateActivationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashPasswordUtil = async (password: string): Promise<string> => {
  const saltOrRounds = 10;
  try {
    return await bcrypt.hash(password, saltOrRounds);
  } catch (error) {
    throw error;
    // console.log(error);
  }
};

export const comparePasswordUtil = async (
  password: string,
  hashPassword: string,
) => {
  try {
    return await bcrypt.compare(password, hashPassword);
  } catch (error) {
    throw error;
    // console.log(error);
  }
};
