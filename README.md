# observability
https://github.com/blueswen/spring-boot-observability 를 참고하여 만든 관측가능성(observability) 구축 테스트.. 
특정 버전이 아닌 24-10-22 기준 latest 버전으로 구동시켜보고 싶었습니다.

#  openTelemetry로 수집 및 전송하여 tempo에 연동 참조글
https://medium.com/@dudwls96/opentelemetry-grafana-loki-tempo-prometheus를-활용한-spring-boot-observability-구성하기-f977df45bb70

# 샘플 docker-compose를 시작할 때 loki driver 관련 오류 나타나는 에러 슈팅
https://github.com/grafana/loki/issues/698

# [request-script.sh] 실행 에러 (windows에서만)

```groovy

//리눅스는 LF(Line Feed) 윈도우는 CRLF(Carriage Return Line Feed)을 사용해서 발생하는 문제
./request-script.sh: line 3: syntax error near unexpected token `$'do\r''
'/request-script.sh: line 3: `do

//변환기 설치
sudo apt install dos2unix
//변환
dos2unix request-script.sh
```

# java에서 openTelemetry 추가

https://github.com/open-telemetry/opentelemetry-java-instrumentation/releases

# otel, tempo 시작 중 에러 해결 

```groovy
2024-10-22 10:08:33 [otel.javaagent 2024-10-22 01:08:33:547 +0000] [OkHttp http://tempo:4327/...] ERROR io.opentelemetry.exporter.internal.http.HttpExporter - Failed to export logs. The request could not be executed. Full error message: Failed to connect to tempo/172.19.0.4:4327
2024-10-22 10:08:33 java.net.ConnectException: Failed to connect to tempo/172.19.0.4:4327
2024-10-22 10:08:33     at okhttp3.internal.connection.RealConnection.connectSocket(RealConnection.kt:297)
2024-10-22 10:08:33     at okhttp3.internal.connection.RealConnection.connect(RealConnection.kt:207)
2024-10-22 10:08:33     at okhttp3.internal.connection.ExchangeFinder.findConnection(ExchangeFinder.kt:226)
2024-10-22 10:08:33     at okhttp3.internal.connection.ExchangeFinder.findHealthyConnection(ExchangeFinder.kt:106)
2024-10-22 10:08:33     at okhttp3.internal.connection.ExchangeFinder.find(ExchangeFinder.kt:74)
2024-10-22 10:08:33     at okhttp3.internal.connection.RealCall.initExchange$okhttp(RealCall.kt:255)
2024-10-22 10:08:33     at okhttp3.internal.connection.ConnectInterceptor.intercept(ConnectInterceptor.kt:32)
2024-10-22 10:08:33     at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:109)
2024-10-22 10:08:33     at okhttp3.internal.cache.CacheInterceptor.intercept(CacheInterceptor.kt:95)
2024-10-22 10:08:33     at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:109)
2024-10-22 10:08:33     at okhttp3.internal.http.BridgeInterceptor.intercept(BridgeInterceptor.kt:83)
2024-10-22 10:08:33     at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:109)
2024-10-22 10:08:33     at okhttp3.internal.http.RetryAndFollowUpInterceptor.intercept(RetryAndFollowUpInterceptor.kt:76)
2024-10-22 10:08:33     at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:109)
2024-10-22 10:08:33     at io.opentelemetry.exporter.sender.okhttp.internal.RetryInterceptor.intercept(RetryInterceptor.java:91)
2024-10-22 10:08:33     at okhttp3.internal.http.RealInterceptorChain.proceed(RealInterceptorChain.kt:109)
2024-10-22 10:08:33     at okhttp3.internal.connection.RealCall.getResponseWithInterceptorChain$okhttp(RealCall.kt:201)
2024-10-22 10:08:33     at okhttp3.internal.connection.RealCall$AsyncCall.run(RealCall.kt:517)
2024-10-22 10:08:33     at java.util.concurrent.ThreadPoolExecutor.runWorker(ThreadPoolExecutor.java:1149)
2024-10-22 10:08:33     at java.util.concurrent.ThreadPoolExecutor$Worker.run(ThreadPoolExecutor.java:624)
2024-10-22 10:08:33     at java.lang.Thread.run(Thread.java:750)
2024-10-22 10:08:33 Caused by: java.net.ConnectException: Connection refused (Connection refused)
2024-10-22 10:08:33     at java.net.PlainSocketImpl.socketConnect(Native Method)
2024-10-22 10:08:33     at java.net.AbstractPlainSocketImpl.doConnect(AbstractPlainSocketImpl.java:350)
2024-10-22 10:08:33     at java.net.AbstractPlainSocketImpl.connectToAddress(AbstractPlainSocketImpl.java:206)
2024-10-22 10:08:33     at java.net.AbstractPlainSocketImpl.connect(AbstractPlainSocketImpl.java:188)
2024-10-22 10:08:33     at java.net.SocksSocketImpl.connect(SocksSocketImpl.java:392)
2024-10-22 10:08:33     at java.net.Socket.connect(Socket.java:607)
2024-10-22 10:08:33     at okhttp3.internal.platform.Platform.connectSocket(Platform.kt:128)
2024-10-22 10:08:33     at okhttp3.internal.connection.RealConnection.connectSocket(RealConnection.kt:295)
2024-10-22 10:08:33     ... 20 more
```

[0.0.0.0 endpoint 추가.](https://opentelemetry.io/docs/collector/configuration/)

# otel 전송에러 발생(prometheus)

[--web.enable-remote-write-receiver](https://prometheus.io/docs/prometheus/latest/feature_flags/) 추가

# otel 전송에러 발생(loki, tempo)

tempo의 포트는 4327, 4328로 되어있다. 하지만 그건 호스트 포트고, 도커 내부 네트워크에서는 어차피 IP로 따로 해석하기 때문에 4317, 4318 그대로 사용하자..(결국 사용 안하는 포트)

이후 tls 비활성화 옵션까지 넣고 tempo는 정상화

loki는 https://grafana.com/docs/loki/latest/send-data/otel/ 공식 문서 참고하여 수정.

# otel-collector에서 host 못찾는 에러
otel-collector가 재기동되면 otel-collector의 service name을 참조할 수 없어서 에러가 발생했다.
otel-collector가 먼저 실행되어야 한다. depends_on 추가. 

# 시스템메트릭 추가
node_exporter가 존재하지 않으면 애플리케이션 내 서비스 메트릭만 모니터링이 가능하다.
docker-compose 내에 추가하여 시스템 메트릭도 확인할 수 있게 변경.

# TODO
- 설정 파일에 command 녹이는 과정 필요.
- 실제 MSA 방식으로 구축할 때 어떤 식으로 설계할 지 분석 필요.


---

## nodejs 버전 추가
- js에서 ts 설정을 함께 사용하는 프로젝트입니다.
- opentelemetry SDK를 활용하여 service metric, application log, trace 전송. 노드 리소스 메트릭은 node-exporter로 전송.
- datasource 연계 및 생성된 dashboard는 포함되지 않았습니다. https://github.com/blueswen/spring-boot-observability 를 참조하여 만들어보세요!
- ## 실행 방법
  ```bash
  wsl 실행 후 
  cd docker
  docker-compose up -d
    ```
- 현재 버전(24-12-02)으로 아래와 같은 오류가 발생하나 동작엔 이상없습니다. 추후 수정하겠습니다.
- ```text
    Error: @opentelemetry/api: Attempted duplicate registration of API: trace
    ```
- 구조가 변경되었는데, 기존 prometheus에서 scrape 해가던 방식에서 `PeriodicExportingMetricReader`를 이용해 직접 opentelemetry-collector로 전송합니다.
- loki 또한 logProvider를 이용해 `BatchLogRecordProcessor` 방식으로 전송합니다.
- 결국 trace, log, metric(service)를 앱에서 직접 opentelemetry-collector로 전송합니다.
# TODO
- SDK 중복 적용 시도 오류 수정
- Exemplars를 이용한 tempo <-> loki 추적 테스트가 완료됐는데 이미지에 포함시키지는 않았습니다. 별도 이미지를 만들어서 공유하겠습니다.