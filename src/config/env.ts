import path from "node:path";
import dotenv from "dotenv";

export const loadEnv = () => {
    const env = process.env.NODE_ENV || "development";
    const envFilePath = path.resolve(process.cwd(), `.env.${env}`);
    dotenv.config({ path: envFilePath });

    console.log(`Loaded environment: ${env}`);
    console.log(`Server running on port: ${process.env.PORT}`);
};
