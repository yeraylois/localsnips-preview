/*************************************************************
 *   Project : LocalSnips (Preview)                          *
 *   File    : page.tsx                                       *
 *   Purpose : WEB SIMULATION OF macOS SERVICE MANAGER        *
 *   Author  : Yeray Lois Sanchez                             *
 *   Email   : yerayloissanchez@gmail.com                     *
 **************************************************************/

"use client";

import { useState, useEffect } from "react";
import { 
  Play, Square, Settings, RefreshCw, ExternalLink, 
  CheckCircle2, XCircle, Loader2, Database, Server, Cpu,
  ChevronLeft, Github, Linkedin, Globe, Terminal
} from "lucide-react";
import Link from "next/link";

// SERVICE STATUS TYPES
type ServiceStatus = "running" | "stopped" | "starting" | "stopping";

interface ServiceState {
  docker: ServiceStatus;
  postgres: ServiceStatus;
  redis: ServiceStatus;
  worker: ServiceStatus;
  web: ServiceStatus;
}


/**
 * WEB SIMULATION OF macOS SERVICE MANAGER.
 * ALLOWS STARTING/STOPPING THE LOCALSNIPS STACK IN DEMO MODE.
 * DISPLAYS SERVICE STATUS FOR DOCKER, POSTGRES, REDIS, WORKER, AND WEB.
 */
