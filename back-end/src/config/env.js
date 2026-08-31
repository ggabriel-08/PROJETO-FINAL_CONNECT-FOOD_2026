import dotenv from "dotenv"

dotenv.config();

const env = {
    port: process.env.PORT || 3000,

    db: {
        host: process.env.DB_HOST || '172.18.208.1',
        user: process.env.DB_USER || 'root',
        password: process.env.DB_PASSWORD || '1234',
        database: process.env.NAME || 'connect_food'
    },
};

export default env;