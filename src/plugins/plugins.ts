import cors from "@fastify/cors";
import fastifyMetrics, {IMetricsPluginOptions} from "fastify-metrics";
import fastifyRedis from 'fastify-redis';

export default async function registerPlugins(fastify: any) {
    // CORS 플러그인
    await fastify.register(cors, {origin: "*"});
    // Metrics 플러그인
    const metricsOptions: IMetricsPluginOptions = {
        promClient: null,
        endpoint: "/metrics",
        name: "metrics",
        defaultMetrics: {enabled: true},
        routeMetrics: {enabled: true, groupStatusCodes: true, routeBlacklist: ["/metrics"]},
        clearRegisterOnInit: false,

    };
    await fastify.register(fastifyMetrics, metricsOptions);

    await fastify.register(fastifyRedis, {
        host: process.env.REDIS_HOST,
        port: 6379,
        password: process.env.REDIS_PASSWORD,
    });
}