export default function ServiceManagerPage() {
  // DEMO: STARTS IN RUNNING STATE
  const [isRunning, setIsRunning] = useState(true);
  const [isStarting, setIsStarting] = useState(false);
  const [isStopping, setIsStopping] = useState(false);
  const [progress, setProgress] = useState(1);
  const [statusText, setStatusText] = useState("All services running");
  
  const [services, setServices] = useState<ServiceState>({
    docker: "running",
    postgres: "running",
    redis: "running",
    worker: "running",
    web: "running"
  });

  // SIMULATE START SEQUENCE
  const handleStart = () => {
    if (isStarting || isRunning) return;
    
    setIsStarting(true);
    setProgress(0);
    setStatusText("Initializing Docker...");
    
    const steps = [
      { progress: 0.2, text: "Starting Docker containers...", service: "docker" },
      { progress: 0.4, text: "Waiting for PostgreSQL...", service: "postgres" },
      { progress: 0.6, text: "Connecting to Redis...", service: "redis" },
      { progress: 0.8, text: "Spawning worker process...", service: "worker" },
      { progress: 1.0, text: "Starting web server...", service: "web" }
    ];
    
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        setProgress(step.progress);
        setStatusText(step.text);
        setServices(prev => ({ ...prev, [step.service]: "starting" }));
        
        // MARK PREVIOUS SERVICE AS RUNNING AFTER DELAY
        setTimeout(() => {
          setServices(prev => ({ ...prev, [step.service]: "running" }));
        }, 400);
        
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsStarting(false);
        setIsRunning(true);
        setProgress(1);
        setStatusText("All services running");
      }
    }, 800);
  };

  // SIMULATE STOP SEQUENCE
  const handleStop = () => {
    if (isStopping || !isRunning) return;
    
    setIsStopping(true);
    setProgress(0);
    setStatusText("Stopping web server...");
    
    const steps = [
      { progress: 0.2, text: "Stopping web server...", service: "web" },
      { progress: 0.4, text: "Terminating worker...", service: "worker" },
      { progress: 0.6, text: "Disconnecting Redis...", service: "redis" },
      { progress: 0.8, text: "Stopping PostgreSQL...", service: "postgres" },
      { progress: 1.0, text: "Shutting down Docker...", service: "docker" }
    ];
    
    let stepIndex = 0;
    const interval = setInterval(() => {
      if (stepIndex < steps.length) {
        const step = steps[stepIndex];
        setProgress(step.progress);
        setStatusText(step.text);
        setServices(prev => ({ ...prev, [step.service]: "stopping" }));
        
        setTimeout(() => {
          setServices(prev => ({ ...prev, [step.service]: "stopped" }));
        }, 400);
        
        stepIndex++;
      } else {
        clearInterval(interval);
        setIsStopping(false);
        setIsRunning(false);
        setProgress(0);
        setStatusText("All services stopped");
      }
    }, 600);
  };


  /**
   * RENDERS STATUS ICON BASED ON SERVICE STATE.
   * - Parameter status: Current service status
   * - Returns: Icon component with appropriate color
   */
  const ServiceStatusIcon = ({ status }: { status: ServiceStatus }) => {
    switch (status) {
      case "running":
        return <CheckCircle2 className="w-4 h-4 text-green-500" />;
      case "stopped":
        return <XCircle className="w-4 h-4 text-surface-400" />;
      case "starting":
      case "stopping":
        return <Loader2 className="w-4 h-4 text-amber-500 animate-spin" />;
    }
  };


  /**
   * RENDERS A SINGLE SERVICE ROW WITH NAME, ICON AND STATUS.
   * - Parameter name: Display name of the service
   * - Parameter icon: Lucide icon component
   * - Parameter status: Current service status
   */
  const ServiceRow = ({ name, icon: Icon, status }: { name: string; icon: any; status: ServiceStatus }) => (
    <div className="flex items-center justify-between py-3 px-4 bg-surface-50/80 dark:bg-surface-800 rounded-lg border border-surface-200 dark:border-surface-700/50 shadow-sm transition-colors duration-200 hover:bg-surface-100 dark:hover:bg-surface-700">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-surface-200/50 dark:bg-surface-700/50 flex items-center justify-center">
          <Icon className="w-4 h-4 text-surface-600 dark:text-surface-400" />
        </div>
        <span className="text-sm text-surface-900 dark:text-surface-100 font-medium">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-surface-500 capitalize">{status}</span>
        <ServiceStatusIcon status={status} />
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      {/* HEADER */}
      <div className="border-b border-surface-200 dark:border-surface-800 bg-surface-50/80 dark:bg-surface-900/80 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-4xl mx-auto px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link 
              href="/"
              className="p-2 rounded-lg hover:bg-surface-200/50 dark:hover:bg-surface-800/50 text-surface-500 hover:text-foreground transition-colors"
            >
              <ChevronLeft className="w-5 h-5" />
            </Link>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 shadow-lg shadow-indigo-500/20 flex items-center justify-center">
                <Terminal className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-foreground">Service Manager</h1>
                <p className="text-xs text-surface-500">LocalSnips Stack Control</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`px-3 py-1 rounded-full text-xs font-medium ${
              isRunning ? 'bg-green-500/10 text-green-400 border border-green-500/20' :
              isStarting ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
              isStopping ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
              'bg-surface-100 dark:bg-surface-800 text-surface-500 border border-surface-200 dark:border-surface-700'
            }`}>
              {isRunning ? '● Running' : isStarting ? '◐ Starting...' : isStopping ? '◐ Stopping...' : '○ Stopped'}
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-12">
        
        {/* STATUS CARD */}
        <div className="bg-surface-50 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-8 mb-8 shadow-sm dark:shadow-none transition-colors">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-xl font-bold mb-1 text-surface-900 dark:text-surface-50">Stack Status</h2>
              <p className="text-sm text-surface-500 dark:text-surface-400">{statusText}</p>
            </div>
            
            <div className="flex gap-3">
              {!isRunning && !isStarting && !isStopping && (
                <button
                  onClick={handleStart}
                  className="flex items-center gap-2 px-5 py-2.5 bg-green-600 hover:bg-green-500 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-green-600/20"
                >
                  <Play className="w-4 h-4" />
                  Start Stack
                </button>
              )}
              
              {isRunning && !isStopping && (
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-5 py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-red-600/20"
                >
                  <Square className="w-4 h-4" />
                  Stop Stack
                </button>
              )}
              
              {(isStarting || isStopping) && (
                <div className="flex items-center gap-2 px-5 py-2.5 bg-surface-200 dark:bg-surface-800 rounded-xl text-sm font-medium text-surface-500">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  {isStarting ? 'Starting...' : 'Stopping...'}
                </div>
              )}
            </div>
          </div>
          
          {/* PROGRESS BAR */}
          {(isStarting || isStopping) && (
            <div className="mb-6">
              <div className="h-2 bg-surface-100 dark:bg-surface-800 rounded-full overflow-hidden">
                <div 
                  className={`h-full transition-all duration-500 ${isStarting ? 'bg-brand-500' : 'bg-red-500'}`}
                  style={{ width: `${progress * 100}%` }}
                />
              </div>
            </div>
          )}
          
          {/* SERVICES GRID */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <ServiceRow name="Docker Engine" icon={Server} status={services.docker} />
            <ServiceRow name="PostgreSQL" icon={Database} status={services.postgres} />
            <ServiceRow name="Redis Cache" icon={Cpu} status={services.redis} />
            <ServiceRow name="AI Worker" icon={Cpu} status={services.worker} />
            <ServiceRow name="Web Server" icon={Globe} status={services.web} />
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-surface-50/50 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 mb-8">
          <h3 className="text-sm font-semibold text-surface-400 uppercase tracking-wider mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            <Link 
              href="/"
              className="flex flex-col items-center gap-2 p-4 bg-surface-100/50 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-xl transition-colors text-center border border-surface-200 dark:border-surface-700/50 shadow-sm"
            >
              <ExternalLink className="w-5 h-5 text-indigo-500 dark:text-indigo-400" />
              <span className="text-xs text-surface-700 dark:text-surface-300">Open App</span>
            </Link>
            <button className="flex flex-col items-center gap-2 p-4 bg-surface-100/50 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-xl transition-colors text-center border border-surface-200 dark:border-surface-700/50 shadow-sm">
              <RefreshCw className="w-5 h-5 text-amber-500 dark:text-amber-400" />
              <span className="text-xs text-surface-700 dark:text-surface-300">Restart</span>
            </button>
            <button className="flex flex-col items-center gap-2 p-4 bg-surface-100/50 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-xl transition-colors text-center border border-surface-200 dark:border-surface-700/50 shadow-sm">
              <Settings className="w-5 h-5 text-surface-500 dark:text-surface-400" />
              <span className="text-xs text-surface-700 dark:text-surface-300">Settings</span>
            </button>
            <Link
              href="/collections/graph"
              className="flex flex-col items-center gap-2 p-4 bg-surface-100/50 dark:bg-surface-800 hover:bg-surface-200 dark:hover:bg-surface-700 rounded-xl transition-colors text-center border border-surface-200 dark:border-surface-700/50 shadow-sm"
            >
              <Globe className="w-5 h-5 text-purple-500 dark:text-purple-400" />
              <span className="text-xs text-surface-700 dark:text-surface-300">Graph</span>
            </Link>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center pt-8 border-t border-surface-200 dark:border-surface-800">
          <p className="text-sm text-surface-500 mb-3">Created by: Yeray Lois Sánchez</p>
          <div className="flex items-center justify-center gap-6 mb-4">
            <a href="https://github.com/yeraylois" className="flex items-center gap-2 text-xs text-surface-500 hover:text-foreground transition-colors">
              <Github className="w-4 h-4" />
              GitHub
            </a>
            <a href="https://linkedin.com/in/yeray-lois" className="flex items-center gap-2 text-xs text-surface-500 hover:text-foreground transition-colors">
              <Linkedin className="w-4 h-4" />
              LinkedIn
            </a>
          </div>
          <p className="text-xs text-surface-500">LocalSnips © 2025</p>
        </div>
      </div>
      
      {/* DEMO BADGE */}
      <div className="fixed bottom-4 right-4 px-3 py-1.5 rounded-lg bg-indigo-500/20 border border-indigo-500/30 backdrop-blur-sm">
        <span className="text-xs font-medium text-indigo-300">Demo Mode - Web Simulation</span>
      </div>
    </div>
  );
}
