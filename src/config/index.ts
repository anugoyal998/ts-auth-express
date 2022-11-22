import dotenv from 'dotenv';
dotenv.config()

type IEnv = {
    JWT_ACCESS_SECRET: string;
    JWT_REFRESH_SECRET: string;
}

const envConfig: IEnv = {
    JWT_ACCESS_SECRET: process.env.JWT_ACCESS_SECRET || '',
    JWT_REFRESH_SECRET: process.env.JWT_REFRESH_SECRET || '',
}

export default envConfig