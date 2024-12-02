import cors from "@fastify/cors";
import fastifyMetrics, { IMetricsPluginOptions } from "fastify-metrics";
import {recordRequestDuration} from './tracer'
import {FastifyReply, FastifyRequest} from "fastify";
export default async function registerPlugins(fastify: any) {
    // CORS 플러그인
    await fastify.register(cors, { origin: "*"});

    // Metrics 플러그인
    const metricsOptions: IMetricsPluginOptions = {
        promClient: null,
        endpoint: "/metrics",
        name: "metrics",
        defaultMetrics: { enabled: true },
        routeMetrics: { enabled: true, groupStatusCodes: true },
        clearRegisterOnInit: false,
    };
    await fastify.register(fastifyMetrics, metricsOptions);

    // 요청 시작 시간을 기록하는 전역 훅
    fastify.addHook('onRequest', async (request : FastifyRequest) : Promise<void> => {
        request.headers['start-time'] = Date.now().toString(); // 요청 시작 시간 기록
        console.log('testme');
    });

// 요청 처리 시간을 측정하고 기록하는 전역 훅
    fastify.addHook('onResponse', async (request: FastifyRequest, reply: FastifyReply) : Promise<void>  => {
        const startTime = parseInt(request.headers['start-time'] as string, 10);
        const duration = (Date.now() - startTime) / 1000; // 처리 시간(초 단위)
        const method = request.method;
        const status = reply.statusCode;

        // Histogram에 데이터 기록
        recordRequestDuration(duration, { method, status });
        console.log('Recording duration:', duration, JSON.stringify({ method, status }));
    });
}
