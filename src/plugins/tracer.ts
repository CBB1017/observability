import {NodeSDK} from '@opentelemetry/sdk-node';
import {getNodeAutoInstrumentations} from '@opentelemetry/auto-instrumentations-node';
import {OTLPTraceExporter} from '@opentelemetry/exporter-trace-otlp-http';
import {MeterProvider, PeriodicExportingMetricReader} from '@opentelemetry/sdk-metrics';
import {Resource} from '@opentelemetry/resources';
import {metrics} from "@opentelemetry/api";
import {BatchLogRecordProcessor, LoggerProvider} from '@opentelemetry/sdk-logs';
import {ATTR_SERVICE_NAME, ATTR_SERVICE_VERSION} from '@opentelemetry/semantic-conventions';
import {OTLPMetricExporter} from "@opentelemetry/exporter-metrics-otlp-grpc";
import {OTLPLogExporter} from "@opentelemetry/exporter-logs-otlp-grpc";

// Define Resources with Constants
const resource = new Resource({
    [ATTR_SERVICE_NAME]: `${process.env.OTEL_SERVICE_NAME}`,
    [ATTR_SERVICE_VERSION]: '1.0.0',
});

// Trace Exporter Configuration
const traceExporter = new OTLPTraceExporter({
    url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}`,
});

// OTLP Metric Exporter 초기화
const metricExporter = new OTLPMetricExporter({
    url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}`,
});

// Metric Reader 초기화
const metricReader = new PeriodicExportingMetricReader({
    exporter: metricExporter,
    exportIntervalMillis: 5000, // 메트릭 전송 간격 (5초)
});

// MeterProvider 초기화
const meterProvider = new MeterProvider({
    resource
});

// MeterProvider를 글로벌로 등록
metrics.setGlobalMeterProvider(meterProvider);

// OTLP Metric Exporter 초기화
const logExporter = new OTLPLogExporter({
    url: `${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}`,
});

// LoggerProvider 생성
const loggerProvider = new LoggerProvider({
    resource: resource,
});

// BatchLogRecordProcessor 추가 (Collector로 로그 전송)
const batchProcessor = new BatchLogRecordProcessor(logExporter);
loggerProvider.addLogRecordProcessor(batchProcessor);
export const otelLogger = loggerProvider.getLogger('example-otel-logger');
// Fastify 로거 초기화


const originalConsoleLog = console.log;
const originalConsoleError = console.error;

console.log = (...args: any[]) => {
    otelLogger.emit({
        severityText: 'INFO',
        body: args.join(' '),
        attributes: {},
        timestamp: Date.now(), // Optional: 현재 시간
    });
    originalConsoleLog.apply(console, args);
};

console.error = (...args: any[]) => {
    otelLogger.emit({
        severityText: 'ERROR',
        body: args.join(' '),
        attributes: {},
        timestamp: Date.now(), // Optional: 현재 시간
    });
    originalConsoleError.apply(console, args);
};
// OpenTelemetry Node SDK
const sdk = new NodeSDK({
    traceExporter,
    resource,
    metricReader,
    instrumentations: [
        getNodeAutoInstrumentations({
            '@opentelemetry/instrumentation-fastify': {enabled: true},
            '@opentelemetry/instrumentation-http': {enabled: true},
            '@opentelemetry/instrumentation-pg': {enabled: true},
        }),
    ],
});
// OpenTelemetry SDK 시작
sdk.start();
console.log('OpenTelemetry SDK started');

// Graceful Shutdown
process.on('SIGTERM', () => {
    sdk.shutdown().then(() => console.log('OpenTelemetry SDK shut down'));
});