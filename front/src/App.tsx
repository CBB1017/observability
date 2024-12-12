import React, { useState } from "react";
import axios from "axios";

const App: React.FC = () => {
    const [output, setOutput] = useState<string>("");

    const runSiegeCommands = async () => {
        try {
            setOutput("");
            const urls = [
                { url: "http://localhost:8080/", concurrency: 1, repetitions: 10 },
                { url: "http://localhost:8080/io_task", concurrency: 3, repetitions: 5 },
                { url: "http://localhost:8080/cpu_task", concurrency: 2, repetitions: 5 },
                { url: "http://localhost:8080/random_sleep", concurrency: 5, repetitions: 3 },
                { url: "http://localhost:8080/random_status", concurrency: 2, repetitions: 10 },
                { url: "http://localhost:8080/chain", concurrency: 2, repetitions: 3 },
                { url: "http://localhost:8080/error_test", concurrency: 1, repetitions: 1 },
            ];

            const results: { url: string; status: number; data: unknown }[] = [];
            for (const command of urls) {
                for (let i = 0; i < command.repetitions; i++) {
                    await axios
                        .get(command.url, {
                            validateStatus: () => true, // 모든 상태 코드를 성공으로 처리
                        })
                        .then((response) => {
                            results.unshift({ url: command.url, status: response.status, data: response.data });
                            setOutput(JSON.stringify(results, null, 2));
                        })
                        .catch((error) => {
                            console.error("에러:", error);
                        });
                }
            }
            results.unshift({ url: "", status: 0, data: { message: "Run Siege Commands is done" } });
            setOutput(JSON.stringify(results, null, 2));
        } catch (error: any) {
            setOutput(`Error: ${error.message}`);
        }
    };

    const runCurlCommands = async () => {
        try {
            setOutput("");
            const curlRequests = [
                {
                    method: "GET",
                    url: "http://localhost:8080/",
                    headers: { traceparent: "00-df853039b602c93e641526aaa7d67b8c-339f2b7a83c7d606-01" },
                },
                {
                    method: "POST",
                    url: "http://localhost:8080/peanuts",
                    data: { name: "Snoopy", description: "A cute beagle" },
                },
                {
                    method: "POST",
                    url: "http://localhost:8080/peanuts",
                    data: { name: "Woodstock", description: "A cute bird" },
                },
                {
                    method: "POST",
                    url: "http://localhost:8080/peanuts",
                    data: { name: "Charlie Brown", description: "Snoopy's owner" },
                },
                { method: "GET", url: "http://localhost:8080/peanuts/1" },
                { method: "GET", url: "http://localhost:8080/peanuts/2" },
                { method: "GET", url: "http://localhost:8080/peanuts/3" },
            ];

            const results = [];
            for (const request of curlRequests) {
                const response = await axios({
                    method: request.method,
                    url: request.url,
                    headers: request.headers,
                    data: request.data,
                });
                results.unshift({ url: request.url, status: response.status, data: response.data });
                setOutput(JSON.stringify(results, null, 2));
            }
            results.unshift({ data: { message: "Run Curl Commands is done" } });
            setOutput(JSON.stringify(results, null, 2));
        } catch (error: any) {
            setOutput(`Error: ${error.message}`);
        }
    };

    return (
        <div style={appStyle}>
            <h1 style={headerStyle}>Observability Test</h1>
            <div style={buttonContainerStyle}>
                <button onClick={runSiegeCommands} style={buttonStyle}>
                    Run Siege Commands
                </button>
                <button onClick={runCurlCommands} style={buttonStyle}>
                    Run Curl Commands
                </button>
            </div>
            <div style={linkContainerStyle}>
                <a href="http://localhost:3000" target="_blank" rel="noopener noreferrer" style={linkStyle}>
                    Grafana
                </a>
                <a href="http://localhost:8080" target="_blank" style={linkStyle}>
                    App A
                </a>
                <a href="http://localhost:8081" target="_blank" style={linkStyle}>
                    App B
                </a>
                <a href="http://localhost:8082" target="_blank" style={linkStyle}>
                    App C
                </a>
            </div>
            <textarea
                value={output}
                readOnly
                rows={15}
                style={textareaStyle}
            />
            <div style={iframeContainerStyle}>
                <iframe
                    src="http://localhost:3000/grafana/d-solo/ae6h49yp1qqyoa/new-dashboard?orgId=1&refresh=10s&panelId=1&from=now-1h&to=now"
                    style={iframeLogStyle}
                />
                <iframe
                    src="http://localhost:3000/grafana/d-solo/ae6h49yp1qqyoa/new-dashboard?orgId=1&refresh=10s&panelId=2&from=now-1h&to=now"
                    style={iframeLogStyle}
                />
                <iframe
                    src="http://localhost:3000/grafana/d-solo/ae6h49yp1qqyoa/new-dashboard?orgId=1&refresh=10s&panelId=3&from=now-1h&to=now"
                    style={iframeLogStyle}
                />
                <iframe
                    src="http://localhost:3000/grafana/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=10s&panelId=20&from=now-24h&to=now"
                    style={iframeMetricStyle}
                />
                <iframe
                    src="http://localhost:3000/grafana/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=10s&panelId=16&from=now-24h&to=now"
                    style={iframeMetricStyle}
                />
            </div>
        </div>
    );
};

const appStyle: React.CSSProperties = {
    padding: "20px",
    fontFamily: "Arial, sans-serif",
};

const headerStyle : React.CSSProperties = {
    textAlign: "center",
    color: "#4A90E2",
};

const buttonContainerStyle : React.CSSProperties = {
    display: "flex",
    justifyContent: "center",
    marginBottom: "20px",
};

const buttonStyle: React.CSSProperties = {
    margin: "0 10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "5px",
    transition: "background-color 0.3s",
};

const textareaStyle: React.CSSProperties = {
    width: "100%",
    padding: "10px",
    fontSize: "14px",
    fontFamily: "monospace",
    border: "1px solid #ccc",
    borderRadius: "5px",
    marginBottom: "20px",
};

const iframeContainerStyle : React.CSSProperties= {
    display: "flex",
    flexWrap: "wrap",
    gap: "10px",
    justifyContent: "center",
};

const iframeLogStyle: React.CSSProperties = {
    border: "none",
    width: "700px",
    height: "250px",
};
const iframeMetricStyle: React.CSSProperties = {
    border: "none",
    width: "300px",
    height: "200px",
};
const linkContainerStyle: React.CSSProperties = {
    display: "flex",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    gap: "20px",
    marginTop: "20px",
};
const linkStyle: React.CSSProperties = {
    textDecoration: "none",
    fontSize: "18px",
    fontWeight: "bold",
    color: "#4A90E2",
    backgroundColor: "#f0f8ff",
    padding: "10px 20px",
    borderRadius: "5px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s, transform 0.2s",
    display: "inline-block",
    textAlign: "center",

};

export default App;
