import React, { useState } from "react";
import ReactJson from "react-json-view";
import { fetchApiSteps } from "../../../constantData/mock_data";

const ApiSandbox = () => {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("");
  const [headers, setHeaders] = useState([{ key: "", value: "" }]);
  const [body, setBody] = useState("{}");
  const [response, setResponse] = useState(null);
  const [resHeaders, setResHeaders] = useState(null);
  const [responseTime, setResponseTime] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [apiName, setApiName] = useState("");
  const [apiInstructions, setApiInstructions] = useState("");
  const [highlightUrl, setHighlightUrl] = useState(false);

  const handleSendRequest = async () => {
    setLoading(true);
    setError(null);
    setResponse(null);
    setResHeaders(null);
    setResponseTime(null);

    try {
      if (["POST", "PUT", "PATCH"].includes(method)) {
        try {
          JSON.parse(body);
        } catch {
          setError("❌ Invalid JSON in request body.");
          setLoading(false);
          return;
        }
      }

      const formattedHeaders = headers.reduce((acc, h) => {
        if (h.key) acc[h.key] = h.value;
        return acc;
      }, {});

      const options = {
        method,
        headers: {
          ...formattedHeaders,
          "Content-Type": "application/json",
        },
      };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        options.body = body;
      }

      const startTime = performance.now();
      const res = await fetch(url, options);
      const endTime = performance.now();
      setResponseTime((endTime - startTime).toFixed(2));

      const contentType = res.headers.get("content-type");
      const data = contentType?.includes("application/json")
        ? await res.json()
        : await res.text();

      const headersObj = {};
      res.headers.forEach((val, key) => {
        headersObj[key] = val;
      });

      setResHeaders(headersObj);
      setResponse({
        status: res.status,
        statusText: res.statusText,
        data,
      });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleHeaderChange = (index, field, value) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const addHeader = () => setHeaders([...headers, { key: "", value: "" }]);
  const removeHeader = () => {
    if (headers.length > 1) {
      setHeaders(headers.slice(0, -1));
    }
  };

  const handleFetchInstructions = async () => {
    if (!apiName.trim()) return;

    setApiInstructions("⏳ Fetching setup instructions...");

    const result = await fetchApiSteps(apiName);
    setApiInstructions(result);

    const match = result.match(/__API_SAMPLE__:\s*(https?:\/\/[^\s]+)/);
    if (match) {
      setUrl(match[1]);
      setHighlightUrl(true);
      setTimeout(() => setHighlightUrl(false), 2000);
    } else {
      setApiInstructions((prev) =>
        prev + "\n\n🔐 This API may require an API key or manual URL setup."
      );
    }
  };

  const generateCurlCommand = () => {
    const base = [`curl -X ${method} "${url}"`];

    headers.forEach((h) => {
      if (h.key) {
        base.push(`-H "${h.key}: ${h.value}"`);
      }
    });

    if (["POST", "PUT", "PATCH"].includes(method)) {
      base.push(`-d '${body}'`);
    }

    return base.join(" \\\n  ");
  };

  const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text);
    alert("📋 Copied to clipboard!");
  };

  return (
    <div className="h-screen w-5xl mx-auto p-6 bg-white shadow-xl rounded-2xl mt-3 overflow-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        🧪 Dev API Testing
      </h1>

      {/* API Assistant Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">
          🔍 API Discovery Assistant
        </h2>
        <div className="flex flex-col md:flex-row gap-4">
          <input
            type="text"
            placeholder="Enter free API name (e.g., OpenWeatherMap)"
            value={apiName}
            onChange={(e) => setApiName(e.target.value)}
            className="border p-2 rounded flex-1"
          />
          <button
            onClick={handleFetchInstructions}
            className="bg-purple-600 hover:bg-purple-700 text-white font-semibold px-6 py-2 rounded shadow-md"
          >
            Get API Instructions
          </button>
        </div>
        {apiInstructions && (
          <div className="bg-gray-50 border-l-4 border-purple-500 text-sm p-4 rounded mb-6 whitespace-pre-wrap mt-2">
            {apiInstructions}
          </div>
        )}
      </div>

      {/* Request Section */}
      <div className="flex flex-col md:flex-row gap-4 mb-4">
        <select
          value={method}
          onChange={(e) => setMethod(e.target.value)}
          className="border p-2 rounded w-full md:w-32 bg-white shadow-sm"
        >
          {["GET", "POST", "PUT", "PATCH", "DELETE"].map((m) => (
            <option key={m}>{m}</option>
          ))}
        </select>

        <input
          type="text"
          placeholder="Enter API URL"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          className={`flex-1 border p-2 rounded shadow-sm ${
            highlightUrl ? "ring-2 ring-purple-500" : ""
          }`}
        />

        <button
          onClick={handleSendRequest}
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-6 py-2 rounded shadow-md"
        >
          {loading ? "Sending..." : "Send"}
        </button>
      </div>

      {/* Headers Section */}
      <div className="mb-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Headers</h2>
        {headers.map((h, i) => (
          <div key={i} className="flex gap-2 mb-2">
            <input
              type="text"
              placeholder="Key"
              value={h.key}
              onChange={(e) => handleHeaderChange(i, "key", e.target.value)}
              className="border p-2 rounded w-1/2"
            />
            <input
              type="text"
              placeholder="Value"
              value={h.value}
              onChange={(e) => handleHeaderChange(i, "value", e.target.value)}
              className="border p-2 rounded w-1/2"
            />
          </div>
        ))}
        <div className="flex justify-between">
          <button onClick={addHeader} className="text-blue-500 mt-2">
            + Add Header
          </button>
          <button onClick={removeHeader} className="text-blue-500 mt-2">
            - Remove Header
          </button>
        </div>
      </div>

      {/* Request Body Section */}
      {["POST", "PUT", "PATCH"].includes(method) && (
        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            Request Body (JSON)
          </h2>
          <textarea
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows="6"
            className="w-full border p-2 rounded font-mono text-sm"
          />
        </div>
      )}

      {/* Response Section */}
      <div className="mt-6">
        <h2 className="text-lg font-semibold text-gray-700 mb-2">Response</h2>
        {error && <p className="text-red-500 mb-2">Error: {error}</p>}
        {response ? (
          <div className="bg-gray-100 p-4 rounded shadow-inner">
            <div className="flex justify-between text-sm font-medium mb-2">
              <span>
                ✅ Status: {response.status} {response.statusText}
              </span>
              <span>⏱ {responseTime} ms</span>
            </div>

            {typeof response.data === "object" ? (
              <ReactJson
                src={response.data}
                collapsed={false}
                enableClipboard={false}
                displayDataTypes={false}
                name={false}
              />
            ) : (
              <pre className="whitespace-pre-wrap text-sm text-gray-800">
                {response.data}
              </pre>
            )}
          </div>
        ) : (
          <p className="text-gray-500">No response yet.</p>
        )}

        {/* Response Headers */}
        {resHeaders && (
          <div className="mt-4 text-sm">
            <h3 className="font-semibold text-gray-700 mb-1">Response Headers</h3>
            <pre className="bg-gray-50 border p-2 rounded overflow-x-auto whitespace-pre-wrap">
              {JSON.stringify(resHeaders, null, 2)}
            </pre>
          </div>
        )}
      </div>

      {/* Curl Command Section */}
      {response && (
        <div className="mt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">
            💻 cURL Command
          </h2>
          <div className="relative">
            <pre className="bg-black text-green-300 p-4 rounded font-mono text-sm overflow-x-auto whitespace-pre-wrap">
              {generateCurlCommand()}
            </pre>
            <button
              className="absolute top-2 right-2 text-white text-xs bg-blue-500 px-2 py-1 rounded"
              onClick={() => copyToClipboard(generateCurlCommand())}
            >
              Copy
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ApiSandbox;
