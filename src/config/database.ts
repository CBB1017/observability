import { DataSource } from "typeorm";

export const postgresDataSource = new DataSource({
    type: "postgres",
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : 5432,
    username: process.env.DB_USER || "postgres",
    password: process.env.DB_PASS || "postgres",
    database: process.env.DB_NAME || "postgres",
    entities: ["dist/entities/*.js"], // if you use in local uncomment [process.env.NODE_ENV === "production" ? "dist/entities/*.js" : "src/entities/*.ts"],
    synchronize: process.env.NODE_ENV !== "production",
    migrations: ["dist/migrations/*.js"],
    logging: true,
});

export const initializePostgresDatabase = async () => {
    try {
        await postgresDataSource.initialize();
        console.log("PostgreSQL Data Source has been initialized!");
    } catch (error) {
        console.error("Error during Data Source initialization", error);
        throw error;
    }
};
