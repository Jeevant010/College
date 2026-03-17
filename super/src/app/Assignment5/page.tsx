"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Link from "next/link";

interface RequestHistory {
  id: string;
  method: string;
  url: string;
  status: number | null;
  timestamp: string;
  response: any;
  body?: string;
}

export default function Assignment5() {
  const [method, setMethod] = useState("GET");
  const [url, setUrl] = useState("https://jsonplaceholder.typicode.com/posts/1");
  const [body, setBody] = useState('{\n  "title": "foo",\n  "body": "bar",\n  "userId": 1\n}');
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<{
    status: number | null;
    statusText: string;
    data: any;
    time: number;
    headers: Record<string, string>;
  } | null>(null);
  const [history, setHistory] = useState<RequestHistory[]>([]);
  const [activeTab, setActiveTab] = useState<"params" | "body" | "headers">("params");
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [showToast, setShowToast] = useState(false);
  const [toastMsg, setToastMsg] = useState("");

  
  useEffect(() => {
    const savedHistory = sessionStorage.getItem("api-history");
    if (savedHistory) {
      setHistory(JSON.parse(savedHistory));
    }
  }, []);

  const triggerToast = (msg: string) => {
    setToastMsg(msg);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 2000);
  };

  const saveToHistory = (newRequest: RequestHistory) => {
    const updatedHistory = [newRequest, ...history].slice(0, 20);
    setHistory(updatedHistory);
    sessionStorage.setItem("api-history", JSON.stringify(updatedHistory));
  };

  const formatJson = () => {
    try {
      const parsed = JSON.parse(body);
      setBody(JSON.stringify(parsed, null, 2));
      triggerToast("JSON Formatted");
    } catch (e) {
      triggerToast("Invalid JSON");
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    triggerToast("Copied to clipboard");
  };

  const handleSend = async () => {
    setLoading(true);
    setResponse(null);
    const start = performance.now();

    try {
      const options: RequestInit = {
        method,
        headers: {
          "Content-Type": "application/json",
          "X-Assignment": "Assignment-05",
          "X-Student": "Jeevant"
        },
      };

      if (["POST", "PUT", "PATCH"].includes(method)) {
        options.body = body;
      }

      const res = await fetch(url, options);
      const end = performance.now();
      
      let data;
      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        data = await res.json();
      } else {
        data = await res.text();
      }

      const headers: Record<string, string> = {};
      res.headers.forEach((value, key) => {
        headers[key] = value;
      });

      const result = {
        status: res.status,
        statusText: res.statusText,
        data,
        time: Math.round(end - start),
        headers,
      };

      setResponse(result);

      saveToHistory({
        id: Math.random().toString(36).substr(2, 9),
        method,
        url,
        status: res.status,
        timestamp: new Date().toLocaleTimeString(),
        response: data,
        body: options.body as string,
      });
    } catch (error: any) {
      const end = performance.now();
      setResponse({
        status: null,
        statusText: "Error",
        data: error.message || "Failed to fetch",
        time: Math.round(end - start),
        headers: {},
      });
    } finally {
      setLoading(false);
    }
  };

  const addAuth = () => {
    const separator = url.includes("?") ? "&" : "?";
    if (!url.includes("auth=Jeevant")) {
      setUrl(`${url}${separator}auth=Jeevant`);
      triggerToast("Auth added to URL");
    }
  };

  const loadFromHistory = (item: RequestHistory) => {
    setMethod(item.method);
    setUrl(item.url);
    if (item.body) setBody(item.body);
    setResponse({
      status: item.status,
      statusText: item.status === 200 ? "OK" : item.status === 201 ? "Created" : "Processed",
      data: item.response,
      time: 0,
      headers: {},
    });
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white flex flex-col font-sans selection:bg-indigo-500/30 overflow-hidden">
      
      
      <AnimatePresence>
        {showToast && (
          <motion.div 
            initial={{ opacity: 0, y: 50, x: "-50%" }}
            animate={{ opacity: 1, y: 0, x: "-50%" }}
            exit={{ opacity: 0, y: 20, x: "-50%" }}
            className="fixed bottom-10 left-1/2 z-[100] bg-indigo-600 px-6 py-3 rounded-2xl shadow-2xl font-bold text-sm tracking-wide border border-indigo-400"
          >
            {toastMsg}
          </motion.div>
        )}
      </AnimatePresence>


      <header className="h-16 border-b border-white/10 bg-white/5 backdrop-blur-xl flex items-center justify-between px-6 shrink-0 z-50">
        <div className="flex items-center gap-4">
          <Link href="/" className="p-2 hover:bg-white/5 rounded-lg transition-colors group">
            <svg className="w-5 h-5 text-white/40 group-hover:text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </Link>
          <div className="h-6 w-px bg-white/10"></div>
          <h1 className="text-lg font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 to-purple-400">
            CRUD Operations Workspace
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button 
            onClick={addAuth}
            className="px-3 py-1.5 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-medium hover:bg-indigo-500/20 transition-all"
          >
            Authenticate: Jeevant
          </button>
          <span className="px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs rounded-full font-mono">
            Assignment 05
          </span>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">


        <motion.aside 
          initial={false}
          animate={{ width: isSidebarOpen ? 300 : 0, opacity: isSidebarOpen ? 1 : 0 }}
          className="border-r border-white/10 bg-black/40 backdrop-blur-md overflow-hidden flex flex-col shrink-0"
        >
          <div className="p-4 border-b border-white/5 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-white/60 uppercase tracking-wider">History</h2>
            <button 
              onClick={() => { setHistory([]); sessionStorage.removeItem("api-history"); }}
              className="text-[10px] text-white/30 hover:text-red-400 transition-colors"
            >
              Clear
            </button>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-2 custom-scrollbar">
            {history.length === 0 ? (
              <div className="text-center py-10 text-white/20 text-xs">No recent activity</div>
            ) : (
              history.map((item) => (
                <button
                  key={item.id}
                  onClick={() => loadFromHistory(item)}
                  className="w-full p-3 rounded-xl bg-white/5 border border-white/5 hover:border-indigo-500/30 hover:bg-indigo-500/5 transition-all text-left group"
                >
                  <div className="flex justify-between items-start mb-1">
                    <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded ${
                      item.method === 'GET' ? 'bg-blue-500/20 text-blue-400' :
                      item.method === 'POST' ? 'bg-emerald-500/20 text-emerald-400' :
                      item.method === 'PUT' ? 'bg-amber-500/20 text-amber-400' :
                      'bg-red-500/20 text-red-400'
                    }`}>
                      {item.method}
                    </span>
                    <span className="text-[10px] text-white/30">{item.timestamp}</span>
                  </div>
                  <p className="text-xs text-white/60 truncate font-mono">{item.url}</p>
                </button>
              ))
            )}
          </div>
        </motion.aside>


        <main className="flex-1 flex flex-col overflow-hidden relative">
          
          <button 
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="absolute left-0 top-1/2 -translate-y-1/2 w-4 h-12 bg-white/5 border border-l-0 border-white/10 rounded-r-lg flex items-center justify-center hover:bg-white/10 transition-colors z-40 shadow-xl"
          >
            <div className={`w-1 h-3 bg-white/20 rounded-full transition-transform ${isSidebarOpen ? '' : 'rotate-180'}`}></div>
          </button>

          <div className="flex-1 overflow-y-auto custom-scrollbar p-6 space-y-6 pb-20">
            
            <div className="flex flex-col md:flex-row gap-3">
              <div className="flex-1 flex bg-white/5 border border-white/10 rounded-2xl overflow-hidden focus-within:border-indigo-500/50 transition-all shadow-lg">
                <select 
                  value={method}
                  onChange={(e) => setMethod(e.target.value)}
                  className="bg-white/5 border-r border-white/10 px-4 font-bold text-sm outline-none hover:bg-white/10 transition-colors"
                >
                  <option className="bg-[#1a1a2e]" value="GET">GET</option>
                  <option className="bg-[#1a1a2e]" value="POST">POST</option>
                  <option className="bg-[#1a1a2e]" value="PUT">PUT</option>
                  <option className="bg-[#1a1a2e]" value="PATCH">PATCH</option>
                  <option className="bg-[#1a1a2e]" value="DELETE">DELETE</option>
                </select>
                <input 
                  type="text" 
                  value={url}
                  onChange={(e) => setUrl(e.target.value)}
                  placeholder="Enter request URL"
                  className="flex-1 bg-transparent px-4 py-4 text-sm outline-none font-mono placeholder:text-white/20"
                />
              </div>
              <button 
                onClick={handleSend}
                disabled={loading}
                className={`px-8 py-4 rounded-2xl font-bold text-sm tracking-wide transition-all active:scale-[0.98] flex items-center justify-center gap-2 ${
                  loading 
                  ? "bg-indigo-500/50 cursor-not-allowed" 
                  : "bg-indigo-500 hover:bg-indigo-600 shadow-lg shadow-indigo-500/20"
                }`}
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                ) : (
                  <>
                    SEND
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                  </>
                )}
              </button>
            </div>


            <div className="bg-white/5 border border-white/10 rounded-3xl overflow-hidden flex flex-col min-h-[300px] backdrop-blur-xl">
              <div className="flex items-center justify-between border-b border-white/10 px-6">
                <div className="flex">
                  {(["params", "body", "headers"] as const).map((tab) => (
                    <button
                      key={tab}
                      onClick={() => setActiveTab(tab)}
                      className={`px-4 py-4 text-xs font-semibold uppercase tracking-widest transition-all relative ${
                        activeTab === tab ? "text-indigo-400" : "text-white/40 hover:text-white/60"
                      }`}
                    >
                      {tab}
                      {activeTab === tab && (
                        <motion.div layoutId="activeTab" className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-500" />
                      )}
                    </button>
                  ))}
                </div>
                {activeTab === "body" && (
                  <button 
                    onClick={formatJson}
                    className="text-[10px] font-bold text-indigo-400/60 hover:text-indigo-400 transition-colors bg-indigo-400/5 px-2 py-1 rounded border border-indigo-400/20"
                  >
                    FORMAT JSON
                  </button>
                )}
              </div>
              <div className="flex-1 p-6 font-mono text-sm overflow-hidden">
                {activeTab === "body" ? (
                  <textarea
                    value={body}
                    onChange={(e) => setBody(e.target.value)}
                    className="w-full h-full bg-black/20 rounded-xl p-4 outline-none border border-white/5 focus:border-indigo-500/30 transition-colors resize-none custom-scrollbar text-indigo-100"
                    placeholder="Enter JSON body..."
                    disabled={method === "GET" || method === "DELETE"}
                  />
                ) : activeTab === "params" ? (
                  <div className="space-y-3">
                    <p className="text-xs text-indigo-300/60 italic px-2">Key-Value parameters parsed from URL.</p>
                    <div className="space-y-1">
                      {url.includes('?') ? url.split('?')[1].split('&').map((p, i) => {
                        const [k, v] = p.split('=');
                        return (
                          <div key={i} className="grid grid-cols-2 gap-2">
                             <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5 text-white/80">{k}</div>
                             <div className="bg-white/5 px-4 py-2 rounded-lg border border-white/5 text-indigo-300">{v || '(empty)'}</div>
                          </div>
                        );
                      }) : (
                        <div className="p-10 text-center text-white/10 text-xs">No parameters found in URL</div>
                      )}
                    </div>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex justify-between items-center text-xs text-white/30 mb-4 px-2">
                      <span>Header Name</span>
                      <span>Value</span>
                    </div>
                    <div className="space-y-2">
                      <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-indigo-300">Content-Type</span>
                        <span className="text-white/60">application/json</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-indigo-300">X-Assignment</span>
                        <span className="text-white/60">Assignment-05</span>
                      </div>
                      <div className="flex justify-between items-center p-3 rounded-xl bg-white/5 border border-white/5">
                        <span className="text-indigo-300">X-Student</span>
                        <span className="text-white/60">Jeevant</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>


            <div className="space-y-4">
              <div className="flex items-center justify-between px-2">
                <h3 className="text-sm font-semibold text-white/60 uppercase tracking-wider">Response</h3>
                {response && (
                  <div className="flex items-center gap-4 text-[11px] font-mono">
                    <span className="flex items-center gap-1.5">
                      Status: 
                      {response ? (
                        <span className={response.status && response.status < 400 ? "text-emerald-400" : "text-red-400"}>
                          {response.status || "Error"} {response.statusText}
                        </span>
                      ) : (
                        <span className="text-red-400">Error</span>
                      )}
                    </span>
                    <span className="text-white/30">|</span>
                    <span className="text-indigo-300">Time: {response?.time}ms</span>
                    <button 
                      onClick={() => response && copyToClipboard(JSON.stringify(response.data, null, 2))}
                      className="ml-2 p-1.5 hover:bg-white/5 rounded text-indigo-400 transition-colors"
                      title="Copy Response Body"
                    >
                      <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 5H6a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2v-1M8 5a2 2 0 002 2h2a2 2 0 002-2M8 5a2 2 0 012-2h2a2 2 0 012 2m0 0h2a2 2 0 012 2v3m2 4H10m0 0l3-3m-3 3l3 3" />
                      </svg>
                    </button>
                  </div>
                )}
              </div>

              <div className="bg-[#0f0f1a] border border-white/10 rounded-3xl overflow-hidden min-h-[200px] flex flex-col shadow-2xl relative">
                {!response && !loading ? (
                  <div className="flex-1 flex flex-col items-center justify-center text-white/10 py-20">
                    <svg className="w-16 h-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                    </svg>
                    <p className="font-medium text-lg">Empty Workspace</p>
                    <p className="text-xs text-white/5">Send a request to start debugging</p>
                  </div>
                ) : loading ? (
                  <div className="flex-1 flex flex-col items-center justify-center gap-4 py-20 bg-indigo-500/5">
                    <div className="relative w-16 h-16">
                      <div className="absolute inset-0 border-4 border-indigo-500/10 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-transparent border-t-indigo-500 rounded-full animate-spin"></div>
                      <div className="absolute inset-2 border-2 border-transparent border-t-purple-500 rounded-full animate-spin-slow"></div>
                    </div>
                    <p className="text-xs font-mono text-indigo-400 animate-pulse tracking-widest uppercase">Network Request in Progress...</p>
                  </div>
                ) : (
                  <div className="flex-1 p-6 font-mono text-sm h-full max-h-[600px] overflow-y-auto custom-scrollbar bg-black/40">
                    <pre className="text-indigo-200 whitespace-pre-wrap">
                      {response && (typeof response.data === 'object' 
                        ? JSON.stringify(response.data, null, 2) 
                        : response.data)}
                    </pre>
                  </div>
                )}
              </div>
            </div>


            <motion.footer 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              className="pt-12 pb-8 border-t border-white/5"
            >
              <div className="bg-gradient-to-br from-indigo-500/10 to-purple-500/10 border border-white/10 rounded-3xl p-8 backdrop-blur-xl relative overflow-hidden group">
                <div className="absolute top-0 left-0 w-1 h-full bg-indigo-500/50"></div>
                <h3 className="text-xl font-black mb-4 tracking-tight flex items-center gap-2">
                  <span className="p-1.5 bg-indigo-500/20 rounded-lg">🎓</span>
                  Assignment Conclusion
                </h3>
                <p className="text-white/60 leading-relaxed text-sm md:text-base italic font-medium">
                  "This assignment demonstrated the fundamental concepts of handling real-time data and performing asynchronous network operations in JavaScript. By implementing a full-featured CRUD client that interacts with RESTful endpoints, manages JSON state, and handles dynamic URL parameters, I learned how to bridge the gap between complex server interactions and a premium, responsive frontend UI. The use of React's state management combined with asynchronous Fetch API calls provided a deep understanding of modern web communication patterns."
                </p>
                <div className="mt-6 flex justify-between items-center text-[10px] text-white/20 font-bold uppercase tracking-[0.2em]">
                   <span>Prepared by: Jeevant</span>
                   <span>Course: Web Development 2026</span>
                </div>
              </div>
            </motion.footer>
          </div>
        </main>
      </div>

      <style jsx global>{`
        @keyframes spin-slow {
          from { transform: rotate(0deg); }
          to { transform: rotate(-360deg); }
        }
        .animate-spin-slow {
          animation: spin-slow 1.5s linear infinite;
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: transparent;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.1);
        }
        select option {
          background: #0a0a0f;
          color: white;
        }
      `}</style>
    </div>
  );
}
