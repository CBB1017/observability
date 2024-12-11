import React, {useState} from "react";
import axios from "axios";

const App: React.FC = () => {
    const [output, setOutput] = useState<string>("");

    const runSiegeCommands = async () => {
        try {
            setOutput("");
            const urls = [
                {url: "http://localhost:8080/", concurrency: 1, repetitions: 10},
                {url: "http://localhost:8080/io_task", concurrency: 3, repetitions: 5},
                {url: "http://localhost:8080/cpu_task", concurrency: 2, repetitions: 5},
                {url: "http://localhost:8080/random_sleep", concurrency: 5, repetitions: 3},
                {url: "http://localhost:8080/random_status", concurrency: 2, repetitions: 10},
                {url: "http://localhost:8080/chain", concurrency: 2, repetitions: 3},
                {url: "http://localhost:8080/error_test", concurrency: 1, repetitions: 1},
            ];

            const results: { url: string; status: number; data: unknown; }[] = [];
            for (const command of urls) {
                for (let i = 0; i < command.repetitions; i++) {
                    await axios.get(command.url, {
                        validateStatus: function () {
                            // 모든 상태 코드를 성공으로 처리
                            return true
                        },
                    }).then((response) => {
                        console.log('응답:', response.status, response.data);
                        results.unshift({url: command.url, status: response.status, data: response.data});
                        setOutput(JSON.stringify(results, null, 2));
                    })
                        .catch((error) => {
                            console.error('에러:', error);
                        });
                }
            }
            results.unshift({
                url: "", status: 0,
                data: {"message": "Run Siege Commands is done"}
            });
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
                    headers: {traceparent: "00-df853039b602c93e641526aaa7d67b8c-339f2b7a83c7d606-01"}
                },
                {
                    method: "POST",
                    url: "http://localhost:8080/peanuts",
                    data: {name: "Snoopy", description: "A cute beagle"}
                },
                {
                    method: "POST",
                    url: "http://localhost:8080/peanuts",
                    data: {name: "Woodstock", description: "A cute bird"}
                },
                {
                    method: "POST",
                    url: "http://localhost:8080/peanuts",
                    data: {name: "Charlie Brown", description: "Snoopy's owner"}
                },
                {method: "GET", url: "http://localhost:8080/peanuts/1"},
                {method: "GET", url: "http://localhost:8080/peanuts/2"},
                {method: "GET", url: "http://localhost:8080/peanuts/3"},
            ];

            const results = [];
            for (const request of curlRequests) {
                const response = await axios({
                    method: request.method,
                    url: request.url,
                    headers: request.headers,
                    data: request.data,
                });
                results.unshift({url: request.url, status: response.status, data: response.data});
                setOutput(JSON.stringify(results, null, 2));
            }
            results.unshift({data: {"message": "Run Curl Commands is done"}});
            setOutput(JSON.stringify(results, null, 2));
        } catch (error: any) {
            setOutput(`Error: ${error.message}`);
        }
    };

    return (
        <div style={{padding: "20px"}}>
            <h1>Observability Test</h1>
            <div style={{marginBottom: "20px"}}>
                <button onClick={runSiegeCommands} style={buttonStyle}>
                    Run Siege Commands
                </button>
                <button onClick={runCurlCommands} style={buttonStyle}>
                    Run Curl Commands
                </button>
            </div>
            <textarea
                value={output}
                readOnly
                rows={15}
                style={{
                    width: "100%",
                    padding: "10px",
                    fontSize: "14px",
                    fontFamily: "monospace",
                }}
            />
            <iframe
                src="http://localhost:3000/grafana/d-solo/ae6h49yp1qqyoa/new-dashboard?orgId=1&refresh=10s&panelId=1&from=now-1h&to=now"
                width="700" height="200"
            />
            <iframe
                src="http://localhost:3000/grafana/d-solo/rYdddlPWk/node-exporter-full?orgId=1&refresh=10s&panelId=20&from=now-24h&to=now"
                width="450" height="200"></iframe>

        </div>
    );
};

const buttonStyle = {
    marginRight: "10px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
};

export default App;
