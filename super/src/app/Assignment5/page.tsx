"use client";

import React, { useEffect, useState, useRef } from "react";
import { io, Socket } from "socket.io-client";
import { motion, AnimatePresence } from "framer-motion";

interface Notification {
  id: number;
  message: string;
  timestamp: string;
}

export default function Assignment5() {
  const [httpNotifications, setHttpNotifications] = useState<Notification[]>([]);
  const [wsNotifications, setWsNotifications] = useState<Notification[]>([]);
  const [isConnected, setIsConnected] = useState(false);
  const [httpLoading, setHttpLoading] = useState(false);
  const [httpLastFetched, setHttpLastFetched] = useState<string | null>(null);

  const socketRef = useRef<Socket | null>(null);

  // HTTP Polling Logic
  useEffect(() => {
    const fetchNotifications = async () => {
      setHttpLoading(true);
      try {
        const response = await fetch("http://localhost:3001/api/notifications");
        const data = await response.json();
        if (data.success) {
          setHttpNotifications(data.data);
          setHttpLastFetched(new Date().toLocaleTimeString());
        }
      } catch (error) {
        console.error("HTTP Fetch Error:", error);
      } finally {
        setTimeout(() => setHttpLoading(false), 500); // Artificial delay to show loading state
      }
    };

    fetchNotifications(); // Initial fetch
    const interval = setInterval(fetchNotifications, 5000); // Poll every 5 seconds

    return () => clearInterval(interval);
  }, []);

  // WebSocket Logic
  useEffect(() => {
    // Connect to WebSocket server
    socketRef.current = io("http://localhost:3001");

    socketRef.current.on("connect", () => {
      setIsConnected(true);
    });

    socketRef.current.on("disconnect", () => {
      setIsConnected(false);
    });

    socketRef.current.on("initialData", (data: Notification[]) => {
      setWsNotifications(data);
    });

    socketRef.current.on("notification", (newNotification: Notification) => {
      setWsNotifications((prev) => {
        const updated = [newNotification, ...prev];
        return updated.slice(0, 10); // Keep only latest 10
      });
    });

    return () => {
      socketRef.current?.disconnect();
    };
  }, []);

  const renderNotificationCard = (notif: Notification, method: "http" | "ws") => {
    const timeSent = new Date(notif.timestamp);
    const now = new Date();
    const age = Math.max(0, now.getTime() - timeSent.getTime());
    const isOld = method === "http" && age > 4000;

    return (
      <motion.div
        key={notif.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.3 }}
        className={`p-4 rounded-xl border flex flex-col gap-2 ${
          method === "ws"
            ? "bg-indigo-900/40 border-indigo-500/50"
            : isOld
            ? "bg-red-900/30 border-red-500/50"
            : "bg-emerald-900/30 border-emerald-500/50"
        } backdrop-blur-md shadow-lg relative overflow-hidden`}
      >
        <div className="absolute top-0 left-0 w-1 h-full bg-gradient-to-b from-transparent via-white/20 to-transparent"></div>
        <div className="flex justify-between items-center text-sm">
          <span className="font-semibold text-white/90">ID: {notif.id}</span>
          <span className="text-white/50 text-xs">
            {timeSent.toLocaleTimeString()}
          </span>
        </div>
        <p className="text-white/80 text-lg">{notif.message}</p>
        
        {method === "http" && (
          <div className="text-xs text-white/40 mt-1 flex justify-between">
            <span>Age: {(age / 1000).toFixed(1)}s</span>
            {isOld && <span className="text-red-400">Delayed</span>}
          </div>
        )}
      </motion.div>
    );
  };

  return (
    <div className="min-h-screen bg-[#0a0a0f] text-white p-6 md:p-12 font-sans selection:bg-indigo-500/30">
      <div className="max-w-7xl mx-auto space-y-12">
        {/* Header */}
        <header className="text-center space-y-4">
          <motion.h1 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400"
          >
            Real-Time Communication
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.2 }}
            className="text-white/60 text-lg max-w-2xl mx-auto"
          >
            Comparing architecture patterns: Stateless HTTP Polling vs Full-Duplex WebSockets
          </motion.p>
        </header>

        {/* Dashboard Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* HTTP Polling Column */}
          <div className="flex flex-col space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
              <div className="absolute top-0 right-0 p-4">
                <span className="flex h-3 w-3 relative">
                  {httpLoading && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${httpLoading ? 'bg-emerald-500' : 'bg-emerald-500/20'}`}></span>
                </span>
              </div>
              
              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="bg-emerald-500/20 text-emerald-400 p-2 rounded-lg">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                  </svg>
                </span>
                HTTP Polling
              </h2>
              <div className="mt-4 flex flex-col space-y-2">
                <p className="text-sm text-white/50">
                  Client actively requests data every 5 seconds. High overhead, high latency.
                </p>
                <div className="flex justify-between text-xs bg-black/30 p-3 rounded-lg border border-white/5">
                  <span className="text-white/60">Poll Interval: 5000ms</span>
                  <span className="text-white/60">Last Fetch: {httpLastFetched || "Never"}</span>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-4">Latest Inbound Data</h3>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {httpNotifications.length > 0 ? (
                    httpNotifications.map(n => renderNotificationCard(n, "http"))
                  ) : (
                    <p className="text-white/30 text-center py-8">Waiting for data...</p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>


          {/* WebSocket Column */}
          <div className="flex flex-col space-y-6">
            <div className="bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl relative overflow-hidden">
               <div className="absolute top-0 right-0 p-4">
                <span className="flex h-3 w-3 relative">
                  {isConnected && (
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
                  )}
                  <span className={`relative inline-flex rounded-full h-3 w-3 ${isConnected ? 'bg-indigo-500' : 'bg-red-500'}`}></span>
                </span>
              </div>

              <h2 className="text-2xl font-bold flex items-center gap-3">
                <span className="bg-indigo-500/20 text-indigo-400 p-2 rounded-lg">
                  <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </span>
                WebSockets
              </h2>
              <div className="mt-4 flex flex-col space-y-2">
                <p className="text-sm text-white/50">
                  Single persistent connection. Server pushes events instantly. Zero polling overhead.
                </p>
                <div className="flex justify-between items-center text-xs bg-black/30 p-3 rounded-lg border border-white/5">
                  <span className="text-white/60">Status:</span>
                  <span className={`px-2 py-1 rounded-full ${isConnected ? 'bg-indigo-500/20 text-indigo-300' : 'bg-red-500/20 text-red-300'}`}>
                    {isConnected ? 'Connected' : 'Disconnected'}
                  </span>
                </div>
              </div>
            </div>

            <div className="flex-1 bg-white/5 border border-white/10 rounded-2xl p-6 backdrop-blur-xl flex flex-col gap-4">
              <h3 className="text-lg font-semibold text-white/80 border-b border-white/10 pb-4">Live Event Stream</h3>
              <div className="space-y-4 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
                <AnimatePresence>
                  {wsNotifications.length > 0 ? (
                    wsNotifications.map(n => renderNotificationCard(n, "ws"))
                  ) : (
                    <p className="text-white/30 text-center py-8">Awaiting stream...</p>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </div>

        </div>
      </div>
      
      {/* Global Style for scrollbar hiding/styling if needed */}
      <style dangerouslySetInnerHTML={{__html: `
        .custom-scrollbar::-webkit-scrollbar {
          width: 6px;
        }
        .custom-scrollbar::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.05);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.2);
        }
      `}} />
    </div>
  );
}
