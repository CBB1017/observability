import requestTestRoutes from "./requestTest";
import {postgresDataSource} from "../config/database";

export default async function registerRoutes(fastify: any) {
    await fastify.register(requestTestRoutes, { dataSource: postgresDataSource });
}
