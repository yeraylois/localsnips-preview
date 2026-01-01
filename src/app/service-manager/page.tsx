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
  ChevronLeft, Globe
} from "lucide-react";
// Link import removed to avoid auto-tooltips on internal navigation hooks

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
   * @param status CURRENT SERVICE STATUS
   * @returns ICON COMPONENT WITH APPROPRIATE COLOR
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
   * @param name DISPLAY NAME OF THE SERVICE
   * @param icon LUCIDE ICON COMPONENT
   * @param status CURRENT SERVICE STATUS
   */
  const ServiceRow = ({ name, icon: Icon, status }: { name: string; icon: any; status: ServiceStatus }) => (
    <div className="flex items-center justify-between py-3 px-4 bg-surface-50/80 dark:bg-surface-800 rounded-lg shadow-sm transition-all duration-200 hover:bg-brand-500 dark:hover:bg-brand-500 group/row cursor-pointer">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-surface-200/50 dark:bg-surface-700/50 group-hover/row:bg-white/20 flex items-center justify-center transition-colors">
          <Icon className="w-4 h-4 text-surface-600 dark:text-surface-400 group-hover/row:text-white" />
        </div>
        <span className="text-sm text-surface-900 dark:text-surface-100 font-medium group-hover/row:text-white transition-colors">{name}</span>
      </div>
      <div className="flex items-center gap-2">
        <span className="text-xs text-surface-500 group-hover/row:text-white/80 transition-colors capitalize">{status}</span>
        <div className="group-hover/row:brightness-0 group-hover/row:invert transition-all">
            <ServiceStatusIcon status={status} />
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300 overflow-y-auto">
      {/* HEADER */}
      <div className="border-b border-surface-200 dark:border-surface-800 bg-surface-50/80 dark:bg-surface-900/80 backdrop-blur-xl sticky top-0 z-50 pt-[env(safe-area-inset-top)]">
        <div className="max-w-4xl mx-auto px-6 py-3 md:py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div 
              role="button"
              onClick={() => window.location.href = "/"}
              className="p-2 rounded-lg hover:bg-brand-500 text-brand-600 dark:text-brand-400 hover:text-white transition-all cursor-pointer"
            >
              <ChevronLeft className="w-5 h-5" />
            </div>
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-brand-500 shadow-lg shadow-brand-500/20 flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-bold text-brand-600 dark:text-brand-400">Service Manager</h1>
                <p className="text-xs text-surface-500">LocalSnips Stack Control</p>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] md:text-xs font-medium whitespace-nowrap ${
              isRunning ? 'bg-brand-500/10 text-brand-600 dark:text-brand-400 border border-brand-500' :
              isStarting ? 'bg-amber-500/10 text-amber-500 border border-amber-500/20' :
              isStopping ? 'bg-red-500/10 text-red-500 border border-red-500/20' :
              'bg-surface-100 dark:bg-surface-800 text-surface-500 border border-surface-200 dark:border-surface-700'
            }`}>
              <span className="leading-none">{isRunning ? '●' : isStarting ? '◐' : isStopping ? '◐' : '○'}</span>
              <span className="leading-none">{isRunning ? 'Running' : isStarting ? 'Starting...' : isStopping ? 'Stopping...' : 'Stopped'}</span>
            </span>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="max-w-4xl mx-auto px-6 py-8 md:py-12 pb-8">
        
        {/* DEMO BADGE */}
        <div className="px-3 py-1.5 rounded-lg bg-brand-500 shadow-sm mb-8 w-fit mx-auto">
          <span className="text-xs font-medium text-white">Demo Mode - Web Simulation</span>
        </div>

        {/* STATUS CARD */}
        <div className="bg-surface-50 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 md:p-8 mb-6 shadow-sm dark:shadow-none transition-all hover:bg-brand-500 group/status">
          <div className="flex items-center justify-between gap-4 mb-6">
            <div>
              <h2 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-1 group-hover/status:text-white transition-colors">Stack Status</h2>
              <p className="text-sm text-surface-500 dark:text-surface-400 group-hover/status:text-white/80 transition-colors">{statusText}</p>
            </div>
            
            <div className="flex gap-3">
              {!isRunning && !isStarting && !isStopping && (
                <button
                  onClick={handleStart}
                  className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-green-600 hover:bg-green-500 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-green-600/20"
                >
                  <Play className="w-4 h-4" />
                  <span className="hidden sm:inline">Start Stack</span>
                  <span className="sm:hidden">Start</span>
                </button>
              )}
              
              {isRunning && !isStopping && (
                <button
                  onClick={handleStop}
                  className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-red-600 hover:bg-red-500 rounded-xl text-sm font-semibold transition-colors shadow-lg shadow-red-600/20"
                >
                  <Square className="w-4 h-4" />
                  <span className="hidden sm:inline">Stop Stack</span>
                  <span className="sm:hidden">Stop</span>
                </button>
              )}
              
              {(isStarting || isStopping) && (
                <div className="flex items-center gap-2 px-4 py-2 md:px-5 md:py-2.5 bg-surface-200 dark:bg-surface-800 rounded-xl text-sm font-medium text-surface-500">
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
            <ServiceRow name="Web Server" icon={Globe} status={services.web} />
          </div>
        </div>

        {/* QUICK ACTIONS */}
        <div className="bg-surface-50 dark:bg-surface-900 rounded-2xl border border-surface-200 dark:border-surface-800 p-6 md:p-8 mb-6 shadow-sm dark:shadow-none transition-all hover:bg-brand-500 group/actions">
          <h2 className="text-sm font-semibold text-brand-600 dark:text-brand-400 uppercase tracking-wider mb-4 group-hover/actions:text-white transition-colors">Quick Actions</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div 
              role="button"
              onClick={() => window.location.href = "/"}
              className="flex items-center justify-between py-3 px-4 bg-surface-50/80 dark:bg-surface-800 rounded-lg shadow-sm transition-all duration-200 hover:bg-brand-500 dark:hover:bg-brand-500 group/row cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-200/50 dark:bg-surface-700/50 group-hover/row:bg-white/20 flex items-center justify-center transition-colors">
                  <ExternalLink className="w-4 h-4 text-surface-600 dark:text-surface-400 group-hover/row:text-white" />
                </div>
                <span className="text-sm text-surface-900 dark:text-surface-100 font-medium group-hover/row:text-white transition-colors">Open App</span>
              </div>
            </div>
            <div 
              role="button"
              className="flex items-center justify-between py-3 px-4 bg-surface-50/80 dark:bg-surface-800 rounded-lg shadow-sm transition-all duration-200 hover:bg-brand-500 dark:hover:bg-brand-500 group/row cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-200/50 dark:bg-surface-700/50 group-hover/row:bg-white/20 flex items-center justify-center transition-colors">
                  <RefreshCw className="w-4 h-4 text-surface-600 dark:text-surface-400 group-hover/row:text-white" />
                </div>
                <span className="text-sm text-surface-900 dark:text-surface-100 font-medium group-hover/row:text-white transition-colors">Restart</span>
              </div>
            </div>
            <div 
              role="button"
              className="flex items-center justify-between py-3 px-4 bg-surface-50/80 dark:bg-surface-800 rounded-lg shadow-sm transition-all duration-200 hover:bg-brand-500 dark:hover:bg-brand-500 group/row cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-200/50 dark:bg-surface-700/50 group-hover/row:bg-white/20 flex items-center justify-center transition-colors">
                  <Settings className="w-4 h-4 text-surface-500 dark:text-surface-400 group-hover/row:text-white" />
                </div>
                <span className="text-sm text-surface-900 dark:text-surface-100 font-medium group-hover/row:text-white transition-colors">Settings</span>
              </div>
            </div>
            <div
              role="button"
              onClick={() => window.location.href = "/collections/graph"}
              className="flex items-center justify-between py-3 px-4 bg-surface-50/80 dark:bg-surface-800 rounded-lg shadow-sm transition-all duration-200 hover:bg-brand-500 dark:hover:bg-brand-500 group/row cursor-pointer"
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg bg-surface-200/50 dark:bg-surface-700/50 group-hover/row:bg-white/20 flex items-center justify-center transition-colors">
                  <Globe className="w-4 h-4 text-surface-600 dark:text-surface-400 group-hover/row:text-white" />
                </div>
                <span className="text-sm text-surface-900 dark:text-surface-100 font-medium group-hover/row:text-white transition-colors">Graph</span>
              </div>
            </div>
          </div>
        </div>

        {/* FOOTER */}
        <div className="text-center pt-8 border-t border-surface-200 dark:border-surface-800">
          <p className="text-sm text-surface-500 mb-3">Created by: Yeray Lois Sánchez</p>
          <div className="flex items-center justify-center gap-6 mb-4">
            <a href="https://github.com/yeraylois" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z"/></svg>
              GitHub
            </a>
            <a href="https://linkedin.com/in/yeray-lois" target="_blank" rel="noopener noreferrer" className="flex items-center gap-2 text-xs text-surface-500 hover:text-brand-600 dark:hover:text-brand-400 transition-colors">
              <svg className="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z"/></svg>
              LinkedIn
            </a>
          </div>
          <p className="text-xs text-surface-500">LocalSnips © 2025</p>
        </div>
      </div>
    </div>
  );
}

