import cors from "@fastify/cors";
import fastifyMetrics, {IMetricsPluginOptions} from "fastify-metrics";

export default async function registerPlugins(fastify: any) {
    // CORS 플러그인
    await fastify.register(cors, {origin: "*"});
    // Metrics 플러그인
    const metricsOptions: IMetricsPluginOptions = {
        promClient: null,
        endpoint: "/metrics",
        name: "metrics",
        defaultMetrics: {enabled: true},
        routeMetrics: {enabled: true, groupStatusCodes: true},
        clearRegisterOnInit: false,
    };
    await fastify.register(fastifyMetrics, metricsOptions);
}
