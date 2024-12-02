import "reflect-metadata";
import Fastify from "fastify";
import {initializePostgresDatabase} from "./config/database";
import {loadEnv} from "./config/env";
import registerPlugins from "./plugins/plugins";
import registerRoutes from "./routes";
import {otelLogger} from "./plugins/tracer";

loadEnv(); // 환경 변수 로드

const fastify = Fastify({logger: true});
// Fastify의 로그 후크를 활용하여 OpenTelemetry와 통합
fastify.addHook('onRequest', (req, reply, done) => {
    const logMessage = `Incoming request: ${req.method} ${req.url}`;
    otelLogger.emit({
        severityText: 'INFO',
        body: logMessage,
        attributes: {
            method: req.method,
            url: req.url,
        },
    });
    req.log.info(logMessage);
    done();
});
// 서버 실행
const start = async () => {
    try {
        // 데이터베이스 초기화
        await initializePostgresDatabase()
        // 플러그인 등록
        await registerPlugins(fastify);
        // 라우트 등록
        await registerRoutes(fastify);
        const port = process.env.PORT ? parseInt(process.env.PORT, 10) : 8080;
        await fastify.listen({port, host: '0.0.0.0'});
        console.log(`Server is running on http://localhost:${port}`);
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};

start();
